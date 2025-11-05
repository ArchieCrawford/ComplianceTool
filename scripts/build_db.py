#!/usr/bin/env python3
"""
Python alternative to build the devices DB from Excel reports.
Usage:
  python scripts/build_db.py --in "C:\path\dirA;C:\path\dirB" --out "src/data/devices.db" --run-date 2025-11-04
"""
import argparse, os, sqlite3, re, datetime
from pathlib import Path
from typing import List, Dict, Any
import pandas as pd

def excel_date_to_iso(v):
    if pd.isna(v): return None
    if isinstance(v, (int, float)):
        try:
            return (pd.Timestamp('1899-12-30') + pd.to_timedelta(int(v), unit='D')).isoformat()
        except Exception:
            return None
    try:
        return pd.to_datetime(v).isoformat()
    except Exception:
        return None

FIELD_MAP = [
    (re.compile(r'^(host.?name|computer|machine|asset(_)?name)$', re.I), 'hostname'),
    (re.compile(r'^(normalized_)?os(_platform|_name)?$', re.I), 'os'),
    (re.compile(r'^(system|device)_type$', re.I), 'deviceType'),
    (re.compile(r'^endpoint_?compliance$', re.I), 'complianceStatus'),
    (re.compile(r'^compliance_?last_?scan(_date)?$', re.I), 'lastSeen'),
    (re.compile(r'^percent.*passing|^%.*passing|^passing_%$', re.I), 'percentPassing'),
    (re.compile(r'^end(_)?of(_)?life$', re.I), 'endOfLife'),
    (re.compile(r'^crowdstrike(_)?status$', re.I), 'crowdstrikeStatus'),
    (re.compile(r'^tanium(_)?status$', re.I), 'taniumStatus'),
    (re.compile(r'^jamf(_)?status$', re.I), 'jamfStatus'),
]

def canonicalize(df: pd.DataFrame) -> pd.DataFrame:
    colmap = {}
    for col in df.columns:
        mapped = None
        for rx, key in FIELD_MAP:
            if rx.match(col):
                mapped = key; break
        if mapped: colmap[col] = mapped
    df = df.rename(columns=colmap)

    if 'lastSeen' in df: df['lastSeen'] = df['lastSeen'].map(excel_date_to_iso)
    if 'percentPassing' in df:
        df['percentPassing'] = (df['percentPassing']
                                .astype(str).str.replace('%','', regex=False)
                                .apply(lambda s: pd.to_numeric(s, errors='coerce')))
    if 'endOfLife' in df:
        df['endOfLife'] = df['endOfLife'].astype(str).str.lower().isin(['true','1','yes','y'])
    if 'complianceStatus' in df:
        s = df['complianceStatus'].astype(str).str.lower()
        df.loc[s.str.contains('grace', na=False), 'complianceStatus'] = 'grace period'
        df.loc[s.str.contains('non-?compliant|fail', regex=True, na=False), 'complianceStatus'] = 'non-compliant'
        df.loc[s.str.contains('compliant|pass', regex=True, na=False), 'complianceStatus'] = 'compliant'
    return df

def read_all_excel(dirs: List[str]) -> pd.DataFrame:
    frames = []
    for d in dirs:
        p = Path(d)
        if not p.exists(): continue
        for f in p.glob('*.xls*'):
            try:
                xls = pd.ExcelFile(f)
                for name in xls.sheet_names:
                    df = xls.parse(name, dtype=str)
                    frames.append(canonicalize(df))
            except Exception as e:
                print(f'WARN: {f} -> {e}')
    if not frames: return pd.DataFrame()
    df = pd.concat(frames, ignore_index=True)
    df = df.dropna(subset=['hostname'])
    df['__score'] = df.notna().sum(axis=1)
    df = df.sort_values('__score', ascending=False).drop_duplicates('hostname').drop(columns='__score')
    return df

def init_db(conn: sqlite3.Connection):
    conn.executescript("""
    PRAGMA journal_mode=WAL;
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
    """)

