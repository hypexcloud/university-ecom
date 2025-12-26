'use client'

import { useEffect } from 'react'
import { initAffiliateTracking } from '@/lib/affiliate-tracking'

/**
 * Affiliate Tracking Component
 * Place this in layout or pages where you want to track referrals
 */
export default function AffiliateTracker() {
  useEffect(() => {
    initAffiliateTracking()
  }, [])

  return null // This component doesn't render anything
}
