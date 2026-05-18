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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Bestelldetails werden geladen...</p>
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
    // Try to get order info from sessionStorage first
    const storedInfo = sessionStorage.getItem('orderInfo')
    if (storedInfo) {
      try {
        const parsed = JSON.parse(storedInfo)
        // Mock order info - in production, fetch from API
        setOrderInfo({
          orderId: parsed.orderId,
          orderNumber: `UE-${Date.now().toString().slice(-8)}`,
          courseName: 'AI Automatisierung Kurs',
          planName: 'Business Plan',
          total: 1190, // €1,000 + 19% VAT
          currency: 'EUR',
          isNewUser: parsed.isNewUser,
          tempPassword: parsed.tempPassword,
          customerEmail: 'kunde@example.com',
          customerName: 'Max Mustermann'
        })
        setLoading(false)
        
        // Clear session storage after use
        sessionStorage.removeItem('orderInfo')
      } catch (e) {
        console.error('Error parsing order info:', e)
      }
    } else if (orderId) {
      // Fetch order details from API
      fetchOrderDetails(orderId)
    } else {
      setError('Keine Bestellinformationen gefunden')
      setLoading(false)
    }
  }, [orderId])

  const fetchOrderDetails = async (id: string) => {
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
        isNewUser: false,
        customerEmail: '',
        customerName: '',
      })
      setLoading(false)
    } catch (err) {
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Bestelldetails werden geladen...</p>
        </div>
      </div>
    )
  }

  if (error || !orderInfo) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || 'Bestellinformationen nicht gefunden'}</AlertDescription>
          </Alert>
          <Button asChild>
            <Link href="/">Zur Startseite</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Zahlung erfolgreich!
          </h1>
          <p className="text-xl text-gray-600">
            Vielen Dank für Ihre Bestellung, {orderInfo.customerName.split(' ')[0]}!
          </p>
        </div>

        {/* New User Credentials */}
        {orderInfo.isNewUser && orderInfo.tempPassword && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Lock className="h-4 w-4 text-blue-600" />
            <AlertDescription>
              <div className="space-y-3">
                <p className="font-semibold text-blue-900">Ihr Account wurde erstellt!</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-blue-800 mb-1">E-Mail:</p>
                    <div className="flex items-center gap-2 p-2 bg-white rounded border border-blue-200">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <code className="text-sm font-mono">{orderInfo.customerEmail}</code>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-blue-800 mb-1">Temporäres Passwort:</p>
                    <div className="flex items-center gap-2 p-2 bg-white rounded border border-blue-200">
                      <Lock className="h-4 w-4 text-blue-600" />
                      <code className="text-sm font-mono flex-1">{orderInfo.tempPassword}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={copyPassword}
                        className="h-8"
                      >
                        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-blue-700">
                  ⚠️ Bitte ändern Sie Ihr Passwort nach dem ersten Login in den Einstellungen.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Order Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Bestelldetails</CardTitle>
            <CardDescription>Ihre Bestellung wurde erfolgreich verarbeitet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Bestellnummer</p>
                  <p className="font-semibold text-gray-900">{orderInfo.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Datum</p>
                  <p className="font-semibold text-gray-900">{new Date().toLocaleDateString('de-DE')}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">Bestellte Kurse</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{orderInfo.courseName}</p>
                      <p className="text-sm text-gray-600">{orderInfo.planName}</p>
                    </div>
                    <p className="font-bold text-gray-900">{formatPrice(orderInfo.total)}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Status</span>
                  <span className="inline-flex items-center gap-2 text-green-600 font-semibold">
                    <CheckCircle className="h-4 w-4" />
                    Bezahlt & Bestätigt
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Kurszugang</span>
                  <span className="inline-flex items-center gap-2 text-green-600 font-semibold">
                    <CheckCircle className="h-4 w-4" />
                    Aktiviert
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Rechnung herunterladen (PDF)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Nächste Schritte</CardTitle>
            <CardDescription>So geht es weiter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {orderInfo.isNewUser ? 'In Ihr Dashboard einloggen' : 'Bestätigungs-E-Mail prüfen'}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {orderInfo.isNewUser 
                    ? 'Nutzen Sie die oben angezeigten Zugangsdaten, um sich anzumelden.'
                    : 'Sie erhalten in Kürze eine E-Mail mit der Bestellbestätigung und Rechnung.'
                  }
                </p>
                {orderInfo.isNewUser && (
                  <Button size="sm" asChild>
                    <Link href="/login">
                      <Lock className="h-4 w-4 mr-2" />
                      Jetzt anmelden
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Erstgespräch buchen</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Buchen Sie Ihr kostenloses Erstgespräch mit Ihrem Coach, um Ihre Lernziele zu besprechen.
                </p>
                <Button size="sm" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Termin vereinbaren
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Community beitreten</h3>
                <p className="text-sm text-gray-600">
                  Treten Sie unseren WhatsApp- und Discord-Gruppen bei. Die Einladungslinks finden Sie in Ihrer Willkommens-E-Mail.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Mit dem Kurs beginnen</h3>
                <p className="text-sm text-gray-600">
                  Melden Sie sich in Ihrem Dashboard an und starten Sie mit dem ersten Modul Ihres Kurses.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button asChild className="flex-1" size="lg">
            <Link href="/student">
              <ArrowRight className="h-4 w-4 mr-2" />
              Zum Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1" size="lg">
            <Link href="/">
              Zur Startseite
            </Link>
          </Button>
        </div>

        {/* Support */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              Brauchen Sie Hilfe?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Unser Support-Team steht Ihnen bei Fragen gerne zur Verfügung.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="sm" variant="outline">
                <MessageCircle className="h-4 w-4 mr-2" />
                Support kontaktieren
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link href="/faq">FAQ anzeigen</Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link href="mailto:support@university-ecom.com">
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
