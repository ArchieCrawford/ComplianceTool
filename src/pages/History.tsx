import { useState } from 'react'
import { TrendingUp, Calendar, Upload, Download, BarChart3, LineChart } from 'lucide-react'

// Mock historical data
const mockHistory = [
  {
    id: 1,
    date: '2024-11-02',
    fileName: 'compliance_report_nov_02.xlsx',
    totalDevices: 245,
    compliant: 198,
    nonCompliant: 47,
    avgCompliance: 87.3,
    uploadTime: '14:30:22'
  },
  {
    id: 2,
    date: '2024-10-26',
    fileName: 'weekly_compliance_scan.xlsx',
    totalDevices: 243,
    compliant: 185,
    nonCompliant: 58,
    avgCompliance: 84.1,
    uploadTime: '09:15:45'
  },
  {
    id: 3,
    date: '2024-10-19',
    fileName: 'compliance_audit_q4.xlsx',
    totalDevices: 238,
    compliant: 178,
    nonCompliant: 60,
    avgCompliance: 82.7,
    uploadTime: '16:22:10'
  },
  {
    id: 4,
    date: '2024-10-12',
    fileName: 'monthly_compliance_oct.xlsx',
    totalDevices: 235,
    compliant: 171,
    nonCompliant: 64,
    avgCompliance: 81.2,
    uploadTime: '11:08:33'
  },
  {
    id: 5,
    date: '2024-10-05',
    fileName: 'security_baseline_check.xlsx',
    totalDevices: 232,
    compliant: 168,
    nonCompliant: 64,
    avgCompliance: 80.8,
    uploadTime: '13:45:12'
  }
]

const trendData = mockHistory.map(item => ({
  date: item.date,
  compliance: item.avgCompliance,
  devices: item.totalDevices,
  compliant: item.compliant,
  nonCompliant: item.nonCompliant
})).reverse()

const TrendChart = ({ data }: { data: any[] }) => {
  const maxCompliance = Math.max(...data.map(d => d.compliance))
  const minCompliance = Math.min(...data.map(d => d.compliance))
  const range = maxCompliance - minCompliance
  
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #f1f5f9',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      padding: '1.5rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#111827',
          margin: 0
        }}>
          Compliance Trends
        </h3>
        <LineChart style={{ color: '#6b7280' }} size={20} />
      </div>
      
      <div style={{
        height: '200px',
        position: 'relative',
        marginBottom: '1rem'
      }}>
        <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={`${100 - y}%`}
              x2="100%"
              y2={`${100 - y}%`}
              stroke="#f1f5f9"
              strokeWidth="1"
            />
          ))}
          
          {/* Trend line */}
          <polyline
            points={data.map((item, index) => 
              `${(index / (data.length - 1)) * 100}%,${100 - ((item.compliance - minCompliance) / range * 80 + 10)}%`
            ).join(' ')}
            fill="none"
            stroke="#2563eb"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {data.map((item, index) => (
            <circle
              key={index}
              cx={`${(index / (data.length - 1)) * 100}%`}
              cy={`${100 - ((item.compliance - minCompliance) / range * 80 + 10)}%`}
              r="4"
              fill="#2563eb"
            />
          ))}
        </svg>
        
        {/* Y-axis labels */}
        <div style={{
          position: 'absolute',
          left: '-50px',
          top: 0,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: '#6b7280'
        }}>
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>
      </div>
      
      {/* X-axis labels */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: '#6b7280'
      }}>
        {data.map((item, index) => (
          <span key={index}>
            {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        ))}
      </div>
    </div>
  )
}

