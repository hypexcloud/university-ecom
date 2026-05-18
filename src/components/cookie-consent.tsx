'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface ConsentState {
  essential: boolean
  analytics: boolean
  marketing: boolean
  timestamp: string
}

const STORAGE_KEY = 'cookie_consent'

export function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      setVisible(true)
    }
  }, [])

  const saveConsent = async (consent: ConsentState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent))
    setVisible(false)

    // Log to server
    await fetch('/api/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(consent),
    }).catch(() => {})
  }

  const acceptAll = () => {
    saveConsent({
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    })
  }

  const acceptSelected = () => {
    saveConsent({
      essential: true,
      analytics,
      marketing,
      timestamp: new Date().toISOString(),
    })
  }

  const rejectOptional = () => {
    saveConsent({
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    })
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-black/95 border-t border-gray-800 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <div className="flex-1">
            <h3 className="text-white font-bold mb-1">Cookie-Einstellungen</h3>
            <p className="text-gray-400 text-sm">
              Wir verwenden Cookies, um die Nutzung unserer Website zu analysieren und unsere Dienste zu verbessern.
              Essenzielle Cookies sind für den Betrieb notwendig.{' '}
              <a href="/legal/datenschutz" className="text-[#D4AF37] hover:underline">Datenschutzerklärung</a>
            </p>

            {showDetails && (
              <div className="mt-3 space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input type="checkbox" checked disabled className="accent-[#D4AF37]" />
                  <span>Essenzielle Cookies (immer aktiv)</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="accent-[#D4AF37]"
                  />
                  <span>Analyse-Cookies (Plausible)</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="accent-[#D4AF37]"
                  />
                  <span>Marketing-Cookies (Livechat)</span>
                </label>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            {!showDetails && (
              <Button variant="outline" size="sm" onClick={() => setShowDetails(true)} className="text-gray-300 border-gray-600">
                Einstellungen
              </Button>
            )}
            {showDetails && (
              <Button variant="outline" size="sm" onClick={acceptSelected} className="text-gray-300 border-gray-600">
                Auswahl speichern
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={rejectOptional} className="text-gray-300 border-gray-600">
              Nur Essenzielle
            </Button>
            <Button size="sm" onClick={acceptAll} className="bg-[#D4AF37] text-black hover:bg-[#c9a430]">
              Alle akzeptieren
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
