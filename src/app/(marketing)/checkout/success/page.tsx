'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, Download, Calendar, MessageCircle, ArrowRight, Loader2, AlertCircle, Mail, Lock, Copy, Check } from 'lucide-react'
import { formatPrice } from '@/lib/stripe'

interface OrderInfo {
  orderId: string
  orderNumber: string
  courseName: string
  planName: string
  total: number
  currency: string
  isNewUser: boolean
  tempPassword?: string
  customerEmail: string
  customerName: string
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="checkout-dark min-h-screen bg-prestige-black flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-prestige-gold-500 mx-auto mb-4" />
            <p className="text-prestige-gray-400">Bestelldetails werden geladen...</p>
          </div>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  )
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Read credentials stored during checkout (before payment)
    let credentials: { isNewUser?: boolean; tempPassword?: string; email?: string } = {}
    const storedCredentials = sessionStorage.getItem('checkoutCredentials')
    if (storedCredentials) {
      try {
        credentials = JSON.parse(storedCredentials)
        sessionStorage.removeItem('checkoutCredentials')
      } catch {
        // ignore
      }
    }

    if (orderId) {
      fetchOrderDetails(orderId, credentials)
    } else {
      // No orderId — payment succeeded, webhook is processing the order
      setOrderInfo({
        orderId: '',
        orderNumber: '',
        courseName: '',
        planName: '',
        total: 0,
        currency: 'EUR',
        isNewUser: credentials.isNewUser ?? false,
        tempPassword: credentials.tempPassword,
        customerEmail: credentials.email ?? '',
        customerName: '',
      })
      setLoading(false)
    }
  }, [orderId])

  const fetchOrderDetails = async (id: string, credentials: { isNewUser?: boolean; tempPassword?: string; email?: string } = {}) => {
    try {
      const res = await fetch(`/api/orders/${id}`)
      if (!res.ok) throw new Error('Bestellung nicht gefunden')
      const data = await res.json()
      const item = data.items?.[0]
      setOrderInfo({
        orderId: data.order.id,
        orderNumber: data.invoice?.number || `UE-${data.order.id.slice(0, 8)}`,
        courseName: item?.productTitle || 'Kurs',
        planName: item?.planCode || 'Plan',
        total: data.order.totalCents / 100,
        currency: data.order.currency || 'EUR',
        isNewUser: credentials.isNewUser ?? false,
        tempPassword: credentials.tempPassword,
        customerEmail: credentials.email ?? '',
        customerName: '',
      })
      setLoading(false)
    } catch {
      setError('Fehler beim Laden der Bestelldetails')
      setLoading(false)
    }
  }

  const copyPassword = () => {
    if (orderInfo?.tempPassword) {
      navigator.clipboard.writeText(orderInfo.tempPassword)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="checkout-dark min-h-screen bg-prestige-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-prestige-gold-500 mx-auto mb-4" />
          <p className="text-prestige-gray-400">Bestelldetails werden geladen...</p>
        </div>
      </div>
    )
  }

  if (error || !orderInfo) {
    return (
      <div className="checkout-dark min-h-screen bg-prestige-black py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || 'Bestellinformationen nicht gefunden'}</AlertDescription>
          </Alert>
          <Button asChild className="btn-gold">
            <Link href="/">Zur Startseite</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-dark min-h-screen bg-prestige-black py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-prestige-gold-500/20 border-2 border-prestige-gold-500 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-prestige-gold-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Zahlung erfolgreich!
          </h1>
          <p className="text-xl text-prestige-gray-400">
            Vielen Dank für Ihre Bestellung{orderInfo.customerName ? `, ${orderInfo.customerName.split(' ')[0]}` : ''}!
          </p>
        </div>

        {/* New User Credentials */}
        {orderInfo.isNewUser && orderInfo.tempPassword && (
          <div className="mb-6 p-5 rounded-lg border-2 border-prestige-gold-500 bg-prestige-gold-500/10">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-prestige-gold-500 mt-0.5" />
              <div className="space-y-3 flex-1">
                <p className="font-semibold text-prestige-gold-500">Ihr Account wurde erstellt!</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-prestige-gray-400 mb-1">E-Mail:</p>
                    <div className="flex items-center gap-2 p-2 bg-prestige-black/50 rounded border border-prestige-gray-700">
                      <Mail className="h-4 w-4 text-prestige-gold-500" />
                      <code className="text-sm font-mono text-white">{orderInfo.customerEmail}</code>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-prestige-gray-400 mb-1">Temporäres Passwort:</p>
                    <div className="flex items-center gap-2 p-2 bg-prestige-black/50 rounded border border-prestige-gray-700">
                      <Lock className="h-4 w-4 text-prestige-gold-500" />
                      <code className="text-sm font-mono text-white flex-1">{orderInfo.tempPassword}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={copyPassword}
                        className="h-8 text-prestige-gray-400 hover:text-prestige-gold-500"
                      >
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-prestige-gray-400">
                  Bitte ändern Sie Ihr Passwort nach dem ersten Login in den Einstellungen.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Order Details */}
        <Card className="mb-6 bg-prestige-gray-900/50 border-prestige-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Bestelldetails</CardTitle>
            <CardDescription className="text-prestige-gray-400">Ihre Bestellung wurde erfolgreich verarbeitet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderInfo.orderNumber && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-prestige-gray-500 mb-1">Bestellnummer</p>
                    <p className="font-semibold text-white">{orderInfo.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-prestige-gray-500 mb-1">Datum</p>
                    <p className="font-semibold text-white">{new Date().toLocaleDateString('de-DE')}</p>
                  </div>
                </div>
              )}

              {orderInfo.courseName && (
                <div className="border-t border-prestige-gray-800 pt-4">
                  <p className="text-sm text-prestige-gray-500 mb-2">Bestellte Kurse</p>
                  <div className="bg-prestige-black/50 rounded-lg p-4 border border-prestige-gray-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">{orderInfo.courseName}</p>
                        <p className="text-sm text-prestige-gray-400">{orderInfo.planName}</p>
                      </div>
                      {orderInfo.total > 0 && (
                        <p className="font-bold text-prestige-gold-500">{formatPrice(orderInfo.total)}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-prestige-gray-800 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-prestige-gray-400">Status</span>
                  <span className="inline-flex items-center gap-2 text-green-500 font-semibold">
                    <CheckCircle className="h-4 w-4" />
                    Bezahlt & Bestätigt
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-prestige-gray-400">Kurszugang</span>
                  <span className="inline-flex items-center gap-2 text-green-500 font-semibold">
                    <CheckCircle className="h-4 w-4" />
                    Aktiviert
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-prestige-gray-800">
              <Button variant="outline" className="w-full border-prestige-gray-700 text-prestige-gray-300 hover:bg-prestige-gray-800 hover:text-white">
                <Download className="h-4 w-4 mr-2" />
                Rechnung herunterladen (PDF)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6 bg-prestige-gray-900/50 border-prestige-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Nächste Schritte</CardTitle>
            <CardDescription className="text-prestige-gray-400">So geht es weiter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-lg border border-prestige-gold-500/30 bg-prestige-gold-500/5">
              <div className="flex-shrink-0 w-8 h-8 bg-prestige-gold-500 text-prestige-black rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">
                  {orderInfo.isNewUser ? 'In Ihr Dashboard einloggen' : 'Bestätigungs-E-Mail prüfen'}
                </h3>
                <p className="text-sm text-prestige-gray-400 mb-3">
                  {orderInfo.isNewUser
                    ? 'Nutzen Sie die oben angezeigten Zugangsdaten, um sich anzumelden.'
                    : 'Sie erhalten in Kürze eine E-Mail mit der Bestellbestätigung und Rechnung.'
                  }
                </p>
                {orderInfo.isNewUser && (
                  <Button size="sm" asChild className="btn-gold">
                    <Link href="/login">
                      <Lock className="h-4 w-4 mr-2" />
                      Jetzt anmelden
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg border border-prestige-gold-500/30 bg-prestige-gold-500/5">
              <div className="flex-shrink-0 w-8 h-8 bg-prestige-gold-500 text-prestige-black rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">Erstgespräch buchen</h3>
                <p className="text-sm text-prestige-gray-400 mb-3">
                  Buche jetzt dein Strategie-Gespräch, damit wir sofort starten können.
                </p>
                <Button size="sm" asChild className="btn-gold">
                  <Link href="/student/termine/buchen">
                    <Calendar className="h-4 w-4 mr-2" />
                    Jetzt Termin buchen
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg border border-prestige-gray-800 bg-prestige-gray-900/50">
              <div className="flex-shrink-0 w-8 h-8 bg-prestige-gold-500 text-prestige-black rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Community beitreten</h3>
                <p className="text-sm text-prestige-gray-400">
                  Treten Sie unseren WhatsApp- und Discord-Gruppen bei. Die Einladungslinks finden Sie in Ihrer Willkommens-E-Mail.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg border border-prestige-gray-800 bg-prestige-gray-900/50">
              <div className="flex-shrink-0 w-8 h-8 bg-prestige-gold-500 text-prestige-black rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Mit dem Kurs beginnen</h3>
                <p className="text-sm text-prestige-gray-400">
                  Melden Sie sich in Ihrem Dashboard an und starten Sie mit dem ersten Modul Ihres Kurses.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button asChild className="flex-1 btn-gold" size="lg">
            <Link href="/student">
              <ArrowRight className="h-4 w-4 mr-2" />
              Zum Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 border-prestige-gray-700 text-prestige-gray-300 hover:bg-prestige-gray-800 hover:text-white" size="lg">
            <Link href="/">
              Zur Startseite
            </Link>
          </Button>
        </div>

        {/* Support */}
        <Card className="bg-prestige-gray-900/50 border-prestige-gray-800">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-prestige-gold-500" />
              Brauchen Sie Hilfe?
            </h3>
            <p className="text-sm text-prestige-gray-400 mb-4">
              Unser Support-Team steht Ihnen bei Fragen gerne zur Verfügung.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="sm" variant="outline" className="border-prestige-gray-700 text-prestige-gray-300 hover:bg-prestige-gray-800 hover:text-white">
                <MessageCircle className="h-4 w-4 mr-2" />
                Support kontaktieren
              </Button>
              <Button size="sm" variant="outline" asChild className="border-prestige-gray-700 text-prestige-gray-300 hover:bg-prestige-gray-800 hover:text-white">
                <Link href="/student/support">FAQ anzeigen</Link>
              </Button>
              <Button size="sm" variant="outline" asChild className="border-prestige-gray-700 text-prestige-gray-300 hover:bg-prestige-gray-800 hover:text-white">
                <Link href="mailto:info@universityecom.de">
                  <Mail className="h-4 w-4 mr-2" />
                  E-Mail senden
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
