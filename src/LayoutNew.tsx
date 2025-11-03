import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Upload, 
  Monitor, 
  Shield, 
  Wrench, 
  TrendingUp,
  Activity
} from 'lucide-react'

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Upload Data",
    url: "/upload",
    icon: Upload,
  },
  {
    title: "Devices",
    url: "/devices",
    icon: Monitor,
  },
  {
    title: "Standards",
    url: "/standards",
    icon: Shield,
  },
  {
    title: "Endpoint Tools",
    url: "/endpointtools",
    icon: Wrench,
  },
  {
    title: "History & Trends",
    url: "/history",
    icon: TrendingUp,
  },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      width: '100%',
      background: 'linear-gradient(to bottom right, #f8fafc, #dbeafe, #f8fafc)'
    }}>
      {/* Sidebar */}
      <aside style={{
        width: '16rem',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        borderRight: '1px solid rgba(226, 232, 240, 0.8)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          padding: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              background: 'linear-gradient(to bottom right, #2563eb, #1d4ed8)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.2)'
            }}>
              <Activity style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
            </div>
            <div>
              <h2 style={{
                fontWeight: 'bold',
                color: '#111827',
                fontSize: '1.125rem',
                margin: 0
              }}>
                Compliance
              </h2>
              <p style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                margin: 0
              }}>
                Endpoint Analytics
              </p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div style={{ padding: '0.75rem', flex: '1' }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '0.75rem',
            marginBottom: '0.5rem'
          }}>
            Navigation
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.url
              const Icon = item.icon
              
              return (
                <Link
                  key={item.title}
                  to={item.url}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.625rem 1rem',
                    borderRadius: '12px',
                    transition: 'all 0.2s ease',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    textDecoration: 'none',
                    ...(isActive ? {
                      background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
                      color: 'white',
                      boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
                    } : {
                      color: '#334155',
                    })
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#f1f5f9'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  <Icon size={16} />
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid rgba(226, 232, 240, 0.8)',
          padding: '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.5rem'
          }}>
            <div style={{
              width: '2.25rem',
              height: '2.25rem',
              background: 'linear-gradient(to bottom right, #e2e8f0, #cbd5e1)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{
                color: '#334155',
                fontWeight: '600',
                fontSize: '0.875rem'
              }}>
                U
              </span>
            </div>
            <div style={{ flex: '1', minWidth: '0' }}>
              <p style={{
                fontWeight: '600',
                color: '#111827',
                fontSize: '0.875rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                margin: 0
              }}>
                Security Admin
              </p>
              <p style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                margin: 0
              }}>
                Compliance Manager
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: '1',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          flex: '1',
          overflow: 'auto'
        }}>
          {children}
        </div>
      </main>
    </div>
  )
}