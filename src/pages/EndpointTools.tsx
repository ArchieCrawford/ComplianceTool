import { useState } from 'react'
import { Wrench, AlertTriangle, Shield, Monitor, Search, Filter } from 'lucide-react'

// Mock data for missing tools
const mockMissingTools = [
  {
    id: 1,
    toolName: 'BitLocker',
    category: 'Encryption',
    deviceType: 'Workstation',
    missingCount: 23,
    totalDevices: 156,
    criticality: 'High',
    description: 'Full disk encryption for data protection',
    affectedDevices: [
      'DESKTOP-ABC123',
      'LAPTOP-XYZ789',
      'WORKSTATION-001'
    ]
  },
  {
    id: 2,
    toolName: 'Windows Defender ATP',
    category: 'Antivirus',
    deviceType: 'Workstation',
    missingCount: 18,
    totalDevices: 156,
    criticality: 'High',
    description: 'Advanced threat protection and endpoint detection',
    affectedDevices: [
      'PC-FINANCE01',
      'LAPTOP-SALES02'
    ]
  },
  {
    id: 3,
    toolName: 'Microsoft Defender Firewall',
    category: 'Firewall',
    deviceType: 'Server',
    missingCount: 8,
    totalDevices: 45,
    criticality: 'Medium',
    description: 'Network traffic filtering and access control',
    affectedDevices: [
      'SERVER-WEB01',
      'SERVER-DB02'
    ]
  },
  {
    id: 4,
    toolName: 'AppLocker',
    category: 'Application Control',
    deviceType: 'Workstation',
    missingCount: 34,
    totalDevices: 156,
    criticality: 'Medium',
    description: 'Application execution control and whitelisting',
    affectedDevices: [
      'LAPTOP-HR01',
      'DESKTOP-IT03'
    ]
  },
  {
    id: 5,
    toolName: 'WSUS',
    category: 'Patch Management',
    deviceType: 'Server',
    missingCount: 12,
    totalDevices: 45,
    criticality: 'High',
    description: 'Windows Server Update Services for patch management',
    affectedDevices: [
      'SERVER-FILE01',
      'SERVER-PRINT01'
    ]
  },
  {
    id: 6,
    toolName: 'Event Log Forwarding',
    category: 'Logging',
    deviceType: 'Server',
    missingCount: 15,
    totalDevices: 45,
    criticality: 'Medium',
    description: 'Centralized log collection and monitoring',
    affectedDevices: [
      'SERVER-DC01',
      'SERVER-MAIL01'
    ]
  }
]

const toolCategories = ['All', 'Encryption', 'Antivirus', 'Firewall', 'Application Control', 'Patch Management', 'Logging']
const deviceTypes = ['All', 'Workstation', 'Server', 'AVD']
const criticalityLevels = ['All', 'High', 'Medium', 'Low']

const CriticalityBadge = ({ level }: { level: string }) => {
  const getColors = (criticality: string) => {
    switch (criticality) {
      case 'High':
        return { bg: '#fee2e2', color: '#dc2626' }
      case 'Medium':
        return { bg: '#fef3c7', color: '#d97706' }
      case 'Low':
        return { bg: '#dcfce7', color: '#16a34a' }
      default:
        return { bg: '#f3f4f6', color: '#6b7280' }
    }
  }

  const colors = getColors(level)
  
  return (
    <span style={{
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '500',
      backgroundColor: colors.bg,
      color: colors.color
    }}>
      {level}
    </span>
  )
}

const ComplianceBar = ({ missing, total }: { missing: number; total: number }) => {
  const percentage = ((total - missing) / total) * 100
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
          width: `${percentage}%`,
          backgroundColor: getColor(percentage),
          transition: 'width 0.3s ease'
        }} />
      </div>
      <span style={{
        fontSize: '0.75rem',
        fontWeight: '500',
        color: getColor(percentage),
        minWidth: '50px'
      }}>
        {percentage.toFixed(0)}%
      </span>
    </div>
  )
}

const ToolCard = ({ tool, onViewDetails }: { tool: typeof mockMissingTools[0]; onViewDetails: (tool: any) => void }) => {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #f1f5f9',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      padding: '1.5rem',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1rem'
      }}>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#111827',
            margin: '0 0 0.25rem 0'
          }}>
            {tool.toolName}
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: '0 0 0.5rem 0'
          }}>
            {tool.category} • {tool.deviceType}
          </p>
          <p style={{
            fontSize: '0.75rem',
            color: '#9ca3af',
            margin: 0
          }}>
            {tool.description}
          </p>
        </div>
        <CriticalityBadge level={tool.criticality} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
            Missing
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}>
            {tool.missingCount}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
            Total Devices
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
            {tool.totalDevices}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem'
        }}>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            Compliance Rate
          </span>
        </div>
        <ComplianceBar missing={tool.missingCount} total={tool.totalDevices} />
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '1rem',
        borderTop: '1px solid #f1f5f9'
      }}>
        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
          {tool.affectedDevices.length} devices shown
        </span>
        <button
          onClick={() => onViewDetails(tool)}
          style={{
            fontSize: '0.75rem',
            color: '#2563eb',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          View Affected Devices
        </button>
      </div>
    </div>
  )
}

