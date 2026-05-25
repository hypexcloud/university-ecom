'use client'

import { Suspense, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Elements } from '@stripe/react-stripe-js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { CheckoutFormData, checkoutSchema, LEAD_SOURCE_OPTIONS, COUNTRY_OPTIONS } from '@/lib/checkout-schema'
import { COURSE_PRICING, CourseType, PlanType, formatPrice, getStripe, createPaymentMetadata } from '@/lib/stripe'
import { ShoppingCart, CreditCard, User, MapPin, Check, AlertCircle, Loader2, Info, ArrowRight, Trash2 } from 'lucide-react'
import PaymentForm from '@/components/PaymentForm'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { useCart, type CartItem } from '@/lib/cart'

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="checkout-dark min-h-screen bg-prestige-black py-12"><div className="container mx-auto px-4 max-w-7xl"><Loader2 className="h-8 w-8 animate-spin mx-auto mt-20 text-prestige-gold-500" /></div></div>}>
      <CheckoutContent />
    </Suspense>
  )
}

const VALID_COURSES: CourseType[] = ['ai', 'dropshipping', 'tiktok-creator', 'youtube-creator']
const VALID_PLANS: PlanType[] = ['fast', 'business', 'infinity', 'tiktok', 'youtube']

function isCreatorProduct(course: CourseType): boolean {
  return course === 'tiktok-creator' || course === 'youtube-creator'
}

