/**
 * Affiliate Tracking Utilities
 * 
 * Client-side cookie management and tracking for affiliate referrals
 */

const AFFILIATE_COOKIE_NAME = 'ue_ref'
const COOKIE_DURATION_DAYS = 30

/**
 * Set affiliate referral cookie
 */
export function setAffiliateCookie(affiliateCode: string): void {
  if (typeof window === 'undefined') return
  
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + COOKIE_DURATION_DAYS)
  
  document.cookie = `${AFFILIATE_COOKIE_NAME}=${affiliateCode}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`
}

/**
 * Get affiliate referral cookie
 */
export function getAffiliateCookie(): string | null {
  if (typeof window === 'undefined') return null
  
  const cookies = document.cookie.split(';')
  
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === AFFILIATE_COOKIE_NAME) {
      return value
    }
  }
  
  return null
}

/**
 * Clear affiliate cookie
 */
export function clearAffiliateCookie(): void {
  if (typeof window === 'undefined') return
  
  document.cookie = `${AFFILIATE_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

/**
 * Check if URL has affiliate parameter
 */
export function getAffiliateFromUrl(): string | null {
  if (typeof window === 'undefined') return null
  
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('ref')
}

/**
 * Track affiliate click
 */
export async function trackAffiliateClick(affiliateCode: string): Promise<boolean> {
  try {
    const response = await fetch('/api/track-referral', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        affiliateCode,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      })
    })
    
    return response.ok
  } catch (error) {
    console.error('Error tracking affiliate click:', error)
    return false
  }
}

/**
 * Initialize affiliate tracking on page load
 * This should be called in the root layout or page
 */
export async function initAffiliateTracking(): Promise<void> {
  // Check URL for affiliate parameter
  const urlAffiliate = getAffiliateFromUrl()
  
  if (urlAffiliate) {
    // New referral - set cookie and track
    setAffiliateCookie(urlAffiliate)
    await trackAffiliateClick(urlAffiliate)
  }
  
  // Existing cookie is kept for 30 days
}

/**
 * Get current affiliate attribution
 * Returns the affiliate code if user came through referral
 */
export function getCurrentAffiliateAttribution(): string | null {
  return getAffiliateCookie()
}
