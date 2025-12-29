/**
 * License Management IPC Handlers
 *
 * Handles license verification with Gumroad and local license storage.
 */

import { ipcMain, BrowserWindow } from 'electron'
import { IPC_CHANNELS } from '../../shared/ipc-channels'
import {
  verifyLicenseWithGumroad,
  saveLicenseToSupabase,
  getLicenseFromStore,
  saveLicenseToStore,
  deleteLicenseFromStore,
  deductCredits
} from '../services/license-manager'

/**
 * Register all license-related IPC handlers
 */
export function registerLicenseHandlers(): void {
  // Verify license key with Gumroad
  ipcMain.handle(IPC_CHANNELS.LICENSE.VERIFY, async (_, licenseKey: string) => {
    try {
      console.log('[License] Verifying license key...')

      // Call Gumroad API
      const result = await verifyLicenseWithGumroad(licenseKey)

      if (result.valid) {
        console.log('[License] License verified successfully')
        console.log(`[License] Email: ${result.email}`)
        console.log(`[License] Credits: ${result.credits}`)
      } else {
        console.log('[License] License verification failed')
      }

      return result
    } catch (error) {
      console.error('[License] Error verifying license:', error)
      throw new Error('Failed to verify license key')
    }
  })

  // Get stored license
  ipcMain.handle(IPC_CHANNELS.LICENSE.GET, async () => {
    try {
      console.log('[License] Getting stored license...')
      const license = await getLicenseFromStore()

      if (license) {
        console.log(`[License] Found license for: ${license.email}`)
        console.log(`[License] Credits remaining: ${license.creditsRemaining}`)
      } else {
        console.log('[License] No license found')
      }

      return license
    } catch (error) {
      console.error('[License] Error getting license:', error)
      throw new Error('Failed to get license')
    }
  })

  // Save license (after verification)
  ipcMain.handle(IPC_CHANNELS.LICENSE.SAVE, async (_, license: any) => {
    try {
      console.log('[License] Saving license...')

      // Save to local store
      await saveLicenseToStore(license)

      // Also save to Supabase
      await saveLicenseToSupabase(license)

      console.log('[License] License saved successfully')
      return
    } catch (error) {
      console.error('[License] Error saving license:', error)
      throw new Error('Failed to save license')
    }
  })

  // Delete license (deactivate)
  ipcMain.handle(IPC_CHANNELS.LICENSE.DELETE, async () => {
    try {
      console.log('[License] Deleting license...')
      await deleteLicenseFromStore()
      console.log('[License] License deleted')
      return
    } catch (error) {
      console.error('[License] Error deleting license:', error)
      throw new Error('Failed to delete license')
    }
  })

  // Update credits (deduct)
  ipcMain.handle(IPC_CHANNELS.LICENSE.UPDATE_CREDITS, async (event, amount: number) => {
    try {
      console.log(`[License] Deducting ${amount} credits...`)

      const newBalance = await deductCredits(amount)
      console.log(`[License] New balance: ${newBalance} credits`)

      // Get the window and notify renderer of credit update
      const win = BrowserWindow.fromWebContents(event.sender)
      if (win) {
        win.webContents.send(IPC_CHANNELS.LICENSE.ON_CREDIT_UPDATE, newBalance)
      }

      return newBalance
    } catch (error) {
      console.error('[License] Error updating credits:', error)
      throw new Error('Failed to update credits')
    }
  })

  // Get current credit balance
  ipcMain.handle(IPC_CHANNELS.LICENSE.GET_BALANCE, async () => {
    try {
      console.log('[License] Getting credit balance...')
      const license = await getLicenseFromStore()

      if (!license) {
        throw new Error('No license found')
      }

      console.log(`[License] Balance: ${license.creditsRemaining} credits`)
      return license.creditsRemaining
    } catch (error) {
      console.error('[License] Error getting balance:', error)
      throw new Error('Failed to get credit balance')
    }
  })

  console.log('[License Handlers] Registered successfully')
}
