import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check, Crown, Users, TrendingUp, Euro, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Affiliate Programm — University Ecom',
  description: 'Verdiene 15% Provision auf jede erfolgreiche Empfehlung. Werde Teil unseres Affiliate-Netzwerks.',
}

export default function AffiliatePage() {
  return (
    <div className="min-h-screen bg-prestige-black">
      {/* Hero */}
      <section className="px-6 py-20 md:py-28">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center space-x-2 bg-prestige-gold-500/10 border border-prestige-gold-500/30 rounded-full px-4 py-2 mb-6">
            <Crown className="h-4 w-4 text-prestige-gold-500" />
            <span className="text-prestige-gold-500 text-sm font-semibold">Affiliate Programm</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-display font-bold text-prestige-white mb-6">
            Verdiene mit jeder <span className="text-gradient-gold">Empfehlung</span>
          </h1>

          <p className="text-xl text-prestige-gray-300 max-w-2xl mx-auto mb-8">
            Empfiehl University Ecom und erhalte 15% Provision auf jeden Verkauf.
            Kein Limit, lebenslange Zuordnung, monatliche Auszahlung.
          </p>

          <Button asChild size="lg" className="bg-prestige-gold-500 text-black hover:bg-prestige-gold-400 text-lg px-8 py-6">
            <Link href="/apply-affiliate">
              Jetzt Affiliate werden <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-6 py-20 border-t border-prestige-gray-800">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-display font-bold text-prestige-white text-center mb-12">
            Warum University Ecom Affiliate?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-prestige-gray-900/50 border-prestige-gray-800 text-center">
              <CardContent className="pt-8 pb-6">
                <Euro className="h-10 w-10 text-prestige-gold-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-prestige-white mb-2">15% Provision</h3>
                <p className="text-prestige-gray-400 text-sm">Auf jeden erfolgreichen Verkauf — bei Kursen bis €3.000 bedeutet das bis zu €450 pro Empfehlung.</p>
              </CardContent>
            </Card>

            <Card className="bg-prestige-gray-900/50 border-prestige-gray-800 text-center">
              <CardContent className="pt-8 pb-6">
                <TrendingUp className="h-10 w-10 text-prestige-gold-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-prestige-white mb-2">30 Tage Cookie</h3>
                <p className="text-prestige-gray-400 text-sm">Dein Empfehlungslink wird 30 Tage lang getrackt. Auch wenn der Kauf nicht sofort stattfindet.</p>
              </CardContent>
            </Card>

            <Card className="bg-prestige-gray-900/50 border-prestige-gray-800 text-center">
              <CardContent className="pt-8 pb-6">
                <Users className="h-10 w-10 text-prestige-gold-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-prestige-white mb-2">Monatliche Auszahlung</h3>
                <p className="text-prestige-gray-400 text-sm">Am 1. jedes Monats. Top 3 Affiliates erhalten zusätzliche Boni.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 border-t border-prestige-gray-800">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-display font-bold text-prestige-white text-center mb-12">
            So funktioniert's
          </h2>

          <div className="space-y-8">
            {[
              { step: '1', title: 'Registrieren', desc: 'Erstelle ein Konto und bewirb dich als Affiliate.' },
              { step: '2', title: 'Teilen', desc: 'Erhalte deinen persönlichen Empfehlungslink und teile ihn mit deinem Netzwerk.' },
              { step: '3', title: 'Verdienen', desc: 'Für jeden Kauf über deinen Link erhältst du 15% Provision.' },
              { step: '4', title: 'Auszahlung', desc: 'Provisionen werden monatlich automatisch ausgezahlt.' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-prestige-gold-500 text-black font-bold text-lg flex items-center justify-center flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-prestige-white">{item.title}</h3>
                  <p className="text-prestige-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-prestige-gold-500 text-black hover:bg-prestige-gold-400">
              <Link href="/apply-affiliate">Jetzt bewerben <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <p className="text-prestige-gray-500 text-sm mt-4">
              Bereits Affiliate? <Link href="/student/affiliate" className="text-prestige-gold-500 hover:underline">Zum Dashboard</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
