import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Crown, ArrowRight, Video, Users, Calendar, FileText, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Creator Programm — TikTok & YouTube Coaching | University Ecom',
  description: 'Persönliches 1:1 Coaching für TikTok und YouTube Creator. Professionelle Betreuung, Briefing, 2 Calls, und individuelle Strategie.',
}

export default function CreatorProgramPage() {
  return (
    <div className="min-h-screen bg-prestige-black">
      {/* Hero */}
      <section className="px-6 py-20 md:py-28">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center space-x-2 bg-prestige-gold-500/10 border border-prestige-gold-500/30 rounded-full px-4 py-2 mb-6">
            <Crown className="h-4 w-4 text-prestige-gold-500" />
            <span className="text-prestige-gold-500 text-sm font-semibold">Creator Programm</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-display font-bold text-prestige-white mb-6">
            Werde zum erfolgreichen <span className="text-gradient-gold">Creator</span>
          </h1>

          <p className="text-xl text-prestige-gray-300 max-w-3xl mx-auto mb-10">
            Persönliches 1:1 Coaching für TikTok und YouTube. Professionelle Betreuung, individuelles Briefing, und eine maßgeschneiderte Strategie für deinen Kanal.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-pink-600 hover:bg-pink-500 text-white text-lg px-8 py-6">
              <Link href="/checkout?course=tiktok-creator&plan=tiktok">
                TikTok Programm — €75 <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-500 text-white text-lg px-8 py-6">
              <Link href="/checkout?course=youtube-creator&plan=youtube">
                YouTube Programm — €100 <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="px-6 py-20 border-t border-prestige-gray-800">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-display font-bold text-prestige-white text-center mb-12">
            Was ist im Creator Programm enthalten?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FileText, title: 'Persönliches Briefing', desc: 'Du füllst ein detailliertes Briefing aus: Nische, Follower, Ziele, Probleme. Damit können wir uns optimal vorbereiten.' },
              { icon: Calendar, title: '2 persönliche Calls', desc: 'Call 1: Erster Freitag nach Kauf. Call 2: +1 Monat. Beide via Zoom mit deinem persönlichen Coach.' },
              { icon: TrendingUp, title: 'Individuelle Strategie', desc: 'Basierend auf deinem Briefing entwickeln wir eine maßgeschneiderte Wachstumsstrategie.' },
              { icon: Video, title: 'Content-Analyse', desc: 'Wir analysieren deine bisherigen Inhalte und geben konkretes Feedback für Verbesserungen.' },
              { icon: Users, title: 'Community-Zugang', desc: 'Zugang zur Creator-Community in Discord und WhatsApp mit anderen Teilnehmern.' },
              { icon: Crown, title: 'Fortschritt-Tracking', desc: 'Verfolge deine Entwicklung mit wöchentlichen Fortschrittsberichten und Meilenstein-Tracking.' },
            ].map((item) => (
              <Card key={item.title} className="bg-prestige-gray-900/50 border-prestige-gray-800">
                <CardContent className="pt-6">
                  <item.icon className="h-8 w-8 text-prestige-gold-500 mb-4" />
                  <h3 className="text-lg font-bold text-prestige-white mb-2">{item.title}</h3>
                  <p className="text-sm text-prestige-gray-400">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Two programs */}
      <section className="px-6 py-20 border-t border-prestige-gray-800">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-display font-bold text-prestige-white text-center mb-12">
            Wähle dein Programm
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* TikTok */}
            <Card className="bg-prestige-gray-900/50 border-2 border-pink-500/50">
              <CardHeader className="text-center pt-8">
                <div className="w-16 h-16 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="h-8 w-8 text-pink-500" />
                </div>
                <CardTitle className="text-2xl text-prestige-white">TikTok Creator</CardTitle>
                <div className="text-4xl font-bold text-prestige-white mt-4">
                  €75 <span className="text-base font-normal text-prestige-gray-400">einmalig</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {['Persönliches Briefing', '2 x 1:1 Coaching-Calls', 'TikTok-spezifische Strategie', 'Content-Analyse & Feedback', 'Community-Zugang', 'Fortschritt-Tracking'].map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-pink-500 flex-shrink-0" />
                      <span className="text-prestige-gray-300 text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full bg-pink-600 hover:bg-pink-500 text-white py-6 text-lg">
                  <Link href="/checkout?course=tiktok-creator&plan=tiktok">
                    TikTok Programm starten <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* YouTube */}
            <Card className="bg-prestige-gray-900/50 border-2 border-red-500/50">
              <CardHeader className="text-center pt-8">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="h-8 w-8 text-red-500" />
                </div>
                <CardTitle className="text-2xl text-prestige-white">YouTube Creator</CardTitle>
                <div className="text-4xl font-bold text-prestige-white mt-4">
                  €100 <span className="text-base font-normal text-prestige-gray-400">einmalig</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {['Persönliches Briefing', '2 x 1:1 Coaching-Calls', 'YouTube-spezifische Strategie', 'Kanal-Analyse & SEO-Tipps', 'Community-Zugang', 'Fortschritt-Tracking'].map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <span className="text-prestige-gray-300 text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full bg-red-600 hover:bg-red-500 text-white py-6 text-lg">
                  <Link href="/checkout?course=youtube-creator&plan=youtube">
                    YouTube Programm starten <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 border-t border-prestige-gray-800">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-display font-bold text-prestige-white text-center mb-12">
            So läuft das Programm ab
          </h2>

          <div className="space-y-8">
            {[
              { step: '1', title: 'Programm kaufen', desc: 'Wähle TikTok oder YouTube und schließe die Zahlung ab.' },
              { step: '2', title: 'Briefing ausfüllen', desc: 'Du erhältst Zugang zum Briefing-Formular: Social Link, Nische, Follower, Ziele, Probleme, Erfahrungen.' },
              { step: '3', title: 'Call 1 — Strategie', desc: 'Am ersten Freitag nach Kauf. Wir besprechen dein Briefing und entwickeln deine individuelle Strategie.' },
              { step: '4', title: 'Umsetzung', desc: 'Du setzt die Strategie um. Wir sind über Discord und WhatsApp erreichbar für Fragen.' },
              { step: '5', title: 'Call 2 — Review', desc: 'Einen Monat später. Wir analysieren deine Fortschritte und passen die Strategie an.' },
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
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 border-t border-prestige-gray-800">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-display font-bold text-prestige-white mb-6">
            Bereit für dein Wachstum?
          </h2>
          <p className="text-prestige-gray-400 mb-8">
            Starte jetzt mit professionellem Creator-Coaching und bringe deinen Kanal auf das nächste Level.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-pink-600 hover:bg-pink-500 text-white">
              <Link href="/checkout?course=tiktok-creator&plan=tiktok">TikTok — €75</Link>
            </Button>
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-500 text-white">
              <Link href="/checkout?course=youtube-creator&plan=youtube">YouTube — €100</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
