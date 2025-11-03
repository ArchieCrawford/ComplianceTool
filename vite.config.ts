import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      'styled-system': resolve(__dirname, './styled-system')
    }
  },
  server: {
    port: 3000,
    host: true
  }
})