import React from 'react'
import { Monitor, CheckCircle2, XCircle, TrendingUp } from 'lucide-react'

// Mock data for development
const mockData = {
  totalDevices: 245,
  avgPercent: 87.3,
  compliantCount: 198,
  nonCompliantCount: 47,
  osData: [
    { name: 'Windows 11', value: 120 },
    { name: 'Windows 10', value: 89 },
    { name: 'macOS', value: 25 },
    { name: 'Linux', value: 11 }
  ],
  complianceData: [
    { name: 'Compliant', value: 198 },
    { name: 'Non-Compliant', value: 47 }
  ],
  bucketData: [
    { name: '<50%', count: 12 },
    { name: '50-70%', count: 18 },
    { name: '70-85%', count: 35 },
    { name: '85-95%', count: 82 },
    { name: '95-100%', count: 98 }
  ]
}

const StatusCard = ({ 
  label, 
  value, 
  icon: Icon, 
  status 
}: { 
  label: string
  value: string | number
  icon: React.ComponentType<any>
  status?: 'success' | 'error' | 'info' | 'warning'
}) => {
  const getStatusColors = () => {
    switch (status) {
      case 'success':
        return { bg: '#dcfce7', iconBg: '#16a34a', textColor: '#16a34a' }
      case 'error':
        return { bg: '#fee2e2', iconBg: '#dc2626', textColor: '#dc2626' }
      default:
        return { bg: '#dbeafe', iconBg: '#2563eb', textColor: '#1f2937' }
    }
  }
  
  const colors = getStatusColors()
  
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '1.5rem',
      border: '1px solid #f1f5f9',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'all 0.3s ease'
    }}>
      <div>
        <div style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          marginBottom: '0.25rem'
        }}>
          {label}
        </div>
        <div style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          color: colors.textColor
        }}>
          {value}
        </div>
      </div>
      <div style={{
        width: '3rem',
        height: '3rem',
        backgroundColor: colors.bg,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.iconBg
      }}>
        <Icon size={24} />
      </div>
    </div>
  )
}

const SimpleBarChart = ({ data, title }: { data: any[], title: string }) => (
  <div style={{
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
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
        {title}
      </h3>
    </div>
    <div style={{ padding: '1.5rem' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        {data.map((item, index) => (
          <div key={item.name} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{
              fontSize: '0.875rem',
              color: '#1f2937'
            }}>
              {item.name}
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{
                width: '8rem',
                height: '0.5rem',
                backgroundColor: '#e2e8f0',
                borderRadius: '9999px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  backgroundColor: `hsl(${200 + index * 40}, 70%, 50%)`,
                  borderRadius: '9999px',
                  width: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%`
                }} />
              </div>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#111827',
                minWidth: '3rem'
              }}>
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default function Dashboard() {
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
          Compliance Dashboard
        </h1>
        <p style={{
          color: '#6b7280',
          margin: 0
        }}>
          Real-time endpoint compliance overview
        </p>
      </div>

      {/* Status Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <StatusCard
          label="Total Devices"
          value={mockData.totalDevices}
          icon={Monitor}
          status="info"
        />
        <StatusCard
          label="Avg % Passing"
          value={`${mockData.avgPercent}%`}
          icon={TrendingUp}
          status="success"
        />
        <StatusCard
          label="Compliant"
          value={mockData.compliantCount}
          icon={CheckCircle2}
          status="success"
        />
        <StatusCard
          label="Non-Compliant"
          value={mockData.nonCompliantCount}
          icon={XCircle}
          status="error"
        />
      </div>

      {/* Charts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <SimpleBarChart 
          data={mockData.osData} 
          title="Devices by Operating System" 
        />
        <SimpleBarChart 
          data={mockData.complianceData} 
          title="Compliance Status Distribution" 
        />
      </div>

      {/* Compliance Score Distribution */}
      <SimpleBarChart 
        data={mockData.bucketData} 
        title="Compliance Score Distribution" 
      />
    </div>
  )
}