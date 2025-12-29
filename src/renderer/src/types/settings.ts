// src/renderer/src/types/settings.ts
export interface AppSettings {
  capture: {
    frequency: number // seconds
    autoCapture: boolean
    hotkey: string
  }
  display: {
    theme: 'light' | 'dark' | 'system'
    overlayPosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
    overlaySize: 'small' | 'medium' | 'large'
    autoHideDelay: number // seconds
  }
  ai: {
    responseStyle: 'bullet' | 'paragraph' | 'concise'
    maxSuggestions: number
  }
}
