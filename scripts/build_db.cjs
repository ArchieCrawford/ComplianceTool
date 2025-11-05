// Usage:
//   node scripts/build_db.cjs --in "C:\path\FolderA;C:\path\FolderB" --out ".\src\data\devices.db" --run-date "2025-11-04"
// If --run-date omitted, uses today (local).

const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const Database = require('better-sqlite3');
const minimist = require('minimist');

const args = minimist(process.argv.slice(2));
const inDirs = (args.in || '').split(';').map(s => s.trim()).filter(Boolean);
if (!inDirs.length) {
  console.error('Missing --in "dirA;dirB"');
  process.exit(1);
}
const outDb = args.out || path.resolve('.', 'src', 'data', 'devices.db');
const runDate = args['run-date'] || new Date().toISOString().slice(0,10);

// ---- helpers ----
const excelDateToISO = (v) => {
  if (v == null || v === '') return null;
  if (typeof v === 'number') {
    const epoch = new Date(Date.UTC(1899, 11, 30));
    const dt = new Date(epoch.getTime() + v * 86400000);
    return dt.toISOString();
  }
  const parsed = new Date(v);
  return isNaN(parsed) ? null : parsed.toISOString();
};

const toBool = (v) => {
  const s = String(v ?? '').trim().toLowerCase();
  return ['true','1','yes','y'].includes(s);
};

const normalizeKey = (k) => String(k||'').trim().toLowerCase().replace(/\s+/g,'_');

const FIELD_MAP = [
  { re: /^(host.?name|computer|machine|asset(_)?name)$/i, key: 'hostname' },
  { re: /^(normalized_)?os(_platform|_name)?$/i, key: 'os' },
  { re: /^(system|device)_type$/i, key: 'deviceType' },
  { re: /^endpoint_?compliance$/i, key: 'complianceStatus' },
  { re: /^compliance_?last_?scan(_date)?$/i, key: 'lastSeen' },
  { re: /^percent.*passing|^%.*passing|^passing_%$/i, key: 'percentPassing' },
  { re: /^end(_)?of(_)?life$/i, key: 'endOfLife' },
  { re: /^crowdstrike(_)?status$/i, key: 'crowdstrikeStatus' },
  { re: /^tanium(_)?status$/i, key: 'taniumStatus' },
  { re: /^jamf(_)?status$/i, key: 'jamfStatus' },
];

const canonicalizeRow = (row) => {
  const out = {};
  for (const [k, v] of Object.entries(row)) {
    const key = String(k).trim();
    let mappedKey = null;
    for (const m of FIELD_MAP) {
      if (m.re.test(key)) { mappedKey = m.key; break; }
    }
    if (!mappedKey) continue;
    out[mappedKey] = v;
  }

  if (out.lastSeen) out.lastSeen = excelDateToISO(out.lastSeen);
  if (out.percentPassing != null && out.percentPassing !== '') {
    const n = Number(String(out.percentPassing).replace('%',''));
    out.percentPassing = isNaN(n) ? null : n;
  }
  if (out.endOfLife != null) out.endOfLife = toBool(out.endOfLife);

  if (out.complianceStatus) {
    const s = String(out.complianceStatus).toLowerCase();
    if (/(grace)/.test(s)) out.complianceStatus = 'grace period';
    else if (/(non[-\s]?compliant|fail|failing|out[-\s]?of[-\s]?comp)/.test(s)) out.complianceStatus = 'non-compliant';
    else if (/(compliant|pass|passing)/.test(s)) out.complianceStatus = 'compliant';
  }

  return out;
};

const findExcelFiles = (dirs) => {
  const files = [];
  for (const d of dirs) {
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d)) {
      if (/\.(xlsx|xlsm)$/i.test(f)) files.push(path.join(d, f));
    }
  }
  return files;
};

const readWorkbooks = (paths) => {
  const rows = [];
  for (const p of paths) {
    try {
      const wb = xlsx.readFile(p, {cellDates:false, cellNF:false, cellText:false});
      for (const sheetName of wb.SheetNames) {
        const ws = wb.Sheets[sheetName];
        if (!ws) continue;
        const data = xlsx.utils.sheet_to_json(ws, {defval: ''});
        for (const r of data) rows.push(canonicalizeRow(r));
      }
    } catch (e) {
      console.warn(`Failed reading ${p}: ${e.message}`);
    }
  }
  return rows;
};

const dedupe = (rows) => {
  const best = new Map();
  const score = (r) => Object.values(r).filter(v => v!=='' && v!=null).length;
  for (const r of rows) {
    if (!r.hostname) continue;
    const cur = best.get(r.hostname);
    if (!cur || score(r) > score(cur)) best.set(r.hostname, r);
  }
  return Array.from(best.values());
};

const ensureDir = (p) => fs.mkdirSync(path.dirname(p), {recursive:true});

