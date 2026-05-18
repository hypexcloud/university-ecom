import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Crown, ArrowRight, X, Calendar } from 'lucide-react'
import Link from 'next/link'
import { AI_COURSE_DATA, DROPSHIPPING_COURSE_DATA } from '@/lib/courses-data'

export const metadata = {
  title: 'Pläne & Preise - University Ecom',
  description: 'Vergleichen Sie unsere Pläne für AI und Dropshipping Kurse. Fast, Business, oder Infinity - finden Sie den perfekten Plan für Ihren Erfolg.',
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-prestige-black">
      {/* Hero Section */}
      <section className="section-prestige px-6 py-20 md:py-28">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center space-x-2 bg-prestige-gold-500/10 border border-prestige-gold-500/30 rounded-full px-4 py-2 mb-6">
            <Crown className="h-4 w-4 text-prestige-gold-500" />
            <span className="text-prestige-gold-500 text-sm font-semibold">Transparente Preisgestaltung</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-display font-bold text-prestige-white mb-6">
            Pläne & <span className="text-gradient-gold">Preise</span>
          </h1>
          
          <div className="accent-line-gold mx-auto mb-6"></div>
          
          <p className="text-xl text-prestige-gray-300 max-w-3xl mx-auto">
            Wählen Sie den Plan, der am besten zu Ihren Zielen passt. Alle Pläne beinhalten lebenslangen Zugang zu den Kursinhalten.
          </p>
        </div>
      </section>

      {/* AI Kurs Pricing */}
      <section id="ai" className="px-6 py-20 bg-prestige-black scroll-mt-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-prestige-white mb-3">
              AI Automations Kurs
            </h2>
            <p className="text-prestige-gray-400">3 Monate • 6 Module</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {AI_COURSE_DATA.plans.map((plan) => {
              const isPopular = plan.name === 'business'
              return (
                <Card 
                  key={plan.id}
                  className={`card-prestige relative ${
                    isPopular ? 'border-prestige-gold-500 shadow-gold' : ''
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-prestige-gold-500 text-prestige-black px-4 py-1 rounded-full text-sm font-semibold">
                      BELIEBT
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl text-prestige-white mb-2">
                      {plan.displayNameDE}
                    </CardTitle>
                    <div className="mt-4">
                      <span className="text-5xl font-bold text-prestige-white">
                        €{plan.price.toLocaleString('de-DE')}
                      </span>
                    </div>
                    <CardDescription className="text-prestige-gray-400 mt-4">
                      {plan.descriptionDE}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.featuresDE.map((feature, i) => (
                        <li key={i} className="flex items-start text-prestige-gray-300">
                          <Check className="h-5 w-5 text-prestige-gold-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="space-y-3">
                      <Button asChild className={`w-full ${isPopular ? 'btn-gold' : 'btn-prestige'}`}>
                        <Link href={`/checkout?course=ai&plan=${plan.name}`}>
                          Jetzt kaufen <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full border-prestige-gray-600 text-prestige-gray-300 hover:text-prestige-white hover:border-prestige-gold-500">
                        <Link href="/intake">
                          <Calendar className="mr-2 h-4 w-4" /> Erstgespräch vereinbaren
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Dropshipping Kurs Pricing */}
      <section id="dropshipping" className="px-6 py-20 section-prestige scroll-mt-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-prestige-white mb-3">
              EU Dropshipping Kurs
            </h2>
            <p className="text-prestige-gray-400">2 Monate • 6 Module</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {DROPSHIPPING_COURSE_DATA.plans.map((plan) => {
              const isPopular = plan.name === 'business'
              const isInfinity = plan.name === 'infinity'
              return (
                <Card 
                  key={plan.id}
                  className={`card-prestige relative ${
                    isPopular ? 'border-prestige-gold-500 shadow-gold' : ''
                  } ${isInfinity ? 'border-prestige-gold-600' : ''}`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-prestige-gold-500 text-prestige-black px-4 py-1 rounded-full text-sm font-semibold">
                      BELIEBT
                    </div>
                  )}
                  {isInfinity && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-prestige-gold-500 to-prestige-gold-600 text-prestige-black px-4 py-1 rounded-full text-sm font-semibold">
                      PREMIUM
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl text-prestige-white mb-2">
                      {plan.displayNameDE}
                    </CardTitle>
                    <div className="mt-4">
                      <span className="text-5xl font-bold text-prestige-white">
                        €{plan.price.toLocaleString('de-DE')}
                      </span>
                    </div>
                    <CardDescription className="text-prestige-gray-400 mt-4">
                      {plan.descriptionDE}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.featuresDE.map((feature, i) => (
                        <li key={i} className="flex items-start text-prestige-gray-300">
                          <Check className="h-5 w-5 text-prestige-gold-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="space-y-3">
                      <Button asChild className={`w-full ${isInfinity || isPopular ? 'btn-gold' : 'btn-prestige'}`}>
                        <Link href={`/checkout?course=dropshipping&plan=${plan.name}`}>
                          Jetzt kaufen <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full border-prestige-gray-600 text-prestige-gray-300 hover:text-prestige-white hover:border-prestige-gold-500">
                        <Link href="/intake">
                          <Calendar className="mr-2 h-4 w-4" /> Erstgespräch vereinbaren
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="px-6 py-20 bg-prestige-black">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-prestige-white mb-4">
              Detaillierter Vergleich
            </h2>
            <div className="accent-line-gold mx-auto"></div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-prestige-gold-500/20">
                  <th className="text-left py-4 px-4 text-prestige-white font-semibold">Features</th>
                  <th className="text-center py-4 px-4 text-prestige-gold-500 font-semibold">Fast</th>
                  <th className="text-center py-4 px-4 text-prestige-gold-500 font-semibold">Business</th>
                  <th className="text-center py-4 px-4 text-prestige-gold-500 font-semibold">Infinity</th>
                </tr>
              </thead>
              <tbody className="text-prestige-gray-300">
                {[
                  { feature: 'Alle Video-Inhalte', fast: true, business: true, infinity: true },
                  { feature: 'Kursmaterialien & Templates', fast: true, business: true, infinity: true },
                  { feature: 'Community-Zugang', fast: true, business: true, infinity: true },
                  { feature: 'Lebenslanger Zugang', fast: true, business: true, infinity: true },
                  { feature: '1:1 Mentoring Sessions', fast: false, business: true, infinity: true },
                  { feature: 'Direkte Mentor-Unterstützung', fast: false, business: true, infinity: true },
                  { feature: 'Wöchentliche Check-ins', fast: false, business: true, infinity: true },
                  { feature: 'Priority Support', fast: false, business: false, infinity: true },
                  { feature: 'Unbegrenzte Q&A', fast: false, business: false, infinity: true },
                  { feature: 'Custom Solutions', fast: false, business: false, infinity: true },
                  { feature: 'Winning Product Research (DS)', fast: false, business: false, infinity: true },
                  { feature: 'Custom Website (DS)', fast: false, business: false, infinity: true },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-prestige-gold-500/10">
                    <td className="py-4 px-4">{row.feature}</td>
                    <td className="py-4 px-4 text-center">
                      {row.fast ? (
                        <Check className="h-5 w-5 text-prestige-gold-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-prestige-gray-600 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.business ? (
                        <Check className="h-5 w-5 text-prestige-gold-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-prestige-gray-600 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.infinity ? (
                        <Check className="h-5 w-5 text-prestige-gold-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-prestige-gray-600 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-20 section-prestige">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-prestige-white mb-4">
              Häufige Fragen
            </h2>
            <div className="accent-line-gold mx-auto"></div>
          </div>
          
          <div className="space-y-6">
            {[
              {
                q: 'Kann ich den Plan später upgraden?',
                a: 'Ja, Sie können jederzeit von Fast zu Business oder Infinity upgraden. Die Differenz wird verrechnet.'
              },
              {
                q: 'Wie lange habe ich Zugang zu den Inhalten?',
                a: 'Alle Pläne beinhalten lebenslangen Zugang zu den Kursinhalten und allen zukünftigen Updates.'
              },
              {
                q: 'Was ist im 1:1 Mentoring enthalten?',
                a: 'Wöchentliche Sessions mit Ihrem Mentor, direkter Support via WhatsApp/Discord, und persönliche Feedback zu Ihren Projekten.'
              },
              {
                q: 'Gibt es eine Geld-zurück-Garantie?',
                a: '14 Tage Geld-zurück-Garantie ohne Angabe von Gründen. Ihre Zufriedenheit ist uns wichtig.'
              },
              {
                q: 'Kann ich in Raten zahlen?',
                a: 'Ja, wir bieten flexible Ratenzahlung für alle Pläne an. Details besprechen wir im Erstgespräch.'
              }
            ].map((faq, i) => (
              <Card key={i} className="card-prestige">
                <CardHeader>
                  <CardTitle className="text-prestige-white text-lg">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-prestige-gray-300">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 bg-prestige-black">
        <div className="container mx-auto max-w-4xl text-center">
          <Crown className="w-16 h-16 text-prestige-gold-500 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-display font-bold text-prestige-white mb-6">
            Noch Fragen?
          </h2>
          <div className="accent-line-gold mx-auto mb-6"></div>
          <p className="text-xl text-prestige-gray-300 mb-8 max-w-2xl mx-auto">
            Buchen Sie ein kostenloses Erstgespräch und finden Sie heraus, welcher Plan am besten zu Ihnen passt.
          </p>
          <Button asChild size="lg" className="btn-gold text-lg px-10 py-7">
            <Link href="/contact">
              Erstgespräch buchen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
