import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                UE
              </div>
              <span className="font-bold text-lg">University Ecom</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Professionelle AI & Dropshipping Kurse für Unternehmer in Europa. 
              Praktisches Wissen ohne Hype.
            </p>
            <div className="flex space-x-4">
              <Link 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Kurse */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Kurse</h3>
            <div className="space-y-2">
              <Link 
                href="/courses/ai" 
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                AI Kurs
              </Link>
              <Link 
                href="/courses/dropshipping" 
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Dropshipping Kurs
              </Link>
              <Link 
                href="/pricing/ai" 
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                AI Preise
              </Link>
              <Link 
                href="/pricing/dropshipping" 
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Dropshipping Preise
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Support</h3>
            <div className="space-y-2">
              <Link 
                href="/about" 
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Über uns
              </Link>
              <Link 
                href="/support" 
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Kundenservice
              </Link>
              <Link 
                href="/community" 
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Community
              </Link>
              <Link 
                href="/reviews" 
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Bewertungen
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Kontakt</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>support@university-ecom.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+49 (0) 30 12345678</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>Berlin, Deutschland</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2025 University Ecom. Alle Rechte vorbehalten.
          </div>
          <div className="flex flex-wrap justify-center md:justify-end space-x-6">
            <Link 
              href="/legal/privacy" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Datenschutz
            </Link>
            <Link 
              href="/legal/terms" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              AGB
            </Link>
            <Link 
              href="/legal/impressum" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Impressum
            </Link>
            <Link 
              href="/legal/cookies" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Cookie-Einstellungen
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
