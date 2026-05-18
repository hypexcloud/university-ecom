import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, BookOpen, TrendingUp, Star, Clock, Users, Award } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kurse',
  description: 'Wählen Sie zwischen unserem AI Kurs und Dropshipping Kurs. Professionelle Ausbildung für moderne Unternehmer.',
}

export default function CoursesPage() {
  return (
    <div className="container mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">
          Wählen Sie Ihren Kurs
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Spezialisierte Ausbildung in AI und Dropshipping. Beide Kurse sind für Anfänger bis 
          Fortgeschrittene geeignet und bieten praktisches Wissen für sofortige Anwendung.
        </p>
      </div>

      {/* Course Comparison */}
      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* AI Course */}
        <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">
            Beliebt
          </div>
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl">AI Kurs</CardTitle>
            <CardDescription className="text-lg">
              Künstliche Intelligenz für Ihr Business nutzen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Was Sie lernen:</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>ChatGPT und andere AI-Tools professionell einsetzen</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Automatisierung von Geschäftsprozessen</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>AI-gestützte Kundenbetreuung und Marketing</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Content-Erstellung mit AI</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>AI-basierte Datenanalyse</span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-t border-b">
              <div className="text-center">
                <Clock className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <div className="text-sm font-medium">12 Wochen</div>
                <div className="text-xs text-muted-foreground">Kursdauer</div>
              </div>
              <div className="text-center">
                <Users className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <div className="text-sm font-medium">250+ Studenten</div>
                <div className="text-xs text-muted-foreground">Aktive Teilnehmer</div>
              </div>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full text-lg py-6">
                <Link href="/courses/ai">
                  AI Kurs Details ansehen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/pricing#ai">
                  Preise vergleichen
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dropshipping Course */}
        <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
            Bewährt
          </div>
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <TrendingUp className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl">Dropshipping Kurs</CardTitle>
            <CardDescription className="text-lg">
              Erfolgreiches E-Commerce ohne Lagerkosten
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Was Sie lernen:</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Profitable Nischen und Produkte identifizieren</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>EU-konforme Online-Shops erstellen</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Effektives Marketing und Kundenakquise</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Lieferantenmanagement und Qualitätskontrolle</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Automatisierung und Skalierung</span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-t border-b">
              <div className="text-center">
                <Clock className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <div className="text-sm font-medium">16 Wochen</div>
                <div className="text-xs text-muted-foreground">Kursdauer</div>
              </div>
              <div className="text-center">
                <Users className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <div className="text-sm font-medium">300+ Studenten</div>
                <div className="text-xs text-muted-foreground">Aktive Teilnehmer</div>
              </div>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full text-lg py-6">
                <Link href="/courses/dropshipping">
                  Dropshipping Kurs Details ansehen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/pricing#dropshipping">
                  Preise vergleichen
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trust Section */}
      <div className="bg-muted/30 rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Warum University Ecom?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Unsere Kurse sind von Experten entwickelt und praxisorientiert gestaltet
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Zertifizierte Ausbildung</h3>
            <p className="text-sm text-muted-foreground">
              Erhalten Sie ein anerkanntes Zertifikat nach erfolgreichem Abschluss
            </p>
          </div>
          <div className="text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Community Support</h3>
            <p className="text-sm text-muted-foreground">
              Vernetzen Sie sich mit anderen Unternehmern und Experten
            </p>
          </div>
          <div className="text-center">
            <Clock className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Lebenslanger Zugang</h3>
            <p className="text-sm text-muted-foreground">
              Einmaliger Kauf, lebenslanger Zugang zu allen Inhalten und Updates
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