export default function EndpointTools() {
  const [selectedTool, setSelectedTool] = useState<any>(null)
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [deviceFilter, setDeviceFilter] = useState('All')
  const [criticalityFilter, setCriticalityFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTools = mockMissingTools.filter(tool => {
    const matchesCategory = categoryFilter === 'All' || tool.category === categoryFilter
    const matchesDevice = deviceFilter === 'All' || tool.deviceType === deviceFilter
    const matchesCriticality = criticalityFilter === 'All' || tool.criticality === criticalityFilter
    const matchesSearch = tool.toolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesCategory && matchesDevice && matchesCriticality && matchesSearch
  })

  const totalMissing = filteredTools.reduce((sum, tool) => sum + tool.missingCount, 0)
  const totalDevices = [...new Set(filteredTools.map(tool => tool.deviceType))].length
  const criticalIssues = filteredTools.filter(tool => tool.criticality === 'High').length

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
          Endpoint Security Tools
        </h1>
        <p style={{
          color: '#6b7280',
          margin: 0
        }}>
          Monitor missing security tools and their deployment status across endpoints
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
            <Wrench style={{ color: '#2563eb' }} size={20} />
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Missing Tools</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                {totalMissing}
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
            <Monitor style={{ color: '#f59e0b' }} size={20} />
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Device Types</div>
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
            <AlertTriangle style={{ color: '#dc2626' }} size={20} />
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Critical Issues</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}>
                {criticalIssues}
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
            <Shield style={{ color: '#16a34a' }} size={20} />
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Tool Categories</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                {[...new Set(mockMissingTools.map(t => t.category))].length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #f1f5f9',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <Filter style={{ color: '#6b7280' }} size={20} />
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '500',
            color: '#111827',
            margin: 0
          }}>
            Filters
          </h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: '500',
              color: '#6b7280',
              marginBottom: '0.25rem'
            }}>
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.875rem'
              }}
            >
              {toolCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: '500',
              color: '#6b7280',
              marginBottom: '0.25rem'
            }}>
              Device Type
            </label>
            <select
              value={deviceFilter}
              onChange={(e) => setDeviceFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.875rem'
              }}
            >
              {deviceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: '500',
              color: '#6b7280',
              marginBottom: '0.25rem'
            }}>
              Criticality
            </label>
            <select
              value={criticalityFilter}
              onChange={(e) => setCriticalityFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.875rem'
              }}
            >
              {criticalityLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: '500',
              color: '#6b7280',
              marginBottom: '0.25rem'
            }}>
              Search Tools
            </label>
            <div style={{ position: 'relative' }}>
              <Search style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6b7280'
              }} size={16} />
              <input
                type="text"
                placeholder="Search by tool name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.5rem 0.5rem 2.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1.5rem'
      }}>
        {filteredTools.map((tool) => (
          <ToolCard 
            key={tool.id} 
            tool={tool} 
            onViewDetails={setSelectedTool}
          />
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #f1f5f9',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          padding: '3rem',
          textAlign: 'center'
        }}>
          <Shield style={{ color: '#6b7280', margin: '0 auto 1rem' }} size={48} />
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '500',
            color: '#111827',
            margin: '0 0 0.5rem 0'
          }}>
            No tools found
          </h3>
          <p style={{
            color: '#6b7280',
            margin: 0
          }}>
            Try adjusting your filters or search terms.
          </p>
        </div>
      )}

      {/* Tool Details Modal (simplified) */}
      {selectedTool && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827',
              margin: '0 0 1rem 0'
            }}>
              {selectedTool.toolName} - Affected Devices
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: '0 0 0.5rem 0'
              }}>
                {selectedTool.description}
              </p>
              <CriticalityBadge level={selectedTool.criticality} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '500',
                color: '#111827',
                margin: '0 0 0.5rem 0'
              }}>
                Affected Devices ({selectedTool.missingCount})
              </h4>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {selectedTool.affectedDevices.map((device: string, index: number) => (
                  <li key={index} style={{
                    padding: '0.5rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '4px',
                    marginBottom: '0.25rem',
                    fontSize: '0.875rem',
                    color: '#374151'
                  }}>
                    {device}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setSelectedTool(null)}
              style={{
                width: '100%',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}