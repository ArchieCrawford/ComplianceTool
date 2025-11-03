import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './LayoutNew'
import Dashboard from './pages/DashboardNew'
import Upload from './pages/Upload'
import History from './pages/History'
import EndpointTools from './pages/EndpointTools'
import Devices from './pages/Devices'
import Standards from './pages/Standards'

// Mock API client for development
export const base44 = {
  entities: {
    DataUpload: {
      list: async (_sort?: string, _limit?: number) => {
        // Mock data - replace with real API
        return []
      },
      create: async (data: any) => ({ id: '1', ...data }),
      bulkCreate: async (data: any[]) => data.map((item, i) => ({ id: String(i), ...item }))
    },
    Device: {
      list: async (_sort?: string, _limit?: number) => [],
      filter: async (_params: any) => [],
      schema: async () => ({}),
      bulkCreate: async (data: any[]) => data.map((item, i) => ({ id: String(i), ...item }))
    },
    Standard: {
      list: async (_sort?: string, _limit?: number) => [],
      filter: async (_params: any) => [],
      bulkCreate: async (data: any[]) => data.map((item, i) => ({ id: String(i), ...item }))
    },
    EndpointTool: {
      filter: async (_params: any) => [],
      bulkCreate: async (data: any[]) => data.map((item, i) => ({ id: String(i), ...item }))
    }
  },
  integrations: {
    Core: {
      UploadFile: async ({ file }: { file: File }) => ({
        file_url: URL.createObjectURL(file)
      }),
      ExtractDataFromUploadedFile: async (_params: any) => ({
        status: 'success',
        output: { devices: [] }
      })
    }
  }
}

// Utility function for page URLs
export const createPageUrl = (page: string) => `/${page.toLowerCase()}`

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/standards" element={<Standards />} />
        <Route path="/endpointtools" element={<EndpointTools />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  )
}

export default App