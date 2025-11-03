import React, { useState, useCallback } from 'react'
import { Upload as UploadIcon, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2, X, Calendar, Database, Info } from 'lucide-react'

// Mock API integration for now - this would connect to your real backend
const mockAPI = {
  uploadFile: async (_file: File): Promise<string> => {
    // Simulate file upload delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    return `mock-url-${Date.now()}`
  },
  
  extractData: async (_fileUrl: string, _schema: any): Promise<any> => {
    // Simulate data extraction delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock extracted device data
    return {
      status: 'success',
      output: {
        devices: [
          {
            hostname: 'DESKTOP-ABC123',
            deviceType: 'Workstation',
            os: 'Windows 11 Pro',
            lastLoginUser: 'john.doe',
            complianceStatus: 'Compliant',
            percentPassing: 95.2,
            standard: 'CIS',
            profile: 'Level 1',
            missingTools: ''
          },
          {
            hostname: 'LAPTOP-XYZ789',
            deviceType: 'Workstation', 
            os: 'Windows 10 Pro',
            lastLoginUser: 'jane.smith',
            complianceStatus: 'Non-Compliant',
            percentPassing: 67.8,
            standard: 'CIS',
            profile: 'Level 1',
            missingTools: 'BitLocker, Windows Defender'
          }
          // Would contain more devices from Excel file
        ]
      }
    }
  },
  
  saveData: async (_data: any): Promise<void> => {
    // Simulate saving data
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [snapshotDate, setSnapshotDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [dragActive, setDragActive] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [extractedData, setExtractedData] = useState<any>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.name.endsWith('.xlsx')) {
      setFile(droppedFile)
      setError(null)
      setSuccess(false)
    } else {
      setError("Please upload an Excel file (.xlsx)")
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.name.endsWith('.xlsx')) {
        setFile(selectedFile)
        setError(null)
        setSuccess(false)
      } else {
        setError("Please select an Excel file (.xlsx)")
      }
    }
  }

  const processUpload = async () => {
    if (!file) {
      setError("Please select a file first")
      return
    }

    setProcessing(true)
    setProgress(10)
    setError(null)

    try {
      // Step 1: Upload file
      setProgress(20)
      const fileUrl = await mockAPI.uploadFile(file)
      
      // Step 2: Extract data from Excel
      setProgress(40)
      const deviceSchema = {
        type: "object",
        properties: {
          hostname: { type: "string" },
          deviceType: { type: "string" },
          os: { type: "string" },
          lastLoginUser: { type: "string" },
          complianceStatus: { type: "string" },
          percentPassing: { type: "number" },
          standard: { type: "string" },
          profile: { type: "string" },
          missingTools: { type: "string" }
        }
      }
      
      const result = await mockAPI.extractData(fileUrl, { 
        type: "object",
        properties: {
          devices: {
            type: "array", 
            items: deviceSchema
          }
        }
      })

      if (result.status === 'success' && result.output?.devices) {
        setProgress(70)
        
        // Add metadata to each device
        const devicesWithMetadata = result.output.devices.map((device: any) => ({
          ...device,
          snapshotDate: snapshotDate,
          uploadId: `upload-${Date.now()}`,
          complianceBucket: getComplianceBucket(device.percentPassing)
        }))

        setExtractedData({
          devices: devicesWithMetadata,
          summary: {
            totalDevices: devicesWithMetadata.length,
            compliant: devicesWithMetadata.filter((d: any) => d.complianceStatus === 'Compliant').length,
            nonCompliant: devicesWithMetadata.filter((d: any) => d.complianceStatus === 'Non-Compliant').length,
            avgCompliance: devicesWithMetadata.reduce((sum: number, d: any) => sum + d.percentPassing, 0) / devicesWithMetadata.length
          }
        })

        // Step 3: Save to database
        setProgress(90)
        await mockAPI.saveData(devicesWithMetadata)
        
        setProgress(100)
        setSuccess(true)

        // Persist a simple 'uploaded standard' entry so Standards page can show it
        try {
          const uploaded = JSON.parse(localStorage.getItem('uploadedStandards') || '[]')
          const newStd = {
            id: Date.now(),
            name: `Uploaded - ${file.name.replace(/\.[^/.]+$/, '')}`,
            profile: 'Uploaded',
            deviceCount: devicesWithMetadata.length,
            avgPercent: (devicesWithMetadata.length ? devicesWithMetadata.reduce((s: number, d: any) => s + (d.percentPassing || 0), 0) / devicesWithMetadata.length : 0),
            description: `User uploaded standard from file ${file.name}`,
            lastUpdated: snapshotDate,
            controls: 0,
            passedControls: 0
          }
          uploaded.push(newStd)
          localStorage.setItem('uploadedStandards', JSON.stringify(uploaded))
        } catch (e) {
          // ignore localStorage errors
        }

        // Auto-redirect after success (optional)
        setTimeout(() => {
          // window.location.href = '/dashboard'
        }, 3000)
      } else {
        throw new Error("Failed to extract data from Excel file")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process file")
      setProcessing(false)
    }
  }

  const getComplianceBucket = (percent: number): string => {
    if (percent < 50) return "<50"
    if (percent < 70) return "50-70"
    if (percent < 85) return "70-85"
    if (percent < 95) return "85-95"
    return "95-100"
  }

  const resetUpload = () => {
    setFile(null)
    setProcessing(false)
    setProgress(0)
    setError(null)
    setSuccess(false)
    setExtractedData(null)
  }

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#f6f8fc',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '0.5rem',
            margin: 0
          }}>
            Upload Compliance Data
          </h1>
          <p style={{
            color: '#6b7280',
            margin: 0
          }}>
            Import Excel files containing device compliance information
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle style={{ color: '#dc2626', flexShrink: 0 }} size={20} />
            <span style={{ color: '#991b1b' }}>{error}</span>
            <button 
              onClick={() => setError(null)}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#dc2626'
              }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {success && (
          <div style={{
            backgroundColor: '#dcfce7',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle2 style={{ color: '#16a34a', flexShrink: 0 }} size={20} />
            <span style={{ color: '#14532d' }}>
              Data uploaded successfully! {extractedData?.summary.totalDevices} devices processed.
            </span>
          </div>
        )}

        {/* Upload Form */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #f1f5f9',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{
            padding: '1.5rem',
            borderBottom: '1px solid #f1f5f9'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#111827',
              margin: 0,
              marginBottom: '0.5rem'
            }}>
              Upload Excel File
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              margin: 0
            }}>
              Select an Excel file (.xlsx) containing device compliance data
            </p>
          </div>
          
          <div style={{ padding: '1.5rem' }}>
            {/* Snapshot Date */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                <Calendar size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Snapshot Date
              </label>
              <input
                type="date"
                value={snapshotDate}
                onChange={(e) => setSnapshotDate(e.target.value)}
                disabled={processing}
                style={{
                  width: '200px',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            {/* File Upload Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !processing && document.getElementById('file-upload')?.click()}
              style={{
                border: `2px dashed ${dragActive ? '#2563eb' : '#d1d5db'}`,
                borderRadius: '12px',
                padding: '3rem',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                backgroundColor: dragActive ? '#eff6ff' : processing ? '#f9fafb' : '#ffffff',
                cursor: processing ? 'not-allowed' : 'pointer'
              }}
            >
              <input
                type="file"
                accept=".xlsx"
                onChange={handleFileInput}
                // keep the input in the DOM and visually hidden so programmatic click is allowed
                style={{
                  position: 'absolute',
                  left: '-9999px',
                  width: '1px',
                  height: '1px',
                  overflow: 'hidden',
                  opacity: 0
                }}
                id="file-upload"
                disabled={processing}
              />
              
              {!file ? (
                <div style={{ cursor: processing ? 'not-allowed' : 'pointer' }}>
                  <div style={{
                    width: '4rem',
                    height: '4rem',
                    margin: '0 auto 1rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FileSpreadsheet style={{ color: '#6b7280' }} size={32} />
                  </div>
                  <p style={{
                    fontSize: '1.125rem',
                    fontWeight: '500',
                    color: '#111827',
                    margin: '0 0 0.5rem 0'
                  }}>
                    Drop your Excel file here
                  </p>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    margin: '0 0 1rem 0'
                  }}>
                    or click anywhere in this area to browse (.xlsx files only)
                  </p>
                  <div style={{
                    backgroundColor: processing ? '#e5e7eb' : '#2563eb',
                    color: processing ? '#9ca3af' : '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.875rem',
                    cursor: processing ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    fontWeight: '500'
                  }}>
                    <UploadIcon size={16} style={{ marginRight: '0.5rem' }} />
                    Select File
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{
                    width: '4rem',
                    height: '4rem',
                    margin: '0 auto 1rem',
                    backgroundColor: success ? '#dcfce7' : '#dbeafe',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {success ? (
                      <CheckCircle2 style={{ color: '#16a34a' }} size={32} />
                    ) : (
                      <FileSpreadsheet style={{ color: '#2563eb' }} size={32} />
                    )}
                  </div>
                  <p style={{
                    fontSize: '1.125rem',
                    fontWeight: '500',
                    color: '#111827',
                    margin: '0 0 0.5rem 0'
                  }}>
                    {file.name}
                  </p>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {!processing && !success && (
                    <button
                      onClick={resetUpload}
                      style={{
                        marginTop: '0.5rem',
                        backgroundColor: 'transparent',
                        color: '#6b7280',
                        border: 'none',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      Choose different file
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {processing && (
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Processing...</span>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{progress}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    backgroundColor: '#2563eb',
                    width: `${progress}%`,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            )}

            {/* Process Button */}
            <button
              onClick={processUpload}
              disabled={!file || processing || success}
              style={{
                width: '100%',
                marginTop: '1.5rem',
                backgroundColor: (!file || processing || success) ? '#e5e7eb' : '#2563eb',
                color: (!file || processing || success) ? '#9ca3af' : '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: (!file || processing || success) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {processing ? (
                <>
                  <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                  Processing...
                </>
              ) : (
                <>
                  <Database size={20} />
                  Process & Upload
                </>
              )}
            </button>
          </div>
        </div>

        {/* Data Preview */}
        {extractedData && (
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
                margin: 0,
                marginBottom: '0.5rem'
              }}>
                Upload Summary
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0
              }}>
                Preview of processed compliance data
              </p>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
              {/* Summary Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  padding: '1rem'
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Total Devices
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                    {extractedData.summary.totalDevices}
                  </div>
                </div>
                <div style={{
                  backgroundColor: '#f0fdf4',
                  borderRadius: '8px',
                  padding: '1rem'
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Compliant
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a' }}>
                    {extractedData.summary.compliant}
                  </div>
                </div>
                <div style={{
                  backgroundColor: '#fef2f2',
                  borderRadius: '8px',
                  padding: '1rem'
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Non-Compliant
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}>
                    {extractedData.summary.nonCompliant}
                  </div>
                </div>
                <div style={{
                  backgroundColor: '#eff6ff',
                  borderRadius: '8px',
                  padding: '1rem'
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Avg Compliance
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>
                    {extractedData.summary.avgCompliance.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Sample Devices */}
              <div>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '500',
                  color: '#111827',
                  margin: '0 0 1rem 0'
                }}>
                  Sample Devices ({Math.min(3, extractedData.devices.length)} of {extractedData.devices.length})
                </h4>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc' }}>
                        <th style={{ padding: '0.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>
                          Hostname
                        </th>
                        <th style={{ padding: '0.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>
                          OS
                        </th>
                        <th style={{ padding: '0.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>
                          Status
                        </th>
                        <th style={{ padding: '0.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>
                          Compliance %
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {extractedData.devices.slice(0, 3).map((device: any, index: number) => (
                        <tr key={index} style={{ borderTop: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.5rem', fontWeight: '500' }}>{device.hostname}</td>
                          <td style={{ padding: '0.5rem', color: '#6b7280' }}>{device.os}</td>
                          <td style={{ padding: '0.5rem' }}>
                            <span style={{
                              padding: '0.125rem 0.5rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              backgroundColor: device.complianceStatus === 'Compliant' ? '#dcfce7' : '#fee2e2',
                              color: device.complianceStatus === 'Compliant' ? '#16a34a' : '#dc2626'
                            }}>
                              {device.complianceStatus}
                            </span>
                          </td>
                          <td style={{ padding: '0.5rem', fontWeight: '500' }}>{device.percentPassing}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                backgroundColor: '#eff6ff',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Info style={{ color: '#2563eb', flexShrink: 0 }} size={16} />
                <span style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                  Data has been successfully processed and saved to the database. 
                  You can now view the updated information in the Dashboard.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}