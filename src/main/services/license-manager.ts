/**
 * License Manager Service
 *
 * Handles license verification with Gumroad and storage/retrieval
 * of license information using electron-store and Supabase.
 */

import Store from 'electron-store'
import { createClient } from '@supabase/supabase-js'

// Initialize electron-store for local storage
const store = new Store({
  name: 'license-data',
  encryptionKey: process.env.ENCRYPTION_KEY // Optional encryption
})

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key in main process
)

export interface License {
  id: string
  email: string
  licenseKey: string
  purchaseId: string
  creditsTotal: number
  creditsRemaining: number
  activatedAt: string
  lastUsed: string | null
}

export interface GumroadVerificationResult {
  valid: boolean
  email?: string
  purchaseId?: string
  credits?: number
}

/**
 * Verify license key with Gumroad API
 */
export async function verifyLicenseWithGumroad(
  licenseKey: string
): Promise<GumroadVerificationResult> {
  try {
    const productId = process.env.GUMROAD_PRODUCT_ID

    if (!productId) {
      throw new Error('GUMROAD_PRODUCT_ID not configured')
    }

    console.log('[LicenseManager] Calling Gumroad API...')

    const response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        product_id: productId,
        license_key: licenseKey,
        increment_uses_count: 'false' // Don't increment on verification
      })
    })

    const data = await response.json()
    console.log('[LicenseManager] Gumroad response:', data)

    if (data.success && data.purchase) {
      // Parse credits from variant (e.g., "100 Credits")
      const credits = parseCreditsFromVariant(data.purchase.variants)

      return {
        valid: true,
        email: data.purchase.email,
        purchaseId: data.purchase.id,
        credits: credits
      }
    }

    return { valid: false }
  } catch (error) {
    console.error('[LicenseManager] Error verifying with Gumroad:', error)
    throw error
  }
}

/**
 * Parse credit amount from Gumroad variant string
 * Example: "100 Credits" -> 100
 */
function parseCreditsFromVariant(variant: string): number {
  if (!variant) return 100 // Default

  const match = variant.match(/(\d+)\s*Credits?/i)
  return match ? parseInt(match[1]) : 100
}

/**
 * Get license from local store
 */
export async function getLicenseFromStore(): Promise<License | null> {
  try {
    const license = store.get('license') as License | undefined
    return license || null
  } catch (error) {
    console.error('[LicenseManager] Error getting license from store:', error)
    return null
  }
}

/**
 * Save license to local store
 */
export async function saveLicenseToStore(license: License): Promise<void> {
  try {
    store.set('license', license)
    console.log('[LicenseManager] License saved to local store')
  } catch (error) {
    console.error('[LicenseManager] Error saving to store:', error)
    throw error
  }
}

/**
 * Delete license from local store
 */
export async function deleteLicenseFromStore(): Promise<void> {
  try {
    store.delete('license')
    console.log('[LicenseManager] License deleted from store')
  } catch (error) {
    console.error('[LicenseManager] Error deleting from store:', error)
    throw error
  }
}

/**
 * Save license to Supabase
 */
export async function saveLicenseToSupabase(license: License): Promise<void> {
  try {
    console.log('[LicenseManager] Saving to Supabase...')

    const { error } = await supabase
      .from('user_licenses')
      .upsert({
        email: license.email,
        license_key: license.licenseKey,
        purchase_id: license.purchaseId,
        credits_total: license.creditsTotal,
        credits_remaining: license.creditsRemaining,
        activated_at: license.activatedAt,
        app_version: process.env.APP_VERSION,
        platform: process.platform
      })
      .select()

    if (error) {
      console.error('[LicenseManager] Supabase error:', error)
      throw error
    }

    console.log('[LicenseManager] Saved to Supabase successfully')
  } catch (error) {
    console.error('[LicenseManager] Error saving to Supabase:', error)
    // Don't throw - allow local-only operation if Supabase fails
  }
}

/**
 * Deduct credits from license
 */
export async function deductCredits(amount: number): Promise<number> {
  try {
    const license = await getLicenseFromStore()

    if (!license) {
      throw new Error('No license found')
    }

    if (license.creditsRemaining < amount) {
      throw new Error('Insufficient credits')
    }

    // Calculate new balance
    const newBalance = license.creditsRemaining - amount

    // Update local store
    license.creditsRemaining = newBalance
    license.lastUsed = new Date().toISOString()
    await saveLicenseToStore(license)

    // Update Supabase
    await updateCreditsInSupabase(license.licenseKey, newBalance)

    return newBalance
  } catch (error) {
    console.error('[LicenseManager] Error deducting credits:', error)
    throw error
  }
}

/**
 * Update credits in Supabase
 */
async function updateCreditsInSupabase(licenseKey: string, newBalance: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('user_licenses')
      .update({
        credits_remaining: newBalance,
        last_used: new Date().toISOString()
      })
      .eq('license_key', licenseKey)

    if (error) {
      console.error('[LicenseManager] Error updating Supabase:', error)
    }
  } catch (error) {
    console.error('[LicenseManager] Supabase update failed:', error)
    // Don't throw - allow local operation to continue
  }
}

/**
 * Check if user has sufficient credits
 */
export async function hasCredits(amount: number): Promise<boolean> {
  try {
    const license = await getLicenseFromStore()
    return license ? license.creditsRemaining >= amount : false
  } catch (error) {
    console.error('[LicenseManager] Error checking credits:', error)
    return false
  }
}
