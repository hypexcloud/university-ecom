import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="text-center space-y-6 mb-12">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold">Datenschutzerklärung</h1>
        <p className="text-xl text-muted-foreground">
          Ihre Privatsphäre ist uns wichtig
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>🚧 In Entwicklung</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Die Datenschutzerklärung wird in Phase 1 / Step 10 implementiert mit:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground mb-6">
            <li>• DSGVO-konforme Datenschutzerklärung</li>
            <li>• Cookie-Einstellungen und Consent-Management</li>
            <li>• Transparente Datenverarbeitung</li>
            <li>• Nutzerrechte und Kontaktmöglichkeiten</li>
            <li>• Plausible Analytics Integration (privacy-first)</li>
          </ul>
          <Button asChild>
            <Link href="/">
              <ArrowRight className="mr-2 h-4 w-4" />
              Zur Startseite
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
