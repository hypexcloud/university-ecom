import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function MarketingNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center space-y-6">
        <h1 className="text-7xl font-bold text-prestige-gold-500">404</h1>
        <h2 className="text-2xl font-bold text-prestige-white">Seite nicht gefunden</h2>
        <p className="text-prestige-gray-400 max-w-md">
          Die angeforderte Seite existiert nicht oder wurde verschoben.
        </p>
        <Button asChild className="bg-prestige-gold-500 text-black hover:bg-prestige-gold-400">
          <Link href="/">Zurück zur Startseite</Link>
        </Button>
      </div>
    </div>
  )
}
