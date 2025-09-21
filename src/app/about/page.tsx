import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Users, Award, Globe, Heart, Star, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Über uns - University Ecom',
  description: 'Erfahren Sie mehr über University Ecom - Ihre vertrauenswürdige Quelle für professionelle AI und Dropshipping Ausbildung in Europa.',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-6 py-12 space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Users className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold">
          Über University Ecom
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Wir sind Ihr vertrauenswürdiger Partner für professionelle Online-Ausbildung 
          in AI und Dropshipping. Mit Fokus auf praktisches Wissen und echte Ergebnisse 
          helfen wir Unternehmern in Europa dabei, erfolgreich zu werden.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Unsere Mission</h2>
          <p className="text-lg text-muted-foreground">
            Wir demokratisieren den Zugang zu hochwertiger Business-Ausbildung. 
            Unser Ziel ist es, jedem Unternehmer - unabhängig von Vorerfahrung oder 
            Budget - die Werkzeuge und das Wissen zu geben, um in der digitalen 
            Wirtschaft erfolgreich zu sein.
          </p>
          <ul className="space-y-3">
            <li className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>Praktisches Wissen ohne unnötige Theorie</span>
            </li>
            <li className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>EU-konforme und rechtssichere Strategien</span>
            </li>
            <li className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>Kontinuierliche Betreuung und Community-Support</span>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Unsere Vision</h2>
          <p className="text-lg text-muted-foreground">
            Wir sehen eine Zukunft, in der jeder Unternehmer die Macht von AI und 
            E-Commerce nutzen kann, um nachhaltige und profitable Businesses zu 
            schaffen. Europa soll dabei führend werden bei ethischem und 
            verantwortungsvollem digitalen Unternehmertum.
          </p>
          <div className="bg-primary/5 rounded-lg p-6">
            <h3 className="font-semibold mb-3 flex items-center">
              <Heart className="h-5 w-5 text-red-500 mr-2" />
              Unsere Werte
            </h3>
            <ul className="space-y-2 text-sm">
              <li>• <strong>Transparenz:</strong> Ehrliche Kommunikation, keine falschen Versprechen</li>
              <li>• <strong>Qualität:</strong> Nur bewährte Strategien und aktuelle Inhalte</li>
              <li>• <strong>Community:</strong> Zusammenhalt und gegenseitige Unterstützung</li>
              <li>• <strong>Ethik:</strong> Verantwortungsvoller Umgang mit Technologie</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Trust Signals */}
      <div className="bg-muted/30 rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Vertrauen Sie auf Erfahrung</h2>
          <p className="text-xl text-muted-foreground">
            Zahlen, die für sich sprechen
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-sm text-muted-foreground">Erfolgreiche Absolventen</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">4.9/5</div>
            <div className="text-sm text-muted-foreground">Durchschnittsbewertung</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">95%</div>
            <div className="text-sm text-muted-foreground">Weiterempfehlungsrate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">Community Support</div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Warum University Ecom?</h2>
          <p className="text-xl text-muted-foreground">
            Was uns von anderen unterscheidet
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Praxis-orientiert</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Keine endlose Theorie - nur bewährte Strategien und praktische 
                Übungen, die Sie sofort umsetzen können.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Globe className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>EU-Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Spezialist für den europäischen Markt mit vollständiger DSGVO- und 
                VAT-Compliance in allen Kursinhalten.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Lebenslange Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Werden Sie Teil einer aktiven Community von Gleichgesinnten mit 
                lebenslangem Zugang und Support.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Team Preview */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Unser Expertenteam</h2>
          <p className="text-xl text-muted-foreground">
            Lernen Sie von praktizierenden Unternehmern und Experten
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <CardTitle>AI & Automation Team</CardTitle>
              <CardDescription>Praktiker mit 10+ Jahren Erfahrung</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Unser AI-Team besteht aus erfolgreichen Unternehmern, die AI-Tools 
                täglich in ihren eigenen Businesses einsetzen.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Award className="h-10 w-10 text-primary" />
              </div>
              <CardTitle>E-Commerce Experten</CardTitle>
              <CardDescription>8-stellige Umsätze erwirtschaftet</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Unsere Dropshipping-Experten haben selbst mehrere millionenschwere 
                E-Commerce Unternehmen aufgebaut.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Globe className="h-10 w-10 text-primary" />
              </div>
              <CardTitle>Legal & Compliance</CardTitle>
              <CardDescription>EU-Rechtsexperten</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Unser Rechts-Team sorgt dafür, dass alle Strategien vollständig 
                EU-konform und rechtssicher sind.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Testimonials Preview */}
      <div className="bg-primary/5 rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Was unsere Studenten sagen</h2>
          <div className="flex justify-center space-x-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground italic mb-4">
                "University Ecom hat mein Business komplett transformiert. Die AI-Strategien 
                haben meine Produktivität verdreifacht und der Support ist fantastisch."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Michael S.</div>
                  <div className="text-sm text-muted-foreground">AI Kurs Absolvent</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground italic mb-4">
                "Endlich ein Dropshipping Kurs, der sich auf Europa konzentriert! 
                Binnen 3 Monaten hatte ich meinen ersten profitablen Shop."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Sarah K.</div>
                  <div className="text-sm text-muted-foreground">Dropshipping Kurs Absolventin</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button asChild variant="outline">
            <Link href="/reviews">
              Alle Bewertungen ansehen
            </Link>
          </Button>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center space-y-6">
        <h2 className="text-3xl font-bold">Bereit, mit uns zu starten?</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Schließen Sie sich hunderten erfolgreicher Unternehmer an und transformieren 
          Sie Ihr Business mit unserer bewährten Ausbildung.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/courses">
              Kurse entdecken
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
            <Link href="/support">
              Kontakt aufnehmen
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