def calc_summary(df: pd.DataFrame) -> Dict[str, Any]:
    total = len(df)
    now = pd.Timestamp.utcnow()
    recent_cut = now - pd.Timedelta(days=60)

    def is_active(row):
        ls = pd.to_datetime(row.get('lastSeen'), errors='coerce')
        recent = pd.notna(ls) and (ls >= recent_cut)
        tool_any = any([row.get('crowdstrikeStatus'), row.get('taniumStatus'), row.get('jamfStatus')])
        return recent or tool_any

    df['__active'] = df.apply(is_active, axis=1)
    active = int(df['__active'].sum())

    act = df[df['__active']]
    c = int((act['complianceStatus'].str.lower() == 'compliant').sum())
    n = int((act['complianceStatus'].str.lower() == 'non-compliant').sum())
    g = int((act['complianceStatus'].str.lower() == 'grace period').sum())

    work = int(act['deviceType'].astype(str).str.contains('workstation|laptop|desktop', case=False, na=False).sum())
    serv = int(act['deviceType'].astype(str).str.contains('server', case=False, na=False).sum())
    eol = int(act['endOfLife'].fillna(False).astype(bool).sum())

    def miss(s):
        return int((~act[s].astype(str).str.len().gt(0) | act[s].astype(str).str.contains('missing|not\\s*installed', case=False, regex=True)).sum())
    cs_missing = miss('crowdstrikeStatus') if 'crowdstrikeStatus' in act else 0
    tan_missing = miss('taniumStatus') if 'taniumStatus' in act else 0
    jamf_missing = miss('jamfStatus') if 'jamfStatus' in act else 0

    pct = round((c/active)*100, 2) if active else 0.0
    return dict(total_devices=total, active_devices=int(active), compliant_devices=int(c),
                noncompliant_devices=int(n), grace_devices=int(g), compliance_pct=pct,
                workstations=int(work), servers=int(serv), eol_devices=int(eol),
                cs_missing=int(cs_missing), tanium_missing=int(tan_missing), jamf_missing=int(jamf_missing))

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--in', dest='in_dirs', required=True, help='Semicolon-separated input directories')
    ap.add_argument('--out', dest='out_db', default=os.path.join('src','data','devices.db'))
    ap.add_argument('--run-date', dest='run_date', default=datetime.date.today().isoformat())
    args = ap.parse_args()

    in_dirs = [s for s in args.in_dirs.split(';') if s]
    df = read_all_excel(in_dirs)
    os.makedirs(os.path.dirname(args.out_db), exist_ok=True)
    with sqlite3.connect(args.out_db) as conn:
      init_db(conn)
      conn.execute('DELETE FROM asset_history WHERE run_date=?', (args.run_date,))
      cols = ['hostname','os','deviceType','complianceStatus','lastSeen','percentPassing','endOfLife','crowdstrikeStatus','taniumStatus','jamfStatus']
      for _, r in df.iterrows():
          vals = [args.run_date] + [r.get(c) if c in df.columns else None for c in cols]
          if isinstance(vals[7], bool):
              vals[7] = int(vals[7])
          conn.execute(f"""
              INSERT INTO asset_history (run_date,hostname,os,deviceType,complianceStatus,lastSeen,percentPassing,endOfLife,crowdstrikeStatus,taniumStatus,jamfStatus)
              VALUES (?,?,?,?,?,?,?,?,?,?,?)
          """, vals)
      s = calc_summary(df)
      conn.execute("""REPLACE INTO asset_summary
          (run_date,total_devices,active_devices,compliant_devices,noncompliant_devices,grace_devices,
           compliance_pct,workstations,servers,eol_devices,cs_missing,tanium_missing,jamf_missing)
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)""",
          (args.run_date, s['total_devices'], s['active_devices'], s['compliant_devices'],
           s['noncompliant_devices'], s['grace_devices'], s['compliance_pct'], s['workstations'],
           s['servers'], s['eol_devices'], s['cs_missing'], s['tanium_missing'], s['jamf_missing'])
      )
    print(f'Built {args.out_db} for {args.run_date}. Rows: {len(df)}')

if __name__ == '__main__':
    main()
