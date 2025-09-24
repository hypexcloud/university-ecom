import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ConditionalLayout } from '@/components/layout/conditional-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'University Ecom - AI & Dropshipping Kurse',
    template: '%s | University Ecom'
  },
  description: 'Professionelle AI & Dropshipping Kurse für Unternehmer in Europa. Praktisches Wissen ohne Hype.',
  keywords: ['AI Kurs', 'Dropshipping Kurs', 'E-Commerce', 'Unternehmer', 'Europa', 'Online Business'],
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
    title: 'University Ecom - AI & Dropshipping Kurse',
    description: 'Professionelle AI & Dropshipping Kurse für Unternehmer in Europa. Praktisches Wissen ohne Hype.',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'University Ecom - AI & Dropshipping Kurse',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'University Ecom - AI & Dropshipping Kurse',
    description: 'Professionelle AI & Dropshipping Kurse für Unternehmer in Europa.',
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
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}