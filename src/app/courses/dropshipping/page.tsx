import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, TrendingUp, Star, Clock, Users, CheckCircle, ShoppingCart, Target, Truck } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dropshipping Kurs - Erfolgreiches E-Commerce ohne Lagerkosten',
  description: 'Lernen Sie profitable Dropshipping-Strategien für den EU-Markt. 16 Wochen intensive Ausbildung mit praktischen Fallstudien.',
}

export default function DropshippingCourse() {
  return (
    <div className="container mx-auto px-6 py-12 space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <TrendingUp className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold">
          Dropshipping Kurs
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Bauen Sie ein profitables E-Commerce Business ohne Lagerkosten auf. 
          Lernen Sie bewährte Strategien für den EU-Markt mit vollständiger 
          rechtlicher Compliance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/pricing/dropshipping">
              Jetzt einschreiben
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
            <Link href="#curriculum">
              Lehrplan ansehen
            </Link>
          </Button>
        </div>
      </div>

      {/* Course Overview */}
      <div className="grid lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader className="text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
            <CardTitle>16 Wochen</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">Umfassende Ausbildung von den Grundlagen bis zur Skalierung</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <CardTitle>300+ Studenten</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">Erfolgreiche Dropshipper in unserer Community</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-primary" />
            <CardTitle>4.8/5 Bewertung</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">Durchschnittliche Studentenbewertung</p>
          </CardContent>
        </Card>
      </div>

      {/* What You'll Learn */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Was Sie lernen werden</h2>
          <p className="text-xl text-muted-foreground">
            Alles was Sie für ein erfolgreiches Dropshipping Business brauchen
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: 'Nischen- & Produktanalyse',
              description: 'Identifizieren Sie profitable Nischen und Winning Products mit bewährten Research-Methoden.',
              icon: Target
            },
            {
              title: 'EU-konformer Shop-Aufbau',
              description: 'Erstellen Sie rechtssichere Online-Shops die allen EU-Vorschriften entsprechen.',
              icon: ShoppingCart
            },
            {
              title: 'Lieferantenmanagement',
              description: 'Finden und verwalten Sie zuverlässige Lieferanten für konsistente Qualität und Lieferzeiten.',
              icon: Truck
            },
            {
              title: 'Marketing & Kundenakquise',
              description: 'Meistern Sie Facebook Ads, Google Ads und organische Marketing-Strategien.',
              icon: Users
            },
            {
              title: 'Automatisierung & Tools',
              description: 'Automatisieren Sie Ihre Prozesse mit den besten Tools für Effizienz und Skalierung.',
              icon: CheckCircle
            },
            {
              title: 'Skalierung & Optimierung',
              description: 'Skalieren Sie Ihr Business systematisch und optimieren Sie kontinuierlich Ihre Prozesse.',
              icon: TrendingUp
            }
          ].map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Why EU Focus */}
      <div className="bg-muted/30 rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Warum EU-fokussiert?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unser Kurs ist speziell für den europäischen Markt entwickelt
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <h3 className="font-semibold mb-2">DSGVO Compliance</h3>
            <p className="text-sm text-muted-foreground">
              Vollständige Einhaltung aller Datenschutzbestimmungen
            </p>
          </div>
          <div className="text-center">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <h3 className="font-semibold mb-2">EU-VAT Integration</h3>
            <p className="text-sm text-muted-foreground">
              Automatisierte Mehrwertsteuer-Abwicklung für alle EU-Länder
            </p>
          </div>
          <div className="text-center">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <h3 className="font-semibold mb-2">Rechtssicherheit</h3>
            <p className="text-sm text-muted-foreground">
              Vollständige Compliance mit Verbraucherrechten und Widerrufsgesetzen
            </p>
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div id="curriculum" className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Lehrplan</h2>
          <p className="text-xl text-muted-foreground">
            16 Wochen strukturiertes Lernen
          </p>
        </div>

        <div className="grid gap-4">
          {[
            {
              week: '1-2',
              title: 'Dropshipping Grundlagen & Marktanalyse',
              topics: ['Business Model verstehen', 'EU-Markt Analyse', 'Nischenfindung', 'Konkurrenzanalyse']
            },
            {
              week: '3-4',
              title: 'Produktrecherche & Lieferanten',
              topics: ['Winning Products finden', 'Lieferanten bewerten', 'Qualitätskontrolle', 'Verhandlungsstrategien']
            },
            {
              week: '5-6',
              title: 'Shop-Erstellung & Design',
              topics: ['Shopify/WooCommerce Setup', 'Conversion-optimiertes Design', 'Mobile Optimierung', 'Payment Integration']
            },
            {
              week: '7-8',
              title: 'Rechtliche Compliance',
              topics: ['DSGVO Umsetzung', 'AGB & Impressum', 'Widerrufsrecht', 'VAT Registration']
            },
            {
              week: '9-10',
              title: 'Marketing & Traffic Generation',
              topics: ['Facebook Ads Mastery', 'Google Ads Setup', 'Influencer Marketing', 'Content Marketing']
            },
            {
              week: '11-12',
              title: 'Conversion Optimierung',
              topics: ['A/B Testing', 'Landing Page Optimization', 'Email Marketing', 'Retargeting Campaigns']
            }
          ].map((module, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Woche {module.week}: {module.title}</CardTitle>
                  </div>
                  <div className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                    Woche {module.week}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {module.topics.map((topic, topicIndex) => (
                    <div key={topicIndex} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{topic}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            + 4 weitere Wochen mit Skalierung, Automatisierung und fortgeschrittenen Strategien
          </p>
          <Button asChild variant="outline">
            <Link href="/pricing/dropshipping">
              Vollständigen Lehrplan anzeigen
            </Link>
          </Button>
        </div>
      </div>

      {/* Success Stories Preview */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Erfolgsgeschichten</h2>
          <p className="text-xl text-muted-foreground">
            Unsere Studenten erzielen echte Ergebnisse
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: 'Maria K.',
              result: '€15.000 Monatsumsatz',
              timeframe: 'nach 4 Monaten',
              testimonial: 'Der EU-fokussierte Ansatz war genau das was ich brauchte.'
            },
            {
              name: 'Thomas S.',
              result: '€8.500 Profit',
              timeframe: 'im ersten Monat',
              testimonial: 'Die rechtlichen Aspekte haben mir viel Kopfzerbrechen erspart.'
            },
            {
              name: 'Anna L.',
              result: '3 erfolgreiche Shops',
              timeframe: 'in 6 Monaten',
              testimonial: 'Skalierung war einfacher als gedacht mit den richtigen Strategien.'
            }
          ].map((story, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">{story.name}</CardTitle>
                <CardDescription className="text-2xl font-bold text-primary">
                  {story.result}
                </CardDescription>
                <p className="text-sm text-muted-foreground">{story.timeframe}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm italic">"{story.testimonial}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Bereit für Ihr Dropshipping Business?</h2>
        <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
          Starten Sie noch heute Ihre Reise zum erfolgreichen E-Commerce Unternehmer 
          mit unserem bewährten, EU-konformen System.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/pricing/dropshipping">
              Jetzt einschreiben
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
            <Link href="/courses/ai">
              AI Kurs ansehen
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
