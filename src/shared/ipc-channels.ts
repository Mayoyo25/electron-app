/**
 * IPC Channel Constants
 *
 * Central definition of all IPC communication channels between Main and Renderer processes.
 * Import this in both Main and Renderer to ensure type safety and consistency.
 *
 * Usage:
 * - Main: ipcMain.handle(IPC_CHANNELS.SCREEN.CAPTURE, handler)
 * - Renderer: ipcRenderer.invoke(IPC_CHANNELS.SCREEN.CAPTURE)
 */

export const IPC_CHANNELS = {
  // ======================
  // SCREEN CAPTURE
  // ======================
  SCREEN: {
    CAPTURE: 'screen:capture', // Capture single screenshot
    START_AUTO: 'screen:start-auto', // Start auto-capture loop
    STOP_AUTO: 'screen:stop-auto', // Stop auto-capture
    GET_SOURCES: 'screen:get-sources', // Get available screens
    ON_CAPTURED: 'screen:on-captured' // Event: screenshot ready
  },

  // ======================
  // LICENSE MANAGEMENT
  // ======================
  LICENSE: {
    VERIFY: 'license:verify', // Verify with Gumroad
    GET: 'license:get', // Get stored license
    SAVE: 'license:save', // Save license
    DELETE: 'license:delete', // Remove license
    UPDATE_CREDITS: 'license:update-credits', // Deduct credits
    GET_BALANCE: 'license:get-balance', // Get current balance
    ON_CREDIT_UPDATE: 'license:on-credit-update' // Event: credits changed
  },

  // ======================
  // DOCUMENT MANAGEMENT
  // ======================
  DOCUMENT: {
    UPLOAD: 'document:upload', // Upload to Supabase
    LIST: 'document:list', // Get user's documents
    DELETE: 'document:delete', // Delete document
    GET_TEXT: 'document:get-text', // Get extracted text
    PROCESS: 'document:process', // Extract text from file
    ON_UPLOAD_PROGRESS: 'document:on-progress' // Event: upload progress
  },

  // ======================
  // SESSION MANAGEMENT
  // ======================
  SESSION: {
    START: 'session:start', // Begin session
    END: 'session:end', // End session
    PAUSE: 'session:pause', // Pause auto-capture
    RESUME: 'session:resume', // Resume auto-capture
    GET_CURRENT: 'session:get-current', // Get active session
    GET_HISTORY: 'session:get-history', // Get past sessions
    GET_STATS: 'session:get-stats', // Get statistics
    LOG_API_CALL: 'session:log-api-call' // Track API usage
  },

  // ======================
  // AI ANALYSIS
  // ======================
  AI: {
    ANALYZE: 'ai:analyze', // Analyze screenshot
    GET_SUGGESTIONS: 'ai:get-suggestions', // Get cached suggestions
    CLEAR_CACHE: 'ai:clear-cache', // Clear suggestion cache
    ON_ANALYSIS_COMPLETE: 'ai:on-complete', // Event: analysis ready
    ON_ANALYSIS_ERROR: 'ai:on-error' // Event: analysis failed
  },

  // ======================
  // SETTINGS
  // ======================
  SETTINGS: {
    GET: 'settings:get', // Load settings
    UPDATE: 'settings:update', // Save settings
    RESET: 'settings:reset', // Reset to defaults
    SET_HOTKEY: 'settings:set-hotkey', // Register global hotkey
    GET_DEFAULTS: 'settings:get-defaults' // Get default values
  },

  // ======================
  // WINDOW CONTROL
  // ======================
  WINDOW: {
    MINIMIZE: 'window:minimize', // Minimize window
    MAXIMIZE: 'window:maximize', // Maximize/restore
    CLOSE: 'window:close', // Close window
    SHOW_OVERLAY: 'window:show-overlay', // Show suggestions overlay
    HIDE_OVERLAY: 'window:hide-overlay', // Hide overlay
    SET_ALWAYS_ON_TOP: 'window:set-always-on-top' // Toggle always on top
  },

  // ======================
  // APP LIFECYCLE
  // ======================
  APP: {
    GET_VERSION: 'app:get-version', // Get app version
    GET_PLATFORM: 'app:get-platform', // Get OS platform
    CHECK_UPDATES: 'app:check-updates', // Check for updates
    DOWNLOAD_UPDATE: 'app:download-update', // Download update
    INSTALL_UPDATE: 'app:install-update', // Install and restart
    ON_UPDATE_AVAILABLE: 'app:on-update-available', // Event: update found
    ON_UPDATE_DOWNLOADED: 'app:on-update-downloaded', // Event: ready to install
    QUIT: 'app:quit' // Quit application
  },

  // ======================
  // FILE SYSTEM
  // ======================
  FILE: {
    SELECT: 'file:select', // Open file picker
    SELECT_MULTIPLE: 'file:select-multiple', // Open multi-file picker
    GET_PATH: 'file:get-path', // Get file path
    READ: 'file:read', // Read file content
    SHOW_IN_FOLDER: 'file:show-in-folder' // Show file in explorer
  },

  // ======================
  // STORE (Local Storage)
  // ======================
  STORE: {
    GET: 'store:get', // Get value from store
    SET: 'store:set', // Set value in store
    DELETE: 'store:delete', // Delete key
    CLEAR: 'store:clear', // Clear all data
    HAS: 'store:has' // Check if key exists
  },

  // ======================
  // LOGGING & DEBUGGING
  // ======================
  LOG: {
    INFO: 'log:info', // Log info message
    ERROR: 'log:error', // Log error
    DEBUG: 'log:debug', // Log debug info
    GET_LOGS: 'log:get-logs' // Get recent logs
  }
} as const

// Type helper to ensure channel names are strings
export type IPCChannel = typeof IPC_CHANNELS

// Helper to get all channel names (for validation)
export function getAllChannels(): string[] {
  const channels: string[] = []

  Object.values(IPC_CHANNELS).forEach((category) => {
    Object.values(category).forEach((channel) => {
      channels.push(channel)
    })
  })

  return channels
}

// Helper to validate channel name
export function isValidChannel(channel: string): boolean {
  return getAllChannels().includes(channel)
}
