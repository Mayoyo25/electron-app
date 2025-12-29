// src/renderer/src/types/electron.d.ts
export interface ElectronAPI {
  // Screen capture
  captureScreen: () => Promise<string>
  startAutoCapture: (frequency: number) => Promise<void>
  stopAutoCapture: () => Promise<void>

  // License management
  verifyLicense: (licenseKey: string) => Promise<GumroadVerification>
  getLicense: () => Promise<License | null>
  saveLicense: (license: License) => Promise<void>

  // Document management
  uploadDocument: (filePath: string) => Promise<Document>
  deleteDocument: (documentId: string) => Promise<boolean>

  // Session management
  startSession: () => Promise<Session>
  endSession: (sessionId: string) => Promise<void>
  getSessionStats: () => Promise<SessionStats>

  // Settings
  getSettings: () => Promise<AppSettings>
  saveSettings: (settings: AppSettings) => Promise<void>

  // App control
  minimizeWindow: () => void
  maximizeWindow: () => void
  closeWindow: () => void

  // Event listeners
  onScreenCaptured: (callback: (imageData: string) => void) => void
  onCreditUpdate: (callback: (credits: number) => void) => void
}

declare global {
  interface Window {
    electron: ElectronAPI
  }
}
