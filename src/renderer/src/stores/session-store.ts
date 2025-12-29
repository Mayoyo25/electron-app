// src/renderer/src/stores/session-store.ts
import { create } from 'zustand'
import { Session, AnalysisResult } from '../types/session'

interface SessionState {
  currentSession: Session | null
  isActive: boolean
  analysisHistory: AnalysisResult[]

  startSession: () => Promise<void>
  endSession: () => Promise<void>
  pauseSession: () => void
  resumeSession: () => void
  addAnalysis: (result: AnalysisResult) => void
  clearHistory: () => void
}

export const useSessionStore = create<SessionState>((set, get) => ({
  currentSession: null,
  isActive: false,
  analysisHistory: [],

  startSession: async () => {
    // const session = await window.electron.startSession();
    set({ currentSession: null, isActive: true, analysisHistory: [] })
  },

  endSession: async () => {
    const { currentSession } = get()
    if (currentSession) {
      // await window.electron.endSession(currentSession.id);
    }
    set({ currentSession: null, isActive: false })
  },

  pauseSession: () => set({ isActive: false }),
  resumeSession: () => set({ isActive: true }),

  addAnalysis: (result) =>
    set((state) => ({
      analysisHistory: [...state.analysisHistory, result]
    })),

  clearHistory: () => set({ analysisHistory: [] })
}))
