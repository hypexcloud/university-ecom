import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, BookOpen, TrendingUp, Users, Star, Crown, Zap, Shield, Trophy } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Prestige Black + Gold */}
      <section className="relative section-prestige px-6 py-24 md:py-32 overflow-hidden">
        {/* Gold glow effect */}
        <div className="absolute inset-0 bg-prestige-glow opacity-30"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-8 animate-fade-in-up">
            {/* Crown Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-prestige-gold-500/10 rounded-full flex items-center justify-center border-2 border-prestige-gold-500/30">
                <Crown className="w-10 h-10 text-prestige-gold-500" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight">
              <span className="text-prestige-white">University</span>{' '}
              <span className="text-gradient-gold">Ecom</span>
            </h1>
            
            <div className="accent-line-gold mx-auto"></div>
            
            <p className="text-xl md:text-2xl text-prestige-gray-300 max-w-3xl mx-auto leading-relaxed">
              Exklusive Ausbildung in <span className="text-prestige-gold-500 font-semibold">AI-Automation</span> und{' '}
              <span className="text-prestige-gold-500 font-semibold">EU-Dropshipping</span> für ambitionierte Unternehmer
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button 
                asChild 
                size="lg" 
                className="btn-gold text-lg px-10 py-7 font-semibold"
              >
                <Link href="#kurse">
                  Kurse entdecken
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="btn-prestige text-lg px-10 py-7 font-semibold"
              >
                <Link href="#erstgespraech">
                  Erstgespräch buchen
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-prestige-gold-500 to-transparent"></div>
      </section>

      {/* Why University Ecom - USPs */}
      <section className="px-6 py-20 bg-prestige-black">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-prestige-white mb-4">
              Warum University Ecom?
            </h2>
            <div className="accent-line-gold mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-prestige text-center group">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-prestige-gold-500/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-prestige-gold-500/20 transition-all">
                  <Crown className="h-8 w-8 text-prestige-gold-500" />
                </div>
                <CardTitle className="text-prestige-gold-500 text-xl">Premium Qualität</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-prestige-gray-300">
                  Keine Masse, sondern Elite-Ausbildung. Individuelles 1:1 Mentoring für maximalen Erfolg.
                </p>
              </CardContent>
            </Card>

            <Card className="card-prestige text-center group">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-prestige-gold-500/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-prestige-gold-500/20 transition-all">
                  <Shield className="h-8 w-8 text-prestige-gold-500" />
                </div>
                <CardTitle className="text-prestige-gold-500 text-xl">EU-Konform</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-prestige-gray-300">
                  Rechtssicher in Europa agieren. DSGVO, VAT und alle rechtlichen Aspekte abgedeckt.
                </p>
              </CardContent>
            </Card>

            <Card className="card-prestige text-center group">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-prestige-gold-500/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-prestige-gold-500/20 transition-all">
                  <Zap className="h-8 w-8 text-prestige-gold-500" />
                </div>
                <CardTitle className="text-prestige-gold-500 text-xl">Praxisnah</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-prestige-gray-300">
                  Kein Theorie-Marathon. Direkt umsetzbare Strategien und Tools für sofortige Resultate.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Kurse nebeneinander */}
      <section id="kurse" className="px-6 py-20 section-prestige">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-prestige-white mb-4">
              Unsere Kurse
            </h2>
            <div className="accent-line-gold mx-auto mb-6"></div>
            <p className="text-xl text-prestige-gray-300 max-w-2xl mx-auto">
              Zwei spezialisierte Programme, entwickelt für Ihren Erfolg
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* AI Kurs */}
            <Card className="card-prestige border-2 hover:border-prestige-gold-500/60 transition-all duration-300 hover-glow">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-20 h-20 bg-prestige-gold-500/10 rounded-full flex items-center justify-center mb-6 border-2 border-prestige-gold-500/30">
                  <BookOpen className="h-10 w-10 text-prestige-gold-500" />
                </div>
                <CardTitle className="text-3xl font-display text-prestige-white mb-2">
                  AI Kurs
                </CardTitle>
                <CardDescription className="text-prestige-gold-500 text-lg font-semibold">
                  3 Monate • Ab €200
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-prestige-gray-300 text-center">
                  Meistern Sie Künstliche Intelligenz für Ihr Business
                </p>
                
                <div className="space-y-3">
                  {[
                    'AI Grundlagen',
                    'Prompt Engineering',
                    'Automationen & Workflows',
                    'Marketing & Content',
                    'Chatbots & Kundenservice',
                    'Analyse & Optimierung'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center text-prestige-gray-200">
                      <Star className="h-4 w-4 text-prestige-gold-500 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4">
                  <Button asChild className="w-full btn-gold text-base py-6">
                    <Link href="/courses/ai">
                      AI Kurs ansehen
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Dropshipping Kurs */}
            <Card className="card-prestige border-2 hover:border-prestige-gold-500/60 transition-all duration-300 hover-glow">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-20 h-20 bg-prestige-gold-500/10 rounded-full flex items-center justify-center mb-6 border-2 border-prestige-gold-500/30">
                  <TrendingUp className="h-10 w-10 text-prestige-gold-500" />
                </div>
                <CardTitle className="text-3xl font-display text-prestige-white mb-2">
                  Dropshipping Kurs
                </CardTitle>
                <CardDescription className="text-prestige-gold-500 text-lg font-semibold">
                  2 Monate • Ab €200
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-prestige-gray-300 text-center">
                  Bauen Sie ein profitables EU-konformes E-Commerce Business
                </p>
                
                <div className="space-y-3">
                  {[
                    'Markt & Produktanalyse',
                    'Lieferanten-Management',
                    'Shop-Aufbau',
                    'Conversion-Optimierung',
                    'Recht (DSGVO, AGB, VAT)',
                    'Marketing & Skalierung'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center text-prestige-gray-200">
                      <Star className="h-4 w-4 text-prestige-gold-500 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4">
                  <Button asChild className="w-full btn-gold text-base py-6">
                    <Link href="/courses/dropshipping">
                      Dropshipping Kurs ansehen
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Creator Programm CTA */}
          <div className="mt-12 text-center">
            <Card className="card-prestige inline-block max-w-lg">
              <CardContent className="pt-6 pb-6 px-8">
                <h3 className="text-2xl font-display font-bold text-prestige-gold-500 mb-2">Creator Programm</h3>
                <p className="text-prestige-gray-300 mb-4">1:1 Coaching für TikTok & YouTube Creator</p>
                <div className="flex gap-4 justify-center">
                  <span className="text-prestige-white font-bold">TikTok ab €75</span>
                  <span className="text-prestige-gray-600">|</span>
                  <span className="text-prestige-white font-bold">YouTube ab €100</span>
                </div>
                <Button asChild className="mt-4 bg-prestige-gold-500 text-black hover:bg-prestige-gold-400">
                  <Link href="/creator">Creator Programm entdecken <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pläne Preview */}
      <section className="px-6 py-20 bg-prestige-black">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-prestige-white mb-4">
              Wählen Sie Ihren Plan
            </h2>
            <div className="accent-line-gold mx-auto mb-6"></div>
            <p className="text-xl text-prestige-gray-300">
              Von selbstgesteuert bis Premium-Coaching
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="card-prestige text-center">
              <CardHeader>
                <CardTitle className="text-prestige-gold-500 text-2xl mb-2">Fast</CardTitle>
                <div className="text-4xl font-bold text-prestige-white mb-4">€200</div>
              </CardHeader>
              <CardContent>
                <p className="text-prestige-gray-300 mb-4">Perfekt für Selbstlerner</p>
                <ul className="text-left space-y-2 text-prestige-gray-300 text-sm">
                  <li>✓ Alle Video-Inhalte</li>
                  <li>✓ Kursmaterialien</li>
                  <li>✓ Community-Zugang</li>
                  <li className="text-prestige-gray-500">✗ Kein 1:1 Mentoring</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-prestige text-center border-prestige-gold-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-prestige-gold-500 text-prestige-black px-4 py-1 rounded-full text-sm font-semibold">
                BELIEBT
              </div>
              <CardHeader>
                <CardTitle className="text-prestige-gold-500 text-2xl mb-2">Business</CardTitle>
                <div className="text-4xl font-bold text-prestige-white mb-4">€1.000</div>
              </CardHeader>
              <CardContent>
                <p className="text-prestige-gray-300 mb-4">Mit 1:1 Betreuung</p>
                <ul className="text-left space-y-2 text-prestige-gray-300 text-sm">
                  <li>✓ Alles aus Fast</li>
                  <li>✓ 1:1 Mentoring</li>
                  <li>✓ Direkte Unterstützung</li>
                  <li>✓ Wöchentliche Check-ins</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-prestige text-center">
              <CardHeader>
                <CardTitle className="text-prestige-gold-500 text-2xl mb-2">Infinity</CardTitle>
                <div className="text-4xl font-bold text-prestige-white mb-4">
                  €3.000<span className="text-sm text-prestige-gray-400">+</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-prestige-gray-300 mb-4">Premium Coaching</p>
                <ul className="text-left space-y-2 text-prestige-gray-300 text-sm">
                  <li>✓ Alles aus Business</li>
                  <li>✓ Premium Support</li>
                  <li>✓ Unbegrenzte Q&A</li>
                  <li>✓ Custom Solutions</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-10">
            <Button asChild variant="outline" className="btn-prestige">
              <Link href="/pricing">
                Alle Pläne vergleichen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-6 py-20 section-prestige">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-prestige-white mb-4">
              Vertrauen durch Ergebnisse
            </h2>
            <div className="accent-line-gold mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Trophy className="w-12 h-12 text-prestige-gold-500 mx-auto mb-4" />
              <div className="text-5xl font-bold text-gradient-gold mb-2">500+</div>
              <div className="text-prestige-gray-300">Erfolgreiche Absolventen</div>
            </div>
            <div className="text-center">
              <Star className="w-12 h-12 text-prestige-gold-500 mx-auto mb-4" />
              <div className="text-5xl font-bold text-gradient-gold mb-2">4.9/5</div>
              <div className="text-prestige-gray-300">Durchschnittsbewertung</div>
            </div>
            <div className="text-center">
              <Shield className="w-12 h-12 text-prestige-gold-500 mx-auto mb-4" />
              <div className="text-5xl font-bold text-gradient-gold mb-2">100%</div>
              <div className="text-prestige-gray-300">EU-Konform</div>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 text-prestige-gold-500 mx-auto mb-4" />
              <div className="text-5xl font-bold text-gradient-gold mb-2">24/7</div>
              <div className="text-prestige-gray-300">Community Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Erstgespräch */}
      <section id="erstgespraech" className="px-6 py-24 bg-prestige-black">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-8">
            <Crown className="w-16 h-16 text-prestige-gold-500 mx-auto" />
            <h2 className="text-4xl md:text-5xl font-display font-bold text-prestige-white">
              Bereit für den nächsten Schritt?
            </h2>
            <div className="accent-line-gold mx-auto"></div>
            <p className="text-xl text-prestige-gray-300 max-w-2xl mx-auto">
              Buchen Sie ein kostenloses Erstgespräch und erfahren Sie, welcher Kurs am besten zu Ihnen passt.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="btn-gold text-lg px-10 py-7">
                <Link href="/contact">
                  Erstgespräch buchen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="btn-prestige text-lg px-10 py-7">
                <Link href="/courses">
                  Kurse ansehen
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