function getDefaultPlanForCourse(course: CourseType): PlanType {
  if (course === 'tiktok-creator') return 'tiktok'
  if (course === 'youtube-creator') return 'youtube'
  return 'business'
}

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<'details' | 'payment'>('details')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [stripePromise, setStripePromise] = useState<any>(null)
  const [customerData, setCustomerData] = useState<CheckoutFormData | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe')
  const cart = useCart()

  // If ?course= param, add to cart and clear URL
  const courseParam = searchParams.get('course') as CourseType | null
  const planParam = searchParams.get('plan') as PlanType | null

  useEffect(() => {
    if (courseParam && VALID_COURSES.includes(courseParam)) {
      const plan = planParam && VALID_PLANS.includes(planParam) ? planParam : getDefaultPlanForCourse(courseParam)
      cart.add({ course: courseParam, plan })
      // Clean URL without reload
      window.history.replaceState({}, '', '/checkout')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const cartItems = cart.items
  const cartEmpty = cartItems.length === 0

  // Compute prices for each item
  const itemDetails = cartItems.map((item) => {
    const cd = COURSE_PRICING[item.course as CourseType]
    const pl = (cd?.plans as Record<string, { name: string; price: number; features: readonly string[] }>)?.[item.plan]
    return { ...item, courseName: cd?.name || item.course, planName: pl?.name || item.plan, price: pl?.price || 0, features: pl?.features || [] }
  })
  const total = itemDetails.reduce((sum, i) => sum + i.price, 0)

  // Use first item for form defaults (form still tracks course/plan for Stripe metadata)
  const firstItem = cartItems[0] || { course: 'ai', plan: 'business' }

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { course: firstItem.course as CourseType, plan: firstItem.plan as PlanType, address: { country: 'Deutschland' }, acceptNewsletter: false }
  })

  const watchAcceptTerms = watch('acceptTerms')

  // Load Stripe
  useEffect(() => {
    getStripe().then(setStripePromise)
  }, [])

  const billingAddressFromForm = (data: CheckoutFormData) => ({
    street: data.address.street,
    zipCode: data.address.zipCode,
    city: data.address.city,
    country: data.address.country,
    companyName: data.address.isCompany ? data.address.companyName : '',
    vatId: data.address.isCompany ? data.address.vatId : '',
  })

  const onDetailsSubmit = async (data: CheckoutFormData) => {
    try {
      setIsSubmitting(true)
      setError('')
      setCustomerData(data)

      if (paymentMethod === 'paypal') {
        setStep('payment')
        return
      }

      // Stripe: create payment intent with all cart items
      const metadata = createPaymentMetadata({
        course: firstItem.course as CourseType,
        plan: firstItem.plan as PlanType,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        leadSource: data.leadSource,
        affiliateId: data.affiliateId
      })

      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'EUR',
          metadata,
          customerEmail: data.email,
          billingAddress: billingAddressFromForm(data),
          cartItems: cartItems.map((i) => ({ course: i.course, plan: i.plan })),
        })
      })

      if (!response.ok) {
        throw new Error('Fehler beim Erstellen der Zahlung')
      }

      const result = await response.json()
      setClientSecret(result.clientSecret)

      // Store credentials for success page if new user was created
      if (result.isNewUser && result.tempPassword) {
        sessionStorage.setItem('checkoutCredentials', JSON.stringify({
          isNewUser: true,
          tempPassword: result.tempPassword,
          email: result.customerEmail,
        }))
      }

      setStep('payment')
    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePaymentSuccess = () => {
    cart.clear()
    router.push('/checkout/success')
  }

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage)
    setStep('details')
  }

  if (cartEmpty && step === 'details') {
    return (
      <div className="checkout-dark min-h-screen bg-prestige-black py-12">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <ShoppingCart className="h-16 w-16 text-prestige-gray-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-2">Ihr Warenkorb ist leer</h1>
          <p className="text-prestige-gray-400 mb-8">Wählen Sie einen Kurs oder ein Programm aus, um fortzufahren.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-gold"><Link href="/pricing">Kurse ansehen</Link></Button>
            <Button asChild variant="outline"><Link href="/creator">Creator Programm</Link></Button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'payment' && paymentMethod === 'stripe' && clientSecret && stripePromise) {
    return (
      <div className="checkout-dark min-h-screen bg-prestige-black py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Zahlung</h1>
            <p className="text-prestige-gray-400">Schließen Sie Ihre Bestellung ab</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Zahlungsinformationen</CardTitle>
              <CardDescription>
                Geben Sie Ihre Zahlungsdaten ein, um die Bestellung abzuschließen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                <PaymentForm
                  customerData={customerData}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Elements>
            </CardContent>
          </Card>

          <div className="mt-4">
            <Button variant="outline" onClick={() => setStep('details')}>
              ← Zurück zu den Details
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'payment' && paymentMethod === 'paypal' && customerData) {
    const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''
    return (
      <div className="checkout-dark min-h-screen bg-prestige-black py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">PayPal-Zahlung</h1>
            <p className="text-prestige-gray-400">Schließen Sie Ihre Bestellung über PayPal ab</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Mit PayPal bezahlen</CardTitle>
              <CardDescription>
                {itemDetails.map((i) => i.courseName).join(', ')} — {formatPrice(total)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {paypalClientId ? (
                <PayPalScriptProvider options={{ clientId: paypalClientId, currency: 'EUR' }}>
                  <PayPalButtons
                    style={{ layout: 'vertical', shape: 'rect', label: 'pay' }}
                    createOrder={async () => {
                      const res = await fetch('/api/checkout/paypal/create', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          courseType: cartItems[0]?.course,
                          planType: cartItems[0]?.plan,
                          cartItems,
                          billingAddress: billingAddressFromForm(customerData),
                        }),
                      })
                      const data = await res.json()
                      if (!res.ok) throw new Error(data.error)
                      return data.orderId
                    }}
                    onApprove={async (data) => {
                      const res = await fetch('/api/checkout/paypal/capture', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ orderId: data.orderID }),
                      })
                      if (res.ok) {
                        handlePaymentSuccess()
                      } else {
                        const err = await res.json()
                        handlePaymentError(err.error || 'PayPal-Zahlung fehlgeschlagen')
                      }
                    }}
                    onError={(err) => {
                      handlePaymentError('PayPal-Fehler: ' + String(err))
                    }}
                  />
                </PayPalScriptProvider>
              ) : (
                <p className="text-muted-foreground">PayPal ist derzeit nicht verfügbar. Bitte verwenden Sie Stripe.</p>
              )}
            </CardContent>
          </Card>

          <div className="mt-4">
            <Button variant="outline" onClick={() => setStep('details')}>
              ← Zurück zu den Details
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-dark min-h-screen bg-prestige-black py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <Link href="/" className="text-prestige-gold-500 hover:text-prestige-gold-400 mb-4 inline-block">← Zurück</Link>
          <h1 className="text-4xl font-bold mb-2">Kasse</h1>
          <p className="text-prestige-gray-400">Schließen Sie Ihre Bestellung ab</p>
        </div>

        {error && <Alert variant="destructive" className="mb-6"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}

        <form onSubmit={handleSubmit(onDetailsSubmit)}>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><ShoppingCart className="h-5 w-5" />Warenkorb ({cartItems.length})</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {itemDetails.map((item, idx) => (
                    <div key={idx} className="p-4 border-2 border-prestige-gold-500 bg-prestige-gold-500/10 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-lg font-semibold">{item.courseName}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-bold">{formatPrice(item.price)}</span>
                          <button type="button" onClick={() => cart.remove(idx)} className="text-prestige-gray-500 hover:text-red-500 transition-colors" title="Entfernen">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <Badge variant="outline" className="mb-2">{item.planName}</Badge>
                      <ul className="space-y-1 mt-2 ml-1">
                        {item.features.map((f, i) => (
                          <li key={i} className="text-sm text-prestige-gray-400 flex items-start gap-2">
                            <Check className="h-4 w-4 text-prestige-gold-500 mt-0.5" /><span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" asChild className="mt-2">
                    <Link href="/pricing">+ Weiteres Produkt hinzufügen</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Persönliche Informationen</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div><Label>Vorname *</Label><Input {...register('firstName')} />{errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}</div>
                    <div><Label>Nachname *</Label><Input {...register('lastName')} />{errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}</div>
                  </div>
                  <div><Label>E-Mail *</Label><Input type="email" {...register('email')} />{errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}</div>
                  <div><Label>Telefon *</Label><Input {...register('phone')} />{errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}</div>
                  <div><Label>Discord (Optional)</Label><Input {...register('discord')} /></div>
                  <div><Label>Geburtsdatum (Optional)</Label><Input type="date" {...register('birthDate')} /></div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" />Rechnungsadresse</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="isCompany"
                      checked={watch('address.isCompany')}
                      onCheckedChange={(c) => setValue('address.isCompany', c as boolean)}
                    />
                    <label htmlFor="isCompany" className="text-sm font-medium">Firmenkunde</label>
                  </div>

                  {watch('address.isCompany') && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label>Firmenname *</Label>
                        <Input {...register('address.companyName')} placeholder="Firma GmbH" />
                        {errors.address?.companyName && <p className="text-sm text-red-500">{errors.address.companyName.message}</p>}
                      </div>
                      <div>
                        <Label>USt-IdNr. (optional)</Label>
                        <Input {...register('address.vatId')} placeholder="DE123456789" />
                      </div>
                    </div>
                  )}

                  <div><Label>Straße und Hausnummer *</Label><Input {...register('address.street')} />{errors.address?.street && <p className="text-sm text-red-500">{errors.address.street.message}</p>}</div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div><Label>PLZ *</Label><Input {...register('address.zipCode')} />{errors.address?.zipCode && <p className="text-sm text-red-500">{errors.address.zipCode.message}</p>}</div>
                    <div><Label>Stadt *</Label><Input {...register('address.city')} />{errors.address?.city && <p className="text-sm text-red-500">{errors.address.city.message}</p>}</div>
                  </div>
                  <div><Label>Land *</Label>
                    <Select defaultValue="Deutschland" onValueChange={(v) => setValue('address.country', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{COUNTRY_OPTIONS.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" />Wie haben Sie von uns erfahren?</CardTitle></CardHeader>
                <CardContent>
                  <Select onValueChange={(v) => setValue('leadSource', v as any)}>
                    <SelectTrigger><SelectValue placeholder="Bitte auswählen" /></SelectTrigger>
                    <SelectContent>{LEAD_SOURCE_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                  </Select>
                  {errors.leadSource && <p className="text-sm text-red-500 mt-1">{errors.leadSource.message}</p>}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Checkbox id="terms" checked={watchAcceptTerms} onCheckedChange={(c) => setValue('acceptTerms', c as boolean)} />
                    <div><label htmlFor="terms" className="text-sm font-medium">AGB akzeptieren *</label>
                      <p className="text-sm text-prestige-gray-500">Ich akzeptiere die <Link href="/agb" className="text-prestige-gold-500">AGB</Link> und <Link href="/datenschutz" className="text-prestige-gold-500">Datenschutzerklärung</Link></p>
                    </div>
                  </div>
                  {errors.acceptTerms && <p className="text-sm text-red-500">{errors.acceptTerms.message}</p>}

                  {/* Widerruf waiver — mandatory for digital content */}
                  <div className="flex items-start gap-3 p-3 border border-prestige-gold-500/30 bg-prestige-gold-500/10 rounded-lg">
                    <Checkbox
                      id="widerruf"
                      checked={watch('acceptWiderrufWaiver')}
                      onCheckedChange={(c) => setValue('acceptWiderrufWaiver', c as boolean)}
                    />
                    <div>
                      <label htmlFor="widerruf" className="text-sm font-medium">Widerrufsverzicht *</label>
                      <p className="text-sm text-prestige-gray-300">
                        Ich stimme ausdrücklich zu, dass die Ausführung des Vertrages (Zugang zu digitalen Inhalten) sofort nach Bezahlung beginnt.
                        Mir ist bekannt, dass ich mit Beginn der Ausführung mein Widerrufsrecht verliere (§ 356 Abs. 5 BGB).
                      </p>
                    </div>
                  </div>
                  {errors.acceptWiderrufWaiver && <p className="text-sm text-red-500">{errors.acceptWiderrufWaiver.message}</p>}

                  <div className="flex items-start gap-3">
                    <Checkbox {...register('acceptNewsletter')} />
                    <label className="text-sm">Newsletter abonnieren</label>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Card>
                  <CardHeader><CardTitle>Bestellübersicht</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {itemDetails.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.courseName} <Badge variant="outline" className="ml-1">{item.planName}</Badge></span>
                        <span className="font-medium">{formatPrice(item.price)}</span>
                      </div>
                    ))}
                    <Separator />

                    {/* Giftcard redemption */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Gutschein einlösen</p>
                      <div className="flex gap-2">
                        <Input placeholder="Gutschein-Code" className="text-xs" id="giftcard-code" />
                        <Button type="button" variant="outline" size="sm" onClick={async () => {
                          const code = (document.getElementById('giftcard-code') as HTMLInputElement)?.value
                          if (!code) return
                          const res = await fetch('/api/giftcards/redeem', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) })
                          if (res.ok) { const data = await res.json(); alert(`Gutschein gültig! Guthaben: ${(data.balanceCents / 100).toFixed(2)} €`) }
                          else { alert('Ungültiger Gutscheincode') }
                        }}>Einlösen</Button>
                      </div>
                    </div>

                    <Separator />
                    <div className="flex justify-between text-lg font-bold"><span>Gesamt</span><span>{formatPrice(total)}</span></div>
                    <p className="text-xs text-prestige-gray-500">inkl. MwSt.</p>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Zahlungsmethode</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('stripe')}
                          className={`p-3 border rounded-lg text-sm font-medium transition-colors ${paymentMethod === 'stripe' ? 'border-prestige-gold-500 bg-prestige-gold-500/10 text-prestige-gold-500' : 'border-prestige-gray-700 text-prestige-gray-400 hover:border-prestige-gray-500'}`}
                        >
                          <CreditCard className="h-4 w-4 mx-auto mb-1" />
                          Karte / SEPA
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('paypal')}
                          className={`p-3 border rounded-lg text-sm font-medium transition-colors ${paymentMethod === 'paypal' ? 'border-prestige-gold-500 bg-prestige-gold-500/10 text-prestige-gold-500' : 'border-prestige-gray-700 text-prestige-gray-400 hover:border-prestige-gray-500'}`}
                        >
                          <span className="block text-center mb-1">PP</span>
                          PayPal
                        </button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Wird verarbeitet...</> : <><ArrowRight className="mr-2 h-4 w-4" />Weiter zur Zahlung</>}
                    </Button>
                    <p className="text-xs text-center text-prestige-gray-500">Sichere Zahlung mit {paymentMethod === 'stripe' ? 'Stripe' : 'PayPal'}</p>
                  </CardContent>
                </Card>
                <div className="mt-4 p-4 bg-prestige-gold-500/10 border border-prestige-gold-500/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2"><Check className="h-5 w-5 text-prestige-gold-500" /><span className="text-sm font-medium text-prestige-gold-500">14 Tage Widerrufsrecht</span></div>
                  <div className="flex items-center gap-2 mb-2"><Check className="h-5 w-5 text-prestige-gold-500" /><span className="text-sm font-medium text-prestige-gold-500">Sofortiger Zugang</span></div>
                  <div className="flex items-center gap-2"><Check className="h-5 w-5 text-prestige-gold-500" /><span className="text-sm font-medium text-prestige-gold-500">Sichere Zahlung</span></div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