const MetricCard = ({ title, value, change, icon: Icon, color }: {
  title: string
  value: string | number
  change: string
  icon: any
  color: string
}) => {
  const isPositive = change.startsWith('+')
  
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #f1f5f9',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      padding: '1.5rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1rem'
      }}>
        <div>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: '0 0 0.25rem 0'
          }}>
            {title}
          </p>
          <p style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: '#111827',
            margin: 0
          }}>
            {value}
          </p>
        </div>
        <Icon style={{ color }} size={24} />
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem'
      }}>
        <TrendingUp 
          style={{ 
            color: isPositive ? '#16a34a' : '#dc2626',
            transform: isPositive ? 'none' : 'rotate(180deg)'
          }} 
          size={16} 
        />
        <span style={{
          fontSize: '0.75rem',
          color: isPositive ? '#16a34a' : '#dc2626',
          fontWeight: '500'
        }}>
          {change}
        </span>
        <span style={{
          fontSize: '0.75rem',
          color: '#6b7280'
        }}>
          from last week
        </span>
      </div>
    </div>
  )
}

export default function History() {
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('chart')
  
  const latestRecord = mockHistory[0]
  const previousRecord = mockHistory[1]
  
  const deviceChange = latestRecord.totalDevices - previousRecord.totalDevices
  const complianceChange = latestRecord.avgCompliance - previousRecord.avgCompliance
  const compliantChange = latestRecord.compliant - previousRecord.compliant

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#f6f8fc',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '0.5rem',
            margin: 0
          }}>
            History & Trends
          </h1>
          <p style={{
            color: '#6b7280',
            margin: 0
          }}>
            Track compliance changes and trends over time
          </p>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          padding: '0.25rem'
        }}>
          <button
            onClick={() => setViewMode('chart')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: viewMode === 'chart' ? '#2563eb' : 'transparent',
              color: viewMode === 'chart' ? '#ffffff' : '#6b7280',
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <BarChart3 size={16} />
            Charts
          </button>
          <button
            onClick={() => setViewMode('table')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: viewMode === 'table' ? '#2563eb' : 'transparent',
              color: viewMode === 'table' ? '#ffffff' : '#6b7280',
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Calendar size={16} />
            Table
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <MetricCard
          title="Total Devices"
          value={latestRecord.totalDevices}
          change={deviceChange > 0 ? `+${deviceChange}` : `${deviceChange}`}
          icon={Calendar}
          color="#2563eb"
        />
        <MetricCard
          title="Avg Compliance"
          value={`${latestRecord.avgCompliance}%`}
          change={complianceChange > 0 ? `+${complianceChange.toFixed(1)}%` : `${complianceChange.toFixed(1)}%`}
          icon={TrendingUp}
          color="#16a34a"
        />
        <MetricCard
          title="Compliant Devices"
          value={latestRecord.compliant}
          change={compliantChange > 0 ? `+${compliantChange}` : `${compliantChange}`}
          icon={Upload}
          color="#16a34a"
        />
        <MetricCard
          title="Total Uploads"
          value={mockHistory.length}
          change="+1"
          icon={Download}
          color="#f59e0b"
        />
      </div>

      {/* Main Content */}
      {viewMode === 'chart' ? (
        <TrendChart data={trendData} />
      ) : (
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
              Upload History
            </h3>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                    Date & Time
                  </th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                    File Name
                  </th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                    Total Devices
                  </th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                    Compliant
                  </th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                    Non-Compliant
                  </th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                    Avg Compliance
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockHistory.map((record, index) => (
                  <tr key={record.id} style={{
                    borderTop: index > 0 ? '1px solid #f1f5f9' : 'none'
                  }}>
                    <td style={{ padding: '0.75rem' }}>
                      <div>
                        <div style={{ fontWeight: '500', color: '#111827', fontSize: '0.875rem' }}>
                          {new Date(record.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {record.uploadTime}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                      {record.fileName}
                    </td>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151', textAlign: 'right' }}>
                      {record.totalDevices}
                    </td>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#16a34a', textAlign: 'right', fontWeight: '500' }}>
                      {record.compliant}
                    </td>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#dc2626', textAlign: 'right', fontWeight: '500' }}>
                      {record.nonCompliant}
                    </td>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151', textAlign: 'right', fontWeight: '500' }}>
                      {record.avgCompliance}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}