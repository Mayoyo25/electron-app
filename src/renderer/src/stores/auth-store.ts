// src/renderer/src/stores/auth-store.ts
import { create } from 'zustand'
import { License } from '../types/license'

interface AuthState {
  license: License | null
  isActivated: boolean
  isLoading: boolean

  setLicense: (license: License) => void
  clearLicense: () => void
  updateCredits: (remaining: number) => void
  loadLicense: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  license: null,
  isActivated: false,
  isLoading: true,

  setLicense: (license) => set({ license, isActivated: true, isLoading: false }),
  clearLicense: () => set({ license: null, isActivated: false }),
  updateCredits: (remaining) =>
    set((state) => ({
      license: state.license ? { ...state.license, creditsRemaining: remaining } : null
    })),
  loadLicense: async () => {
    set({ isLoading: true })
    // Will implement with electron IPC
    // const license = await window.electron.getLicense();
    // set({ license, isActivated: !!license, isLoading: false });
  }
}))
