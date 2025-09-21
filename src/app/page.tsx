import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, BookOpen, TrendingUp, Users, Star } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background to-muted/50 px-6 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              <span className="text-primary">University Ecom</span>
              <br />
              <span className="text-muted-foreground">AI & Dropshipping</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Praktische Kurse für Unternehmer in Europa. Lernen Sie von Experten, ohne Hype, mit echten Ergebnissen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/courses">
                  Kurse entdecken
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link href="/about">
                  Über uns erfahren
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Course Selection */}
      <section className="px-6 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Wählen Sie Ihren Weg</h2>
            <p className="text-xl text-muted-foreground">
              Spezialisierte Kurse für AI und Dropshipping
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">AI Kurs</CardTitle>
                <CardDescription className="text-base">
                  Künstliche Intelligenz für Ihr Business nutzen
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
                    <span>ChatGPT und AI-Tools effektiv einsetzen</span>
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
                    <span>Automatisierung von Geschäftsprozessen</span>
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
                    <span>AI-gestützte Kundenbetreuung</span>
                  </li>
                </ul>
                <Button asChild className="w-full">
                  <Link href="/courses/ai">
                    AI Kurs ansehen
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Dropshipping Kurs</CardTitle>
                <CardDescription className="text-base">
                  Erfolgreiches E-Commerce ohne Lagerkosten
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
                    <span>Profitable Nischen und Produkte finden</span>
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
                    <span>EU-konforme Shop-Erstellung</span>
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
                    <span>Marketing und Kundengewinnung</span>
                  </li>
                </ul>
                <Button asChild className="w-full">
                  <Link href="/courses/dropshipping">
                    Dropshipping Kurs ansehen
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-muted/30 px-6 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Vertrauen Sie auf Qualität</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-muted-foreground">Zufriedene Studenten</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">4.9/5</div>
                <div className="text-muted-foreground">Durchschnittliche Bewertung</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-muted-foreground">Community Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Starten Sie noch heute Ihre Reise
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Schließen Sie sich hunderten erfolgreicher Unternehmer an und transformieren Sie Ihr Business.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/courses">
              Jetzt beginnen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
