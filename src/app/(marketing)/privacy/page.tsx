import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung - University Ecom',
  description: 'Datenschutzerklärung für die University Ecom Plattform.',
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zur Startseite
            </Link>
          </Button>
          <h1 className="text-4xl font-bold">Datenschutzerklärung</h1>
          <p className="text-muted-foreground">
            Letzte Aktualisierung: 21. Januar 2025
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Verantwortlicher</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Verantwortlicher für die Datenverarbeitung:<br/>
                University Ecom<br/>
                E-Mail: privacy@university-ecom.com
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Erhebung und Verarbeitung personenbezogener Daten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Wir erheben und verarbeiten personenbezogene Daten nur, soweit dies zur 
                Bereitstellung unserer Dienste erforderlich ist oder Sie hierzu ausdrücklich 
                eingewilligt haben.
              </p>
              <h4 className="font-semibold">Erhobene Daten:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Name und E-Mail-Adresse</li>
                <li>Unternehmensdaten (optional)</li>
                <li>Kursfortschritt und -aktivitäten</li>
                <li>Technische Daten (IP-Adresse, Browser-Informationen)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Zweck der Datenverarbeitung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Ihre Daten werden für folgende Zwecke verarbeitet:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Bereitstellung und Verbesserung unserer Kurse</li>
                <li>Kundenbetreuung und Support</li>
                <li>Abwicklung von Zahlungen</li>
                <li>Marketing (nur mit Ihrer Einwilligung)</li>
                <li>Erfüllung rechtlicher Verpflichtungen</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Rechtsgrundlage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 DSGVO:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO)</li>
                <li>Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)</li>
                <li>Berechtigte Interessen (Art. 6 Abs. 1 lit. f DSGVO)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Weitergabe von Daten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Ihre Daten werden nicht an Dritte weitergegeben, außer:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Zur Erfüllung des Vertrags erforderliche Dienstleister</li>
                <li>Bei rechtlichen Verpflichtungen</li>
                <li>Mit Ihrer ausdrücklichen Einwilligung</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Speicherdauer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Ihre Daten werden nur so lange gespeichert, wie es für die jeweiligen 
                Zwecke erforderlich ist oder gesetzliche Aufbewahrungsfristen bestehen.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Ihre Rechte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Sie haben folgende Rechte:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Auskunft über Ihre gespeicherten Daten</li>
                <li>Berichtigung unrichtiger Daten</li>
                <li>Löschung Ihrer Daten</li>
                <li>Einschränkung der Verarbeitung</li>
                <li>Datenübertragbarkeit</li>
                <li>Widerruf der Einwilligung</li>
                <li>Beschwerde bei der Aufsichtsbehörde</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Cookies und Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Unsere Website verwendet Cookies zur Verbesserung der Nutzererfahrung. 
                Sie können der Verwendung von Cookies jederzeit über Ihre Browser-Einstellungen 
                widersprechen.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Sicherheit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Wir treffen angemessene technische und organisatorische Maßnahmen zum 
                Schutz Ihrer Daten vor unbefugtem Zugriff, Verlust oder Missbrauch.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Bei Fragen zum Datenschutz kontaktieren Sie uns unter:{' '}
              <a href="mailto:privacy@university-ecom.com" className="text-primary hover:underline">
                privacy@university-ecom.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
