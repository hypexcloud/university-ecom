/**
 * Affiliate System Utilities
 *
 * TODO: Rebuild in Phase 6 (Affiliate) with Drizzle.
 * Currently stubbed to remove Firebase dependency.
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
  // TODO: check against affiliate_links table
  return true
}
