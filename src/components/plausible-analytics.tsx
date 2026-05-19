'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

/**
 * Plausible Analytics — DSGVO-compliant, EU-hosted.
 * Only loads after analytics cookie consent is granted.
 */
export function PlausibleAnalytics() {
  const [allowed, setAllowed] = useState(false)
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN

  useEffect(() => {
    if (!domain) return

    const consent = localStorage.getItem('cookie_consent')
    if (!consent) return

    try {
      const parsed = JSON.parse(consent)
      if (parsed.analytics) setAllowed(true)
    } catch {
      // ignore
    }
  }, [domain])

  if (!allowed || !domain) return null

  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  )
}
