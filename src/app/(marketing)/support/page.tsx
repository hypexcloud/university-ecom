import { Crown, ChevronDown } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'FAQ — University Ecom',
  description: 'Häufig gestellte Fragen zu unseren Kursen, Zahlungen, und dem Affiliate Programm.',
}

const faqs = [
  { q: 'Was beinhaltet der Fast Plan?', a: 'Der Fast Plan beinhaltet lebenslangen Zugang zu allen Kursinhalten, die WhatsApp-Gruppe, Discord-Zugang und Selbststudium. Keine 1:1 Sessions.' },
  { q: 'Was ist der Unterschied zwischen Business und Infinity?', a: 'Business enthält 3 persönliche 1:1 Sessions mit einem Mentor. Infinity bietet unbegrenzte Sessions, VIP-Support und Lifetime-Updates.' },
  { q: 'Kann ich meinen Plan upgraden?', a: 'Ja, Upgrades sind jederzeit möglich (Fast → Business → Infinity). Du zahlst nur die Preisdifferenz.' },
  { q: 'Welche Zahlungsmethoden werden akzeptiert?', a: 'Wir akzeptieren Stripe (Kreditkarte, SEPA), PayPal und Kryptowährungen (BTC, ETH, USDT).' },
  { q: 'Gibt es eine Geld-zurück-Garantie?', a: 'Da es sich um digitale Inhalte handelt, erlischt das Widerrufsrecht mit Beginn der Nutzung. Du stimmst dem beim Checkout ausdrücklich zu.' },
  { q: 'Wie funktioniert das Affiliate Programm?', a: 'Du erhältst 15% Provision auf jeden Verkauf über deinen Empfehlungslink. Cookie-Laufzeit: 30 Tage. Auszahlung am 1. jedes Monats.' },
  { q: 'Was ist das Creator Programm?', a: 'Persönliches 1:1 Coaching für TikTok (€75) und YouTube (€100) Creator. Inkl. Briefing, 2 Calls und individuelle Strategie.' },
  { q: 'Wie erhalte ich Zugang nach dem Kauf?', a: 'Sofort nach Zahlungsbestätigung erhältst du Zugang zum Dashboard. Alle Kursinhalte sind direkt verfügbar.' },
  { q: 'Kann ich den Kurs auch mobil nutzen?', a: 'Ja, das Dashboard ist vollständig responsive und funktioniert auf allen Geräten.' },
  { q: 'Wie kontaktiere ich den Support?', a: 'Als Mitglied kannst du über das Dashboard ein Support-Ticket erstellen. Ansonsten erreichst du uns per E-Mail an info@universityecom.de.' },
]

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-prestige-black">
      <section className="px-6 py-20 md:py-28">
        <div className="container mx-auto max-w-3xl text-center">
          <Crown className="w-12 h-12 text-prestige-gold-500 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-display font-bold text-prestige-white mb-6">
            Häufige <span className="text-gradient-gold">Fragen</span>
          </h1>
          <div className="accent-line-gold mx-auto mb-6"></div>
          <p className="text-xl text-prestige-gray-300">
            Hier findest du Antworten auf die wichtigsten Fragen.
          </p>
        </div>
      </section>

      <section className="px-6 py-12 border-t border-prestige-gray-800">
        <div className="container mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group border border-prestige-gray-800 rounded-xl">
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                <span className="font-medium text-prestige-white pr-4">{faq.q}</span>
                <ChevronDown className="h-5 w-5 text-prestige-gold-500 flex-shrink-0 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-5 pb-5">
                <p className="text-prestige-gray-400">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 border-t border-prestige-gray-800">
        <div className="container mx-auto max-w-3xl text-center">
          <p className="text-prestige-gray-400 mb-6">Deine Frage ist nicht dabei?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center justify-center px-6 py-3 border border-prestige-gray-600 text-prestige-gray-300 rounded-lg hover:border-prestige-gold-500 hover:text-prestige-white transition-colors">
              Kontakt aufnehmen
            </Link>
            <Link href="/intake" className="inline-flex items-center justify-center px-6 py-3 bg-prestige-gold-500 text-black font-medium rounded-lg hover:bg-prestige-gold-400 transition-colors">
              Erstgespräch buchen
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
