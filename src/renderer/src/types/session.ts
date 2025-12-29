// src/renderer/src/types/session.ts
export interface Session {
  id: string
  licenseKey: string
  startTime: string
  endTime: string | null
  apiCalls: number
  costUsd: number
  status: 'active' | 'paused' | 'completed'
}

export interface AnalysisResult {
  timestamp: string
  suggestions: string[]
  talkingPoints: string[]
  context: string
  costUsd: number
}

export interface SessionStats {
  totalSessions: number
  totalApiCalls: number
  totalCostUsd: number
  averageCallsPerSession: number
}
