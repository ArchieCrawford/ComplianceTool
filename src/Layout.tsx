import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { css } from 'styled-system/css'
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
    <div className={css({
      minH: '100vh',
      display: 'flex',
      w: 'full',
      bg: 'linear-gradient(to bottom right, #f8fafc, #dbeafe, #f8fafc)'
    })}>
      {/* Sidebar */}
      <aside className={css({
        w: '64',
        bg: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        borderRight: '1px solid rgba(226, 232, 240, 0.8)',
        display: 'flex',
        flexDir: 'column'
      })}>
        {/* Header */}
        <div className={css({
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          p: '6'
        })}>
          <div className={css({
            display: 'flex',
            alignItems: 'center',
            gap: '3'
          })}>
            <div className={css({
              w: '10',
              h: '10',
              bg: 'linear-gradient(to bottom right, #2563eb, #1d4ed8)',
              borderRadius: 'xl',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              shadow: 'lg'
            })}>
              <Activity className={css({ w: '6', h: '6', color: 'white' })} />
            </div>
            <div>
              <h2 className={css({
                fontWeight: 'bold',
                color: 'text.heading',
                fontSize: 'lg'
              })}>
                Compliance
              </h2>
              <p className={css({
                fontSize: 'xs',
                color: 'text.muted'
              })}>
                Endpoint Analytics
              </p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div className={css({ p: '3', flex: '1' })}>
          <div className={css({
            fontSize: 'xs',
            fontWeight: 'semibold',
            color: 'text.muted',
            textTransform: 'uppercase',
            letterSpacing: 'wider',
            px: '3',
            py: '2',
            mb: '2'
          })}>
            Navigation
          </div>
          <nav className={css({ display: 'flex', flexDir: 'column', gap: '1' })}>
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.url
              const Icon = item.icon
              
              return (
                <Link
                  key={item.title}
                  to={item.url}
                  className={css({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3',
                    px: '4',
                    py: '2.5',
                    borderRadius: 'xl',
                    transition: 'all 0.2s ease',
                    fontSize: 'sm',
                    fontWeight: 'medium',
                    textDecoration: 'none',
                    ...(isActive ? {
                      bg: 'linear-gradient(to right, #2563eb, #1d4ed8)',
                      color: 'white',
                      shadow: 'md'
                    } : {
                      color: 'slate.700',
                      _hover: {
                        bg: 'slate.100'
                      }
                    })
                  })}
                >
                  <Icon size={16} />
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className={css({
          borderTop: '1px solid rgba(226, 232, 240, 0.8)',
          p: '4'
        })}>
          <div className={css({
            display: 'flex',
            alignItems: 'center',
            gap: '3',
            px: '2'
          })}>
            <div className={css({
              w: '9',
              h: '9',
              bg: 'linear-gradient(to bottom right, #e2e8f0, #cbd5e1)',
              borderRadius: 'xl',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            })}>
              <span className={css({
                color: 'slate.700',
                fontWeight: 'semibold',
                fontSize: 'sm'
              })}>
                U
              </span>
            </div>
            <div className={css({ flex: '1', minW: '0' })}>
              <p className={css({
                fontWeight: 'semibold',
                color: 'text.heading',
                fontSize: 'sm',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              })}>
                Security Admin
              </p>
              <p className={css({
                fontSize: 'xs',
                color: 'text.muted',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              })}>
                Compliance Manager
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={css({
        flex: '1',
        display: 'flex',
        flexDir: 'column'
      })}>
        <div className={css({
          flex: '1',
          overflow: 'auto'
        })}>
          {children}
        </div>
      </main>
    </div>
  )
}