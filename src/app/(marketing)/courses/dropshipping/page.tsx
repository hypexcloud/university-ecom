import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, TrendingUp, CheckCircle2, Crown, Clock, Users, Star, Shield, Euro, Check, Calendar } from 'lucide-react'
import Link from 'next/link'
import { DROPSHIPPING_COURSE_DATA } from '@/lib/courses-data'

export const metadata = {
  title: 'EU Dropshipping Kurs - 2 Monate Intensive Ausbildung',
  description: 'Bauen Sie ein profitables EU-konformes Dropshipping Business. 2 Monate intensive Ausbildung mit rechtlicher Compliance.',
}

export default function DropshippingCoursePage() {
  const course = DROPSHIPPING_COURSE_DATA

  return (
    <div className="min-h-screen bg-prestige-black">
      {/* Hero Section */}
      <section className="section-prestige px-6 py-20 md:py-28">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center space-x-2 bg-prestige-gold-500/10 border border-prestige-gold-500/30 rounded-full px-4 py-2">
                <TrendingUp className="h-4 w-4 text-prestige-gold-500" />
                <span className="text-prestige-gold-500 text-sm font-semibold">2 Monate Intensiv-Programm</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-display font-bold text-prestige-white">
                EU Dropshipping
                <br />
                <span className="text-gradient-gold">Kurs</span>
              </h1>
              
              <p className="text-xl text-prestige-gray-300 leading-relaxed">
                Bauen Sie ein profitables, rechtssicheres Dropshipping Business im europäischen Markt. Von der Produktauswahl bis zur Skalierung.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center space-x-2 text-prestige-gray-300">
                  <Clock className="h-5 w-5 text-prestige-gold-500" />
                  <span>60 Tage</span>
                </div>
                <div className="flex items-center space-x-2 text-prestige-gray-300">
                  <Users className="h-5 w-5 text-prestige-gold-500" />
                  <span>Max. 5 Teilnehmer</span>
                </div>
                <div className="flex items-center space-x-2 text-prestige-gray-300">
                  <Shield className="h-5 w-5 text-prestige-gold-500" />
                  <span>100% EU-Konform</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button asChild size="lg" className="btn-gold text-lg px-8 py-6">
                  <Link href="#plaene">
                    Jetzt starten
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="btn-prestige text-lg px-8 py-6">
                  <Link href="/contact">
                    Erstgespräch buchen
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="relative">
              <div className="card-prestige p-8 space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-display font-bold text-prestige-white">Kurs-Highlights</h3>
                  <Crown className="h-8 w-8 text-prestige-gold-500" />
                </div>
                {[
                  'Profitable Nischen finden',
                  'Zuverlässige Lieferanten',
                  'Professioneller Shop-Aufbau',
                  'Conversion-Optimierung',
                  'DSGVO & VAT Compliance',
                  'Skalierungs-Strategien'
                ].map((highlight, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-prestige-gold-500 mt-1 flex-shrink-0" />
                    <span className="text-prestige-gray-200">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Modules */}
      <section className="px-6 py-20 bg-prestige-black">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-prestige-white mb-4">
              Kurs-Module
            </h2>
            <div className="accent-line-gold mx-auto mb-6"></div>
            <p className="text-xl text-prestige-gray-300 max-w-2xl mx-auto">
              6 umfassende Module über 8 Wochen
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {course.modules.map((module, i) => (
              <Card key={module.id} className="card-prestige hover:border-prestige-gold-500/60 transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-prestige-gold-500 text-sm font-semibold">Woche {module.week}</span>
                    <div className="w-8 h-8 bg-prestige-gold-500/10 rounded-full flex items-center justify-center text-prestige-gold-500 text-sm font-bold">
                      {i + 1}
                    </div>
                  </div>
                  <CardTitle className="text-prestige-white">{module.titleDE}</CardTitle>
                  <CardDescription className="text-prestige-gray-400">
                    {module.descriptionDE}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {module.topics.map((topic, j) => (
                      <div key={j} className="flex items-start space-x-2 text-sm text-prestige-gray-300">
                        <Euro className="h-4 w-4 text-prestige-gold-500 mt-0.5 flex-shrink-0" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Legal Compliance Section */}
      <section className="px-6 py-20 bg-prestige-black">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-prestige-white mb-4">
              100% EU-Konform
            </h2>
            <div className="accent-line-gold mx-auto mb-6"></div>
            <p className="text-xl text-prestige-gray-300 max-w-2xl mx-auto">
              Rechtssicherheit ist unser höchstes Gebot
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: 'DSGVO', desc: 'Datenschutz-Grundverordnung vollständig implementiert' },
              { title: 'AGB & Impressum', desc: 'Rechtssichere Texte für Ihren Shop' },
              { title: 'Widerrufsrecht', desc: 'EU-konforme Widerrufsbelehrung' },
              { title: 'VAT & Steuern', desc: 'Umsatzsteuer korrekt abwickeln' },
            ].map((item, i) => (
              <Card key={i} className="card-prestige text-center">
                <CardHeader>
                  <Shield className="h-12 w-12 text-prestige-gold-500 mx-auto mb-3" />
                  <CardTitle className="text-prestige-gold-500 text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-prestige-gray-400 text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why This Course */}
      <section className="px-6 py-20 section-prestige">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-prestige-white mb-4">
              Warum dieser Kurs?
            </h2>
            <div className="accent-line-gold mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-prestige text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-prestige-gold-500/10 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-prestige-gold-500" />
                </div>
                <CardTitle className="text-prestige-gold-500">Bewährte Strategien</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-prestige-gray-300">
                  Profitieren Sie von erprobten Methoden, die bereits hunderte erfolgreiche Shops hervorgebracht haben.
                </p>
              </CardContent>
            </Card>

            <Card className="card-prestige text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-prestige-gold-500/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-prestige-gold-500" />
                </div>
                <CardTitle className="text-prestige-gold-500">Kleine Gruppen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-prestige-gray-300">
                  Maximal 5 Teilnehmer pro Kohorte für intensive, persönliche Betreuung durch Esat.
                </p>
              </CardContent>
            </Card>

            <Card className="card-prestige text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-prestige-gold-500/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-prestige-gold-500" />
                </div>
                <CardTitle className="text-prestige-gold-500">Rechtssicher</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-prestige-gray-300">
                  Keine Abmahnungen, keine rechtlichen Probleme. Wir zeigen Ihnen, wie es richtig geht.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Plan Selection */}
      <section className="px-6 py-20 border-t border-prestige-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-prestige-white mb-4">Wähle deinen Plan</h2>
            <p className="text-prestige-gray-400">Alle Preise inkl. 19% MwSt. · Lebenslanger Zugang</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {DROPSHIPPING_COURSE_DATA.plans.map((plan) => {
              const isPopular = plan.name === 'business'
              return (
                <Card key={plan.id} className={`relative bg-prestige-gray-900/50 text-prestige-white ${isPopular ? 'border-2 border-prestige-gold-500' : 'border-prestige-gray-800'}`}>
                  {isPopular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-prestige-gold-500 text-black text-xs font-bold px-3 py-1 rounded-full">BELIEBT</div>}
                  <CardHeader className="text-center pt-8">
                    <CardTitle className="text-xl text-prestige-gold-500">{plan.displayNameDE}</CardTitle>
                    <div className="text-4xl font-bold text-prestige-white mt-3">€{plan.price.toLocaleString('de-DE')}<span className="text-sm font-normal text-prestige-gray-400"> inkl. MwSt.</span></div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <ul className="space-y-2">
                      {plan.featuresDE.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-prestige-gray-300"><Check className="h-4 w-4 text-prestige-gold-500 mt-0.5 flex-shrink-0" />{f}</li>
                      ))}
                    </ul>
                    <div className="space-y-2">
                      <Button asChild className={`w-full ${isPopular ? 'bg-prestige-gold-500 text-black hover:bg-prestige-gold-400' : 'bg-prestige-gray-800 text-prestige-white hover:bg-prestige-gray-700'}`}>
                        <Link href={`/checkout?course=dropshipping&plan=${plan.name}`}>Jetzt kaufen <ArrowRight className="ml-2 h-4 w-4" /></Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full border-prestige-gray-700 text-prestige-gray-300 hover:border-prestige-gold-500 hover:text-prestige-white">
                        <Link href="/intake"><Calendar className="mr-2 h-4 w-4" /> Erstgespräch</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
