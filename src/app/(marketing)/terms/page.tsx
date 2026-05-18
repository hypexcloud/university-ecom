import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Allgemeine Geschäftsbedingungen - University Ecom',
  description: 'Allgemeine Geschäftsbedingungen für die Nutzung der University Ecom Plattform.',
}

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold">Allgemeine Geschäftsbedingungen</h1>
          <p className="text-muted-foreground">
            Letzte Aktualisierung: 21. Januar 2025
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Geltungsbereich</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Diese Allgemeinen Geschäftsbedingungen (AGB) regeln die Nutzung der Plattform 
                University Ecom und die Teilnahme an unseren Online-Kursen.
              </p>
              <p>
                Anbieter: University Ecom<br/>
                Kontakt: support@university-ecom.com
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Vertragsschluss</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Der Vertrag kommt durch die Anmeldung zu einem Kurs und die Bestätigung 
                durch University Ecom zustande.
              </p>
              <p>
                Die Darstellung der Kurse auf unserer Website stellt kein bindendes Angebot dar, 
                sondern eine Aufforderung zur Abgabe eines Angebots.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Leistungsumfang</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                University Ecom bietet Online-Kurse in den Bereichen Künstliche Intelligenz 
                und Dropshipping an. Der Umfang der Leistungen ergibt sich aus der jeweiligen 
                Kursbeschreibung.
              </p>
              <p>
                Alle Kursinhalte sind urheberrechtlich geschützt und dürfen nicht ohne 
                Zustimmung weitergegeben werden.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Preise und Zahlungsbedingungen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Die Preise sind in Euro angegeben und verstehen sich inklusive der 
                gesetzlichen Mehrwertsteuer.
              </p>
              <p>
                Die Zahlung erfolgt vor Kursbeginn über die verfügbaren Zahlungsmethoden.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Widerrufsrecht</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Verbrauchern steht ein 14-tägiges Widerrufsrecht ab Vertragsschluss zu. 
                Das Widerrufsrecht erlischt bei vollständiger Erfüllung des Vertrags, 
                wenn der Verbraucher ausdrücklich zugestimmt hat.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Haftung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                University Ecom haftet nur für Schäden, die auf einer vorsätzlichen oder 
                grob fahrlässigen Pflichtverletzung beruhen.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Datenschutz</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer 
                Datenschutzerklärung und den Bestimmungen der DSGVO.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Schlussbestimmungen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Es gilt deutsches Recht. Sollten einzelne Bestimmungen unwirksam sein, 
                bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Bei Fragen zu diesen AGB kontaktieren Sie uns unter:{' '}
              <a href="mailto:legal@university-ecom.com" className="text-primary hover:underline">
                legal@university-ecom.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
