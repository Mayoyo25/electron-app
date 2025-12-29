// src/renderer/src/types/license.ts
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

export interface GumroadVerification {
  success: boolean
  purchase?: {
    email: string
    id: string
    variants: string
  }
}

export interface CreditPackage {
  name: string
  credits: number
  price: number
  gumroadProductId: string
}
