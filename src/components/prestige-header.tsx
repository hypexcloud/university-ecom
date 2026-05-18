'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Crown, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navigation = [
  { name: 'Features', href: '/#features' },
  { name: 'Kurse', href: '/courses' },
  { name: 'Pläne', href: '/pricing' },
  { name: 'Affiliate', href: '/affiliate' },
  { name: 'Creator Programm', href: '/creator' },
  { name: 'Über uns', href: '/about' },
  { name: 'Interviews', href: '/reviews' },
]

export function PrestigeHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-prestige-gold-500/20 bg-prestige-black/95 backdrop-blur supports-[backdrop-filter]:bg-prestige-black/80">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 hover-glow">
          <div className="w-10 h-10 bg-prestige-gold-500/10 rounded-full flex items-center justify-center border border-prestige-gold-500/30">
            <Crown className="h-6 w-6 text-prestige-gold-500" />
          </div>
          <span className="text-xl font-display font-bold">
            <span className="text-prestige-white">University</span>{' '}
            <span className="text-prestige-gold-500">Ecom</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-8 items-center">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors underline-gold ${
                pathname === item.href
                  ? 'text-prestige-gold-500'
                  : 'text-prestige-gray-300 hover:text-prestige-gold-500'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden lg:flex lg:gap-x-4 items-center">
          <Link href="/contact" className="text-sm text-prestige-gray-400 hover:text-prestige-white transition-colors">Kontakt</Link>
          <Button asChild variant="outline" className="btn-prestige" size="sm">
            <Link href="/intake">Erstgespräch</Link>
          </Button>
          <Button asChild className="btn-gold" size="sm">
            <Link href="/login">Login</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden text-prestige-gold-500 hover:text-prestige-gold-400"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-prestige-gold-500/20 bg-prestige-black">
          <div className="space-y-1 px-6 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-4 py-3 text-base font-medium rounded-md transition-colors ${
                  pathname === item.href
                    ? 'bg-prestige-gold-500/10 text-prestige-gold-500'
                    : 'text-prestige-gray-300 hover:bg-prestige-gold-500/5 hover:text-prestige-gold-500'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block text-center text-sm text-prestige-gray-400 hover:text-prestige-white py-2">
                Kontakt
              </Link>
              <Button asChild variant="outline" className="w-full btn-prestige">
                <Link href="/intake" onClick={() => setMobileMenuOpen(false)}>
                  Erstgespräch
                </Link>
              </Button>
              <Button asChild className="w-full btn-gold">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
