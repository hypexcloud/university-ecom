import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Euro, Crown, Zap } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Preise - Wählen Sie Ihren Plan',
  description: 'Transparente Preise für unsere AI und Dropshipping Kurse. Pro und Max Pläne verfügbar.',
}

export default function PricingPage({ params }: { params: { course: string } }) {
  const course = params.course
  const isAI = course === 'ai'
  const courseTitle = isAI ? 'AI Kurs' : 'Dropshipping Kurs'
  
  return (
    <div className="container mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">
          {courseTitle} - Preise
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Wählen Sie den Plan, der am besten zu Ihren Bedürfnissen passt. 
          Alle Preise verstehen sich inklusive MwSt.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Pro Plan */}
        <Card className="relative hover:shadow-xl transition-all duration-300 border-2">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Pro Plan</CardTitle>
            <CardDescription>
              Perfekt für Einsteiger und kleine Unternehmen
            </CardDescription>
            <div className="text-4xl font-bold text-primary mt-4">
              €497
              <span className="text-base font-normal text-muted-foreground">
                {' '}einmalig
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              <li className="flex items-center">
                <Euro className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                <span>Vollständiger Kurszugang (lebenslang)</span>
              </li>
              <li className="flex items-center">
                <Euro className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                <span>Alle Lektionen und Übungen</span>
              </li>
              <li className="flex items-center">
                <Euro className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                <span>Community-Zugang (WhatsApp & Discord)</span>
              </li>
              <li className="flex items-center">
                <Euro className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                <span>Email-Support</span>
              </li>
              <li className="flex items-center">
                <Euro className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                <span>Kurs-Updates (kostenlos)</span>
              </li>
              <li className="flex items-center">
                <Euro className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                <span>Abschlusszertifikat</span>
              </li>
            </ul>
            
            <Button asChild className="w-full text-lg py-6">
              <Link href="/checkout">
                Pro Plan wählen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Max Plan */}
        <Card className="relative hover:shadow-xl transition-all duration-300 border-2 border-primary">
          <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full">
            Beliebt
          </div>
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Crown className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Max Plan</CardTitle>
            <CardDescription>
              Für ambitionierte Unternehmer mit persönlicher Betreuung
            </CardDescription>
            <div className="text-4xl font-bold text-primary mt-4">
              €997
              <span className="text-base font-normal text-muted-foreground">
                {' '}einmalig
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-sm text-center bg-primary/10 text-primary py-2 px-4 rounded">
              Alles aus Pro Plan PLUS:
            </div>
            
            <ul className="space-y-3">
              <li className="flex items-center">
                <Crown className="h-4 w-4 text-yellow-500 mr-3 flex-shrink-0" />
                <span>1-zu-1 Mentoring (3 Sessions)</span>
              </li>
              <li className="flex items-center">
                <Crown className="h-4 w-4 text-yellow-500 mr-3 flex-shrink-0" />
                <span>Persönlicher Erfolgs-Coach</span>
              </li>
              <li className="flex items-center">
                <Crown className="h-4 w-4 text-yellow-500 mr-3 flex-shrink-0" />
                <span>Priorisierter Support</span>
              </li>
              <li className="flex items-center">
                <Crown className="h-4 w-4 text-yellow-500 mr-3 flex-shrink-0" />
                <span>Exklusive Masterclasses</span>
              </li>
              <li className="flex items-center">
                <Crown className="h-4 w-4 text-yellow-500 mr-3 flex-shrink-0" />
                <span>Business-Review & Feedback</span>
              </li>
              <li className="flex items-center">
                <Crown className="h-4 w-4 text-yellow-500 mr-3 flex-shrink-0" />
                <span>Direkter Draht zum Expertenteam</span>
              </li>
            </ul>
            
            <Button asChild className="w-full text-lg py-6">
              <Link href="/checkout">
                Max Plan wählen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Features Comparison */}
      <div className="bg-muted/30 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-8">Was ist enthalten?</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Feature</th>
                <th className="text-center py-3 px-4">Pro</th>
                <th className="text-center py-3 px-4">Max</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              {[
                ['Vollständiger Kurszugang', true, true],
                ['Community-Zugang', true, true],
                ['Email-Support', true, true],
                ['Abschlusszertifikat', true, true],
                ['1-zu-1 Mentoring', false, true],
                ['Persönlicher Coach', false, true],
                ['Priorisierter Support', false, true],
                ['Exklusive Masterclasses', false, true],
              ].map(([feature, pro, max], index) => (
                <tr key={index} className="border-b border-muted">
                  <td className="py-3 px-4">{feature}</td>
                  <td className="text-center py-3 px-4">
                    {pro ? (
                      <Euro className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="text-center py-3 px-4">
                    {max ? (
                      <Crown className="h-5 w-5 text-yellow-500 mx-auto" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-bold">Sichere Zahlungsmethoden</h2>
        <p className="text-muted-foreground">
          Wir akzeptieren alle gängigen Zahlungsmethoden
        </p>
        <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
          <span>💳 Kreditkarte (Visa, Mastercard)</span>
          <span>🏦 PayPal</span>
          <span>₿ Kryptowährungen</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Alle Preise inkl. 19% MwSt. | 14 Tage Geld-zurück-Garantie
        </p>
      </div>

      {/* FAQ Preview */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Häufige Fragen</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ist der Zugang wirklich lebenslang?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Ja, nach dem Kauf haben Sie lebenslangen Zugang zu allen Inhalten 
                und erhalten kostenlose Updates.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gibt es eine Geld-zurück-Garantie?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Ja, wir bieten eine 14-tägige Geld-zurück-Garantie, falls Sie 
                nicht zufrieden sind.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
