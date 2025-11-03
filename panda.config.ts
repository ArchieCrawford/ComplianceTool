import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        colors: {
          bg: {
            default: { value: '#f6f8fc' },
            card: { value: '#ffffff' },
            sidebar: { value: '#ffffff' },
          },
          border: {
            subtle: { value: '#e5e7eb' },
            light: { value: '#f1f5f9' },
          },
          text: {
            heading: { value: '#111827' },
            muted: { value: '#6b7280' },
            default: { value: '#1f2937' },
          },
          status: {
            pass: { value: '#10b981' },
            fail: { value: '#ef4444' },
          },
          accent: {
            primary: { value: '#2563eb' },
            hover: { value: '#1e40af' },
            light: { value: '#dbeafe' },
          },
          blue: {
            50: { value: '#eff6ff' },
            100: { value: '#dbeafe' },
            500: { value: '#3b82f6' },
            600: { value: '#2563eb' },
            700: { value: '#1d4ed8' },
          },
          green: {
            50: { value: '#f0fdf4' },
            100: { value: '#dcfce7' },
            600: { value: '#16a34a' },
          },
          red: {
            50: { value: '#fef2f2' },
            100: { value: '#fee2e2' },
            600: { value: '#dc2626' },
          },
          slate: {
            50: { value: '#f8fafc' },
            100: { value: '#f1f5f9' },
            200: { value: '#e2e8f0' },
            300: { value: '#cbd5e1' },
            500: { value: '#64748b' },
            600: { value: '#475569' },
            700: { value: '#334155' },
            800: { value: '#1e293b' },
            900: { value: '#0f172a' },
          }
        },
        radii: {
          card: { value: '12px' },
          pill: { value: '9999px' },
          xl: { value: '12px' },
          lg: { value: '8px' },
          md: { value: '6px' },
          sm: { value: '4px' },
        },
        shadows: {
          card: { value: '0 1px 3px rgba(0, 0, 0, 0.08)' },
          lg: { value: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' },
          xl: { value: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
          focus: { value: '0 0 0 3px rgba(59, 130, 246, 0.5)' },
        },
        spacing: {
          1: { value: '0.25rem' },
          2: { value: '0.5rem' },
          3: { value: '0.75rem' },
          4: { value: '1rem' },
          5: { value: '1.25rem' },
          6: { value: '1.5rem' },
          8: { value: '2rem' },
          12: { value: '3rem' },
          16: { value: '4rem' },
          64: { value: '16rem' },
        },
        fontSizes: {
          xs: { value: '0.75rem' },
          sm: { value: '0.875rem' },
          md: { value: '1rem' },
          lg: { value: '1.125rem' },
          xl: { value: '1.25rem' },
          '2xl': { value: '1.5rem' },
          '3xl': { value: '1.875rem' },
        }
      }
    }
  },

  patterns: {
    extend: {
      card: {
        description: 'Dashboard card component',
        properties: {
          variant: { type: 'enum', value: ['default', 'hover'] }
        },
        transform(props) {
          const { variant = 'default', ...rest } = props
          return {
            bg: 'bg.card',
            borderRadius: 'card',
            shadow: variant === 'hover' ? 'xl' : 'lg',
            p: '4',
            border: '1px solid token(colors.border.light)',
            transition: 'all 0.3s ease',
            _hover: variant === 'hover' ? {
              shadow: 'xl',
              transform: 'translateY(-2px)'
            } : {},
            ...rest,
          }
        },
        defaultValues: { variant: 'default' }
      },
      statusCard: {
        description: 'Status card with icon',
        properties: {
          status: { type: 'enum', value: ['success', 'error', 'info', 'warning'] }
        },
        transform(props) {
          const { status = 'info', ...rest } = props
          
          const statusStyles: Record<string, { iconBg: string; iconColor: string; textColor: string }> = {
            success: { iconBg: 'green.100', iconColor: 'green.600', textColor: 'green.600' },
            error: { iconBg: 'red.100', iconColor: 'red.600', textColor: 'red.600' },
            info: { iconBg: 'blue.100', iconColor: 'blue.600', textColor: 'blue.600' },
            warning: { iconBg: 'yellow.100', iconColor: 'yellow.600', textColor: 'yellow.600' }
          }
          const currentStyle = statusStyles[status] || statusStyles.info
          
          return {
            bg: 'bg.card',
            borderRadius: 'card',
            shadow: 'lg',
            p: '4',
            border: '1px solid token(colors.border.light)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transition: 'all 0.3s ease',
            _hover: {
              shadow: 'xl'
            },
            ...rest,
            '& .icon-container': {
              w: '12',
              h: '12',
              bg: currentStyle.iconBg,
              borderRadius: 'xl',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: currentStyle.iconColor
            },
            '& .value': {
              fontSize: '3xl',
              fontWeight: 'bold',
              color: currentStyle.textColor
            }
          }
        },
        defaultValues: { status: 'info' }
      }
    }
  },

  // The output directory for your css system
  outdir: 'styled-system',

  jsxFramework: 'react'
})