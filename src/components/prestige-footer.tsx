import Link from 'next/link'
import { Crown, Mail, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react'

const footerNavigation = {
  kurse: [
    { name: 'AI Kurs', href: '/courses/ai' },
    { name: 'Dropshipping Kurs', href: '/courses/dropshipping' },
    { name: 'Creator Programm', href: '/creator' },
    { name: 'Alle Pläne', href: '/pricing' },
  ],
  unternehmen: [
    { name: 'Über uns', href: '/about' },
    { name: 'Interviews', href: '/reviews' },
    { name: 'Affiliate werden', href: '/affiliate' },
    { name: 'Kontakt', href: '/contact' },
  ],
  rechtliches: [
    { name: 'Impressum', href: '/legal/impressum' },
    { name: 'Datenschutz', href: '/legal/datenschutz' },
    { name: 'AGB', href: '/legal/agb' },
    { name: 'Widerrufsrecht', href: '/legal/widerruf' },
  ],
  social: [
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
    { name: 'YouTube', href: '#', icon: Youtube },
  ],
}

export function PrestigeFooter() {
  return (
    <footer className="bg-prestige-black border-t border-prestige-gold-500/20">
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-prestige-gold-500/10 rounded-full flex items-center justify-center border border-prestige-gold-500/30">
                <Crown className="h-7 w-7 text-prestige-gold-500" />
              </div>
              <span className="text-2xl font-display font-bold">
                <span className="text-prestige-white">University</span>{' '}
                <span className="text-prestige-gold-500">Ecom</span>
              </span>
            </Link>
            <p className="text-prestige-gray-400 mb-6 max-w-md">
              Exklusive Ausbildung in AI-Automation und EU-Dropshipping für ambitionierte Unternehmer.
            </p>
            <div className="flex space-x-4">
              {footerNavigation.social.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="w-10 h-10 bg-prestige-gold-500/10 rounded-full flex items-center justify-center border border-prestige-gold-500/20 hover:bg-prestige-gold-500/20 hover:border-prestige-gold-500/40 transition-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="h-5 w-5 text-prestige-gold-500" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Kurse */}
          <div>
            <h3 className="text-prestige-gold-500 font-semibold text-sm uppercase tracking-wider mb-4">
              Kurse
            </h3>
            <ul className="space-y-3">
              {footerNavigation.kurse.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-prestige-gray-400 hover:text-prestige-gold-500 transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Unternehmen */}
          <div>
            <h3 className="text-prestige-gold-500 font-semibold text-sm uppercase tracking-wider mb-4">
              Unternehmen
            </h3>
            <ul className="space-y-3">
              {footerNavigation.unternehmen.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-prestige-gray-400 hover:text-prestige-gold-500 transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rechtliches */}
          <div>
            <h3 className="text-prestige-gold-500 font-semibold text-sm uppercase tracking-wider mb-4">
              Rechtliches
            </h3>
            <ul className="space-y-3">
              {footerNavigation.rechtliches.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-prestige-gray-400 hover:text-prestige-gold-500 transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-prestige-gold-500/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-prestige-gray-500 text-sm">
              © {new Date().getFullYear()} University Ecom. Alle Rechte vorbehalten.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="mailto:info@universityecom.de"
                className="text-prestige-gray-400 hover:text-prestige-gold-500 transition-colors text-sm flex items-center"
              >
                <Mail className="h-4 w-4 mr-2" />
                info@universityecom.de
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-prestige-gold-500 to-transparent opacity-50"></div>
    </footer>
  )
}
