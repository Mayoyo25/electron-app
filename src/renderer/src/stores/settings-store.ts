// src/renderer/src/stores/settings-store.ts
import { create } from 'zustand'
import { AppSettings } from '../types/settings'

interface SettingsState {
  settings: AppSettings
  isLoading: boolean

  loadSettings: () => Promise<void>
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>
  resetSettings: () => void
}

const defaultSettings: AppSettings = {
  capture: {
    frequency: 15,
    autoCapture: true,
    hotkey: 'CommandOrControl+Shift+Space'
  },
  display: {
    theme: 'system',
    overlayPosition: 'top-right',
    overlaySize: 'medium',
    autoHideDelay: 30
  },
  ai: {
    responseStyle: 'bullet',
    maxSuggestions: 4
  }
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: defaultSettings,
  isLoading: false,

  loadSettings: async () => {
    set({ isLoading: true })
    // const settings = await window.electron.getSettings();
    set({ settings: defaultSettings, isLoading: false })
  },

  updateSettings: async (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    }))
    // await window.electron.saveSettings(get().settings);
  },

  resetSettings: () => set({ settings: defaultSettings })
}))
