import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Crown, Mail, Phone, Clock, MapPin, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Kontakt — University Ecom',
  description: 'Kontaktieren Sie uns per E-Mail, Telefon oder über unser Kontaktformular.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-prestige-black">
      {/* Hero */}
      <section className="px-6 py-20 md:py-28">
        <div className="container mx-auto max-w-4xl text-center">
          <Crown className="w-12 h-12 text-prestige-gold-500 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-display font-bold text-prestige-white mb-6">
            <span className="text-gradient-gold">Kontakt</span>
          </h1>
          <div className="accent-line-gold mx-auto mb-6"></div>
          <p className="text-xl text-prestige-gray-300 max-w-2xl mx-auto">
            Hast du Fragen? Wir sind für dich da. Kontaktiere uns per E-Mail, Telefon oder über Discord.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="px-6 py-20 border-t border-prestige-gray-800">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-prestige-gray-900/50 border-prestige-gray-800 text-center">
              <CardContent className="pt-8 pb-6">
                <Mail className="h-10 w-10 text-prestige-gold-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-prestige-white mb-2">E-Mail</h3>
                <a href="mailto:info@universityecom.de" className="text-prestige-gold-500 hover:underline">
                  info@universityecom.de
                </a>
                <p className="text-prestige-gray-500 text-sm mt-2">Antwort innerhalb von 24h</p>
              </CardContent>
            </Card>

            <Card className="bg-prestige-gray-900/50 border-prestige-gray-800 text-center">
              <CardContent className="pt-8 pb-6">
                <Phone className="h-10 w-10 text-prestige-gold-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-prestige-white mb-2">Telefon</h3>
                <a href="tel:+4917012345678" className="text-prestige-gold-500 hover:underline">
                  +49 170 123 456 78
                </a>
                <p className="text-prestige-gray-500 text-sm mt-2">Mo–Fr 9:00–18:00 Uhr</p>
              </CardContent>
            </Card>

            <Card className="bg-prestige-gray-900/50 border-prestige-gray-800 text-center">
              <CardContent className="pt-8 pb-6">
                <MessageSquare className="h-10 w-10 text-prestige-gold-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-prestige-white mb-2">Discord</h3>
                <p className="text-prestige-gray-300">Community & Support</p>
                <p className="text-prestige-gray-500 text-sm mt-2">Schnellste Antworten</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="px-6 py-20 border-t border-prestige-gray-800">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-display font-bold text-prestige-white text-center mb-12">
            Häufige Anlaufstellen
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/intake" className="block border border-prestige-gray-800 rounded-xl p-6 hover:border-prestige-gold-500/50 transition-colors">
              <h3 className="text-lg font-bold text-prestige-white mb-2">Erstgespräch buchen</h3>
              <p className="text-prestige-gray-400 text-sm">Kostenlose Beratung zu unseren Kursen und Programmen.</p>
            </Link>

            <Link href="/support" className="block border border-prestige-gray-800 rounded-xl p-6 hover:border-prestige-gold-500/50 transition-colors">
              <h3 className="text-lg font-bold text-prestige-white mb-2">FAQ</h3>
              <p className="text-prestige-gray-400 text-sm">Antworten auf häufig gestellte Fragen.</p>
            </Link>

            <Link href="/affiliate" className="block border border-prestige-gray-800 rounded-xl p-6 hover:border-prestige-gold-500/50 transition-colors">
              <h3 className="text-lg font-bold text-prestige-white mb-2">Affiliate Programm</h3>
              <p className="text-prestige-gray-400 text-sm">Verdiene Provisionen als Empfehlungspartner.</p>
            </Link>

            <Link href="/legal/impressum" className="block border border-prestige-gray-800 rounded-xl p-6 hover:border-prestige-gold-500/50 transition-colors">
              <h3 className="text-lg font-bold text-prestige-white mb-2">Impressum</h3>
              <p className="text-prestige-gray-400 text-sm">Rechtliche Informationen und Firmendaten.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Address */}
      <section className="px-6 py-20 border-t border-prestige-gray-800">
        <div className="container mx-auto max-w-3xl text-center">
          <MapPin className="h-8 w-8 text-prestige-gold-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-prestige-white mb-2">University Ecom KG</h3>
          <p className="text-prestige-gray-400">
            Adresse wird im Impressum ergänzt<br />
            Deutschland
          </p>
        </div>
      </section>
    </div>
  )
}
