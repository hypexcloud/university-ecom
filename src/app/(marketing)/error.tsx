'use client'

import { Button } from '@/components/ui/button'

export default function MarketingError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-prestige-white">Etwas ist schiefgelaufen</h1>
        <p className="text-prestige-gray-400">Ein unerwarteter Fehler ist aufgetreten.</p>
        <Button onClick={reset} className="bg-prestige-gold-500 text-black hover:bg-prestige-gold-400">
          Erneut versuchen
        </Button>
      </div>
    </div>
  )
}
