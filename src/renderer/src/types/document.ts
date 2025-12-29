// src/renderer/src/types/document.ts
export interface Document {
  id: string
  licenseKey: string
  fileName: string
  filePath: string
  fileType: string
  fileSize: number
  extractedText: string | null
  createdAt: string
}

export interface DocumentUpload {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error'
  error?: string
}