const initDb = (db) => {
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS asset_history (
      run_date TEXT NOT NULL,
      hostname TEXT NOT NULL,
      os TEXT,
      deviceType TEXT,
      complianceStatus TEXT,
      lastSeen TEXT,
      percentPassing REAL,
      endOfLife INTEGER,
      crowdstrikeStatus TEXT,
      taniumStatus TEXT,
      jamfStatus TEXT,
      PRIMARY KEY (run_date, hostname)
    );

    CREATE TABLE IF NOT EXISTS asset_summary (
      run_date TEXT PRIMARY KEY,
      total_devices INTEGER,
      active_devices INTEGER,
      compliant_devices INTEGER,
      noncompliant_devices INTEGER,
      grace_devices INTEGER,
      compliance_pct REAL,
      workstations INTEGER,
      servers INTEGER,
      eol_devices INTEGER,
      cs_missing INTEGER,
      tanium_missing INTEGER,
      jamf_missing INTEGER
    );

    CREATE INDEX IF NOT EXISTS idx_hist_run ON asset_history(run_date);
    CREATE INDEX IF NOT EXISTS idx_hist_status ON asset_history(complianceStatus);
  `);
};

const insertHistory = (db, runDate, rows) => {
  db.prepare(`DELETE FROM asset_history WHERE run_date = ?`).run(runDate);
  const ins = db.prepare(`
    INSERT INTO asset_history (
      run_date, hostname, os, deviceType, complianceStatus, lastSeen,
      percentPassing, endOfLife, crowdstrikeStatus, taniumStatus, jamfStatus
    ) VALUES (@run_date, @hostname, @os, @deviceType, @complianceStatus, @lastSeen,
              @percentPassing, @endOfLife, @crowdstrikeStatus, @taniumStatus, @jamfStatus)
  `);
  const tx = db.transaction((rows) => {
    for (const r of rows) ins.run(r);
  });

  const payload = rows.map(r => ({
    run_date: runDate,
    hostname: r.hostname ?? '',
    os: r.os ?? null,
    deviceType: r.deviceType ?? null,
    complianceStatus: r.complianceStatus ?? null,
    lastSeen: r.lastSeen ?? null,
    percentPassing: r.percentPassing ?? null,
    endOfLife: r.endOfLife ? 1 : 0,
    crowdstrikeStatus: r.crowdstrikeStatus ?? null,
    taniumStatus: r.taniumStatus ?? null,
    jamfStatus: r.jamfStatus ?? null,
  }));

  tx(payload);
};

const calcSummary = (rows) => {
  const total = rows.length;
  const now = Date.now();
  const sixtyDaysMs = 60 * 86400000;
  const isActive = (r) => {
    const ls = r.lastSeen ? Date.parse(r.lastSeen) : NaN;
    const recent = !isNaN(ls) && (now - ls) <= sixtyDaysMs;
    const toolAny = [r.crowdstrikeStatus, r.taniumStatus, r.jamfStatus].some(Boolean);
    return recent || toolAny;
  };

  const activeRows = rows.filter(isActive);
  const active = activeRows.length;

  const c = activeRows.filter(r => (r.complianceStatus||'').toLowerCase()==='compliant').length;
  const n = activeRows.filter(r => (r.complianceStatus||'').toLowerCase()==='non-compliant').length;
  const g = activeRows.filter(r => (r.complianceStatus||'').toLowerCase()==='grace period').length;

  const workstations = activeRows.filter(r => /workstation|laptop|desktop/i.test(r.deviceType||'')).length;
  const servers = activeRows.filter(r => /server/i.test(r.deviceType||'')).length;

  const eol = activeRows.filter(r => !!r.endOfLife).length;

  const csMissing = activeRows.filter(r => !r.crowdstrikeStatus || /missing|not\s*installed/i.test(r.crowdstrikeStatus)).length;
  const tanMissing = activeRows.filter(r => !r.taniumStatus || /missing|not\s*installed/i.test(r.taniumStatus)).length;
  const jamfMissing = activeRows.filter(r => !r.jamfStatus || /missing|not\s*installed/i.test(r.jamfStatus)).length;

  const compliancePct = active ? Math.round((c / active) * 10000)/100 : 0;

  return {
    total_devices: total,
    active_devices: active,
    compliant_devices: c,
    noncompliant_devices: n,
    grace_devices: g,
    compliance_pct: compliancePct,
    workstations,
    servers,
    eol_devices: eol,
    cs_missing: csMissing,
    tanium_missing: tanMissing,
    jamf_missing: jamfMissing
  };
};

const upsertSummary = (db, runDate, s) => {
  db.prepare(`REPLACE INTO asset_summary (
    run_date,total_devices,active_devices,compliant_devices,noncompliant_devices,grace_devices,
    compliance_pct,workstations,servers,eol_devices,cs_missing,tanium_missing,jamf_missing
  ) VALUES (
    @run_date,@total_devices,@active_devices,@compliant_devices,@noncompliant_devices,@grace_devices,
    @compliance_pct,@workstations,@servers,@eol_devices,@cs_missing,@tanium_missing,@jamf_missing
  )`).run({ run_date: runDate, ...s});
};

// ---- run ----
const files = findExcelFiles(inDirs);
if (!files.length) {
  console.error('No Excel files found in provided --in directories.');
  process.exit(2);
}
const rawRows = readWorkbooks(files);
const rows = dedupe(rawRows).filter(r => r.hostname);
ensureDir(outDb);
const db = new Database(outDb);
initDb(db);
insertHistory(db, runDate, rows);
const s = calcSummary(rows);
upsertSummary(db, runDate, s);

console.log(`Built ${outDb}`);
console.log(`Devices this run: ${rows.length}`);
console.log(`Compliance (active): ${s.compliance_pct}%`);
