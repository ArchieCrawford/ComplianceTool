
import { Monitor, CheckCircle2, XCircle, Wrench } from 'lucide-react'

// Mock device data for demonstration
const mockDevices = [
  {
    id: 1,
    hostname: 'DESKTOP-ABC123',
    deviceType: 'Workstation',
    os: 'Windows 11 Pro',
    lastLoginUser: 'john.doe',
    complianceStatus: 'Compliant',
    percentPassing: 95.2,
    standard: 'CIS',
    profile: 'Level 1',
    missingTools: '',
    lastSeen: '2024-11-02'
  },
  {
    id: 2,
    hostname: 'LAPTOP-XYZ789',
    deviceType: 'Workstation',
    os: 'Windows 10 Pro',
    lastLoginUser: 'jane.smith',
    complianceStatus: 'Non-Compliant',
    percentPassing: 67.8,
    standard: 'CIS',
    profile: 'Level 1',
    missingTools: 'BitLocker, Windows Defender',
    lastSeen: '2024-11-01'
  },
  {
    id: 3,
    hostname: 'SERVER-001',
    deviceType: 'Server',
    os: 'Windows Server 2022',
    lastLoginUser: 'admin',
    complianceStatus: 'Compliant',
    percentPassing: 98.5,
    standard: 'NIST',
    profile: 'High',
    missingTools: '',
    lastSeen: '2024-11-02'
  },
  {
    id: 4,
    hostname: 'MACBOOK-DEV01',
    deviceType: 'Workstation',
    os: 'macOS Sonoma',
    lastLoginUser: 'dev.user',
    complianceStatus: 'Non-Compliant',
    percentPassing: 72.1,
    standard: 'CIS',
    profile: 'Level 2',
    missingTools: 'FileVault',
    lastSeen: '2024-11-02'
  }
]

const StatusBadge = ({ status }: { status: string }) => {
  const isCompliant = status === 'Compliant'
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '500',
      backgroundColor: isCompliant ? '#dcfce7' : '#fee2e2',
      color: isCompliant ? '#16a34a' : '#dc2626'
    }}>
      {isCompliant ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
      {status}
    </span>
  )
}

const PercentBar = ({ percent }: { percent: number }) => {
  const getColor = (pct: number) => {
    if (pct >= 90) return '#16a34a'
    if (pct >= 70) return '#f59e0b'
    return '#dc2626'
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      minWidth: '120px'
    }}>
      <div style={{
        flex: 1,
        height: '8px',
        backgroundColor: '#e5e7eb',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${percent}%`,
          backgroundColor: getColor(percent),
          transition: 'width 0.3s ease'
        }} />
      </div>
      <span style={{
        fontSize: '0.75rem',
        fontWeight: '500',
        color: getColor(percent),
        minWidth: '40px'
      }}>
        {percent.toFixed(1)}%
      </span>
    </div>
  )
}

export default function Devices() {
  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#f6f8fc',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '0.5rem',
          margin: 0
        }}>
          Device Management
        </h1>
        <p style={{
          color: '#6b7280',
          margin: 0
        }}>
          Monitor and manage endpoint devices and their compliance status
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #f1f5f9',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Monitor style={{ color: '#2563eb' }} size={20} />
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Devices</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                {mockDevices.length}
              </div>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #f1f5f9',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle2 style={{ color: '#16a34a' }} size={20} />
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Compliant</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a' }}>
                {mockDevices.filter(d => d.complianceStatus === 'Compliant').length}
              </div>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #f1f5f9',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <XCircle style={{ color: '#dc2626' }} size={20} />
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Non-Compliant</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}>
                {mockDevices.filter(d => d.complianceStatus === 'Non-Compliant').length}
              </div>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #f1f5f9',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Wrench style={{ color: '#f59e0b' }} size={20} />
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Need Attention</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
                {mockDevices.filter(d => d.missingTools).length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Device Table */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #f1f5f9',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #f1f5f9'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#111827',
            margin: 0
          }}>
            Device Inventory
          </h3>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                  Device
                </th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                  Type
                </th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                  OS
                </th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                  User
                </th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                  Status
                </th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                  Compliance %
                </th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                  Missing Tools
                </th>
              </tr>
            </thead>
            <tbody>
              {mockDevices.map((device, index) => (
                <tr key={device.id} style={{
                  borderTop: index > 0 ? '1px solid #f1f5f9' : 'none'
                }}>
                  <td style={{ padding: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: '500', color: '#111827', fontSize: '0.875rem' }}>
                        {device.hostname}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        Last seen: {device.lastSeen}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                    {device.deviceType}
                  </td>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                    {device.os}
                  </td>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                    {device.lastLoginUser}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <StatusBadge status={device.complianceStatus} />
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <PercentBar percent={device.percentPassing} />
                  </td>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                    {device.missingTools || (
                      <span style={{ color: '#16a34a' }}>None</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}