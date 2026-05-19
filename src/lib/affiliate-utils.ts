/**
 * Affiliate System Utilities
 *
 * TODO: Rebuild in Phase 6 (Affiliate) with Drizzle.
 * Currently stubbed.
 */

export const COMMISSION_RATES = {
  fast: 0.10,
  business: 0.12,
  infinity: 0.15,
  'creator-tiktok': 0.15,
  'creator-youtube': 0.15,
} as const

export function generateAffiliateCode(prefix: string): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = prefix.slice(0, 3).toUpperCase()
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export async function isAffiliateCodeAvailable(_code: string): Promise<boolean> {
  return true
}

// Legacy exports for backward compatibility
export async function getAffiliateData(_uid: string) { return null }
export async function getAffiliateCommissions(_uid: string) { return [] }
export async function getAffiliateClicks(_uid: string) { return [] }
export async function getAffiliateByCode(_code: string) { return null }
export async function createAffiliateApplication(_data: unknown) { return { id: 'stub' } }
export async function trackReferralClick(_code: string) { return }
export async function updateCommissionStatus(_id: string, _status: string) { return }
