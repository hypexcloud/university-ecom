'use client'

import { useEffect, useState } from 'react'

/**
 * Crisp livechat widget. Only loads when:
 * 1. NEXT_PUBLIC_CRISP_WEBSITE_ID is set
 * 2. User has given marketing cookie consent (checked via localStorage)
 */
export function CrispChat() {
  const [loaded, setLoaded] = useState(false)
  const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID

  useEffect(() => {
    if (!websiteId || loaded) return

    // Check marketing consent (set by cookie consent component)
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) return

    try {
      const parsed = JSON.parse(consent)
      if (!parsed.marketing) return
    } catch {
      return
    }

    // Load Crisp
    ;(window as any).$crisp = []
    ;(window as any).CRISP_WEBSITE_ID = websiteId

    const script = document.createElement('script')
    script.src = 'https://client.crisp.chat/l.js'
    script.async = true
    document.head.appendChild(script)
    setLoaded(true)
  }, [websiteId, loaded])

  return null
}
