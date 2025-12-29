/**
 * MAIN PROCESS ENTRY POINT
 *
 * This is where your Electron app starts. It:
 * 1. Creates the main window
 * 2. Registers all IPC handlers
 * 3. Handles app lifecycle events
 */

import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// Import IPC handlers
import { registerScreenHandlers, cleanupScreenHandlers } from './ipc/screen.handlers'
import { registerLicenseHandlers, cleanupLicenseHandlers } from './ipc/license.handlers'
// Import more handlers as you create them:
// import { registerDocumentHandlers } from './ipc/document.handlers';
// import { registerSessionHandlers } from './ipc/session.handlers';
// import { registerSettingsHandlers } from './ipc/settings.handlers';
// import { registerWindowHandlers } from './ipc/window.handlers';

// Store main window reference
let mainWindow: BrowserWindow | null = null

/**
 * Create the main application window
 */
function createWindow(): void {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false, // Don't show until ready
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false, // Required for some Electron APIs
      contextIsolation: true, // Security: isolate renderer context
      nodeIntegration: false // Security: don't expose Node.js to renderer
    }
  })

  // Show window when ready (prevents white flash)
  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  // Open external links in browser
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Load the app
  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Open DevTools in development
  if (is.dev) {
    mainWindow.webContents.openDevTools()
  }
}

/**
 * Register all IPC handlers
 * Call this BEFORE creating windows
 */
function registerAllHandlers(): void {
  console.log('Registering IPC handlers...')

  // Register screen handlers
  registerScreenHandlers()

  // Register license handlers
  registerLicenseHandlers()

  // TODO: Add more handlers as you build them
  // registerDocumentHandlers();
  // registerSessionHandlers();
  // registerSettingsHandlers();
  // registerWindowHandlers();

  console.log('All IPC handlers registered')
}

/**
 * Clean up all handlers
 */
function cleanupAllHandlers(): void {
  console.log('Cleaning up IPC handlers...')

  cleanupScreenHandlers()
  cleanupLicenseHandlers()

  console.log('All IPC handlers cleaned up')
}

// ==========================================
// APP LIFECYCLE EVENTS
// ==========================================

/**
 * This method will be called when Electron has finished
 * initialization and is ready to create browser windows.
 */
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.interviewcoach.ai')

  // Register IPC handlers FIRST
  registerAllHandlers()

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Create main window
  createWindow()

  // On macOS, re-create window when dock icon is clicked
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

/**
 * Quit when all windows are closed, except on macOS
 */
app.on('window-all-closed', () => {
  // Clean up handlers
  cleanupAllHandlers()

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

/**
 * Before quit - cleanup
 */
app.on('before-quit', () => {
  cleanupAllHandlers()
})

// ==========================================
// WINDOW CONTROL IPC HANDLERS
// (Simple ones can go here instead of separate file)
// ==========================================

ipcMain.handle('window:minimize', () => {
  mainWindow?.minimize()
})

ipcMain.handle('window:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})

ipcMain.handle('window:close', () => {
  mainWindow?.close()
})

// ==========================================
// APP INFO IPC HANDLERS
// ==========================================

ipcMain.handle('app:get-version', () => {
  return app.getVersion()
})

ipcMain.handle('app:get-path', (_, name: string) => {
  return app.getPath(name as any)
})

// ==========================================
// ERROR HANDLING
// ==========================================

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error)
  // TODO: Send to error tracking service
})

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason)
  // TODO: Send to error tracking service
})

// ==========================================
// DEBUGGING HELPERS
// ==========================================

// Log when IPC handlers are called (development only)
if (is.dev) {
  ipcMain.on('*', (event, ...args) => {
    console.log('IPC Event:', event, args)
  })
}
