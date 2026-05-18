import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Crown, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { AI_COURSE_DATA, DROPSHIPPING_COURSE_DATA } from '@/lib/courses-data'

interface Props { params: Promise<{ course: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course } = await params
  const title = course === 'ai' ? 'AI-Automatisierung Kurs' : 'EU-Dropshipping Kurs'
  return { title: `${title} — Preise`, description: `Pläne und Preise für den ${title}` }
}

export default async function CoursePricingPage({ params }: Props) {
  const { course } = await params
  const isAI = course === 'ai'
  const data = isAI ? AI_COURSE_DATA : DROPSHIPPING_COURSE_DATA
  const plans = data.plans

  const planStyles = [
    { border: 'border-prestige-gray-700', badge: null, cta: 'bg-prestige-gray-800 text-prestige-white hover:bg-prestige-gray-700' },
    { border: 'border-prestige-gold-500', badge: 'Beliebtester Plan', cta: 'bg-prestige-gold-500 text-black hover:bg-prestige-gold-400' },
    { border: 'border-prestige-gold-500/50', badge: 'Premium', cta: 'bg-prestige-gold-500 text-black hover:bg-prestige-gold-400' },
  ]

  return (
    <div className="min-h-screen bg-prestige-black">
      <section className="px-6 py-20 md:py-28">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center space-x-2 bg-prestige-gold-500/10 border border-prestige-gold-500/30 rounded-full px-4 py-2">
              <Crown className="h-4 w-4 text-prestige-gold-500" />
              <span className="text-prestige-gold-500 text-sm font-semibold">{data.nameDE}</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-prestige-white">
              Pläne & <span className="text-gradient-gold">Preise</span>
            </h1>
            <p className="text-xl text-prestige-gray-300 max-w-3xl mx-auto">
              Wähle den Plan, der am besten zu deinen Zielen passt. Alle Pläne beinhalten lebenslangen Zugang.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => {
              const style = planStyles[i] || planStyles[0]
              return (
                <Card key={plan.id} className={`relative bg-prestige-gray-900/50 border-2 ${style.border} text-prestige-white`}>
                  {style.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-prestige-gold-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                      {style.badge}
                    </div>
                  )}
                  <CardHeader className="text-center pb-4 pt-8">
                    <CardTitle className="text-2xl text-prestige-gold-500">{plan.displayNameDE}</CardTitle>
                    <div className="text-4xl font-bold text-prestige-white mt-4">
                      €{plan.price.toLocaleString('de-DE')}
                      <span className="text-base font-normal text-prestige-gray-400"> einmalig</span>
                    </div>
                    {plan.descriptionDE && (
                      <p className="text-sm text-prestige-gray-400 mt-2">{plan.descriptionDE}</p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.featuresDE.map((feature, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-prestige-gold-500 flex-shrink-0 mt-0.5" />
                          <span className="text-prestige-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                      {plan.includes1to1 && (
                        <li className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-prestige-gold-500 flex-shrink-0 mt-0.5" />
                          <span className="text-prestige-gray-300 text-sm font-medium">1:1 Mentoring Sessions</span>
                        </li>
                      )}
                    </ul>

                    <Button asChild className={`w-full text-lg py-6 ${style.cta}`}>
                      <Link href={`/checkout?course=${course}&plan=${plan.name}`}>
                        {plan.displayNameDE} wählen
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <p className="text-prestige-gray-400 text-sm">
              Alle Preise inkl. 19% MwSt. · Lebenslanger Zugang · Sichere Zahlung via Stripe
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
