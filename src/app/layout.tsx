import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth/auth-provider'
import { CrispChat } from '@/components/crisp-chat'
import { CookieConsent } from '@/components/cookie-consent'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ConditionalLayout } from '@/components/layout/conditional-layout'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'University Ecom - Premium AI & Dropshipping Ausbildung',
    template: '%s | University Ecom'
  },
  description: 'Exklusive Ausbildung in AI-Automation und EU-Dropshipping für ambitionierte Unternehmer. Premium Coaching mit garantierten Ergebnissen.',
  keywords: ['AI Kurs', 'Dropshipping Kurs', 'E-Commerce', 'Unternehmer', 'Europa', 'Online Business', 'Premium Coaching'],
  authors: [{ name: 'University Ecom' }],
  creator: 'University Ecom',
  publisher: 'University Ecom',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://university-ecom.com'),
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    alternateLocale: ['en_US'],
    url: 'https://university-ecom.com',
    siteName: 'University Ecom',
    title: 'University Ecom - Premium AI & Dropshipping Ausbildung',
    description: 'Exklusive Ausbildung in AI-Automation und EU-Dropshipping für ambitionierte Unternehmer.',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'University Ecom - Premium AI & Dropshipping Ausbildung',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'University Ecom - Premium AI & Dropshipping Ausbildung',
    description: 'Exklusive Ausbildung für ambitionierte Unternehmer.',
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
            <CrispChat />
            <CookieConsent />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
