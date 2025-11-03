import { useEffect, useState } from 'react'
import { Shield, TrendingUp, Users, AlertTriangle } from 'lucide-react'

// Mock standards data for demonstration
const mockStandards = [
  {
    id: 1,
    name: 'CIS Controls',
    profile: 'Level 1 - Basic',
    deviceCount: 156,
    avgPercent: 87.3,
    description: 'Center for Internet Security Basic Controls',
    lastUpdated: '2024-10-15',
    controls: 18,
    passedControls: 16
  },
  {
    id: 2,
    name: 'CIS Controls',
    profile: 'Level 2 - Advanced',
    deviceCount: 43,
    avgPercent: 72.8,
    description: 'Center for Internet Security Advanced Controls',
    lastUpdated: '2024-10-15',
    controls: 153,
    passedControls: 111
  },
  {
    id: 3,
    name: 'NIST Cybersecurity Framework',
    profile: 'Core Functions',
    deviceCount: 89,
    avgPercent: 91.5,
    description: 'NIST Framework Core Security Functions',
    lastUpdated: '2024-09-28',
    controls: 23,
    passedControls: 21
  },
  {
    id: 4,
    name: 'ISO 27001',
    profile: 'Information Security',
    deviceCount: 67,
    avgPercent: 78.9,
    description: 'International Information Security Standard',
    lastUpdated: '2024-10-01',
    controls: 114,
    passedControls: 90
  }
]

const ComplianceBar = ({ passed, total }: { passed: number; total: number }) => {
  const percentage = (passed / total) * 100
  const getColor = (pct: number) => {
    if (pct >= 90) return '#16a34a'
    if (pct >= 70) return '#f59e0b'
    return '#dc2626'
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
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
          width: `${percentage}%`,
          backgroundColor: getColor(percentage),
          transition: 'width 0.3s ease'
        }} />
      </div>
      <span style={{
        fontSize: '0.75rem',
        fontWeight: '500',
        color: '#374151',
        minWidth: '60px'
      }}>
        {passed}/{total}
      </span>
    </div>
  )
}



export default function Standards() {
  const [uploadedStandards, setUploadedStandards] = useState<any[]>([])

  useEffect(() => {
    try {
      const fromStorage = JSON.parse(localStorage.getItem('uploadedStandards') || '[]')
      setUploadedStandards(Array.isArray(fromStorage) ? fromStorage : [])
    } catch (e) {
      setUploadedStandards([])
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'uploadedStandards') {
        try {
          setUploadedStandards(JSON.parse(e.newValue || '[]'))
        } catch (err) {
          setUploadedStandards([])
        }
      }
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const standards = [...mockStandards, ...uploadedStandards]

  const totalDevices = standards.reduce((sum, std) => sum + (std.deviceCount || 0), 0)
  const avgCompliance = (standards.reduce((sum, std) => sum + (std.avgPercent || 0), 0) / Math.max(1, standards.length))
  const totalControls = standards.reduce((sum, std) => sum + (std.controls || 0), 0)
  const totalPassed = standards.reduce((sum, std) => sum + (std.passedControls || 0), 0)

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
          Compliance Standards
        </h1>
        <p style={{
          color: '#6b7280',
          margin: 0
        }}>
          Monitor compliance against industry standards and frameworks
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
            <Shield style={{ color: '#2563eb' }} size={20} />
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Active Standards</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                {mockStandards.length}
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
            <Users style={{ color: '#16a34a' }} size={20} />
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Devices</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                {totalDevices}
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
            <TrendingUp style={{ color: '#16a34a' }} size={20} />
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Avg Compliance</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a' }}>
                {avgCompliance.toFixed(1)}%
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
            <AlertTriangle style={{ color: '#f59e0b' }} size={20} />
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Controls</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                {totalPassed}/{totalControls}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Standards Table */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #f1f5f9',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f8fafc'
        }}>
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#111827',
            margin: 0
          }}>
            Standards Overview
          </h2>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: '0.25rem 0 0 0'
          }}>
            Detailed view of all compliance standards and their current status
          </p>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{
                  padding: '0.875rem 1.5rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  Standard & Profile
                </th>
                <th style={{
                  padding: '0.875rem 1.5rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  Devices
                </th>
                <th style={{
                  padding: '0.875rem 1.5rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  Controls Status
                </th>
                <th style={{
                  padding: '0.875rem 1.5rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  Compliance Rate
                </th>
                <th style={{
                  padding: '0.875rem 1.5rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {mockStandards.map((standard, index) => {
                const complianceRate = (standard.passedControls / standard.controls) * 100
                const getStatusColor = (rate: number) => {
                  if (rate >= 90) return { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' }
                  if (rate >= 70) return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' }
                  return { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' }
                }
                const statusColor = getStatusColor(complianceRate)

                return (
                  <tr key={standard.id} style={{
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                    borderBottom: index === mockStandards.length - 1 ? 'none' : '1px solid #e5e7eb'
                  }}>
                    <td style={{
                      padding: '1.25rem 1.5rem',
                      verticalAlign: 'top'
                    }}>
                      <div>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#111827',
                          marginBottom: '0.25rem'
                        }}>
                          {standard.name}
                        </div>
                        <div style={{
                          fontSize: '0.8125rem',
                          color: '#2563eb',
                          fontWeight: '500',
                          marginBottom: '0.25rem'
                        }}>
                          {standard.profile}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#6b7280'
                        }}>
                          {standard.description}
                        </div>
                      </div>
                    </td>
                    <td style={{
                      padding: '1.25rem 1.5rem',
                      verticalAlign: 'top'
                    }}>
                      <div style={{
                        fontSize: '1.125rem',
                        fontWeight: '700',
                        color: '#111827'
                      }}>
                        {standard.deviceCount.toLocaleString()}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280'
                      }}>
                        devices monitored
                      </div>
                    </td>
                    <td style={{
                      padding: '1.25rem 1.5rem',
                      verticalAlign: 'top'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem'
                      }}>
                        <span style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#111827'
                        }}>
                          {standard.passedControls}/{standard.controls}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          color: '#6b7280'
                        }}>
                          passing
                        </span>
                      </div>
                      <ComplianceBar passed={standard.passedControls} total={standard.controls} />
                    </td>
                    <td style={{
                      padding: '1.25rem 1.5rem',
                      verticalAlign: 'top'
                    }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        backgroundColor: statusColor.bg,
                        color: statusColor.text,
                        border: `1px solid ${statusColor.border}`,
                        borderRadius: '6px',
                        padding: '0.375rem 0.75rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        marginBottom: '0.25rem'
                      }}>
                        {standard.avgPercent.toFixed(1)}%
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280'
                      }}>
                        avg compliance
                      </div>
                    </td>
                    <td style={{
                      padding: '1.25rem 1.5rem',
                      verticalAlign: 'top'
                    }}>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#111827'
                      }}>
                        {new Date(standard.lastUpdated).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280'
                      }}>
                        last scan
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}