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
import { AI_COURSE_PLANS, DROPSHIPPING_COURSE_PLANS } from '@/lib/courses-data'
import { ShoppingCart, CreditCard, User, Mail, Phone, MapPin, Calendar, MessageSquare, Check, AlertCircle, Loader2, Info, ArrowRight, Trash2 } from 'lucide-react'
import PaymentForm from '@/components/PaymentForm'

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
  const [cartEmpty, setCartEmpty] = useState(false)

  const courseParam = searchParams.get('course') as CourseType | null
  const planParam = searchParams.get('plan') as PlanType | null
  const hasProduct = courseParam && VALID_COURSES.includes(courseParam)
  const initialCourse: CourseType = hasProduct ? courseParam : 'ai'
  const initialPlan: PlanType = planParam && VALID_PLANS.includes(planParam) ? planParam : getDefaultPlanForCourse(initialCourse)

  const isCreator = isCreatorProduct(initialCourse)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { course: initialCourse, plan: initialPlan, address: { country: 'Deutschland' }, acceptNewsletter: false }
  })

  const watchCourse = watch('course')
  const watchPlan = watch('plan')
  const watchAcceptTerms = watch('acceptTerms')

  const courseData = COURSE_PRICING[watchCourse]
  const plans = courseData.plans as Record<string, { readonly name: string; readonly price: number; readonly currency: string; readonly features: readonly string[]; readonly includes1to1: boolean; readonly sessionCount?: number }>
  const planData = plans[watchPlan]
  const total = planData.price

  const coursePlans = watchCourse === 'ai' ? AI_COURSE_PLANS : DROPSHIPPING_COURSE_PLANS
  const selectedCoursePlan = !isCreator ? coursePlans.find(p => p.name === watchPlan) : null

  // Load Stripe + persist cart
  useEffect(() => {
    getStripe().then(setStripePromise)
    if (hasProduct) {
      localStorage.setItem('checkout_url', `/checkout?course=${initialCourse}&plan=${initialPlan}`)
    } else if (!localStorage.getItem('checkout_url')) {
      setCartEmpty(true)
    }
  }, [])

  const onDetailsSubmit = async (data: CheckoutFormData) => {
    try {
      setIsSubmitting(true)
      setError('')

      // Create payment intent
      const metadata = createPaymentMetadata({
        course: data.course,
        plan: data.plan,
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
          customerEmail: data.email
        })
      })

      if (!response.ok) {
        throw new Error('Fehler beim Erstellen der Zahlung')
      }

      const { clientSecret } = await response.json()
      setClientSecret(clientSecret)
      setCustomerData(data)
      setStep('payment')
    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePaymentSuccess = () => {
    localStorage.removeItem('checkout_url')
    router.push('/checkout/success')
  }

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage)
    setStep('details')
  }

  if (cartEmpty) {
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

  if (step === 'payment' && clientSecret && stripePromise) {
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
                <CardHeader><CardTitle className="flex items-center gap-2"><ShoppingCart className="h-5 w-5" />Ihr Produkt</CardTitle></CardHeader>
                <CardContent>
                  <div className="p-4 border-2 border-prestige-gold-500 bg-prestige-gold-500/10 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg font-semibold">{courseData.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold">{formatPrice(planData.price)}</span>
                        <button type="button" onClick={() => { localStorage.removeItem('checkout_url'); setCartEmpty(true) }} className="text-prestige-gray-500 hover:text-red-500 transition-colors" title="Produkt entfernen">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {!isCreator && <Badge variant="outline" className="mb-3">{selectedCoursePlan?.displayNameDE ?? planData.name}</Badge>}
                    <ul className="space-y-1 mt-3 ml-1">
                      {(isCreator ? planData.features : (selectedCoursePlan?.featuresDE ?? planData.features)).map((f: string, i: number) => (
                        <li key={i} className="text-sm text-prestige-gray-400 flex items-start gap-2">
                          <Check className="h-4 w-4 text-prestige-gold-500 mt-0.5" /><span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
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
                    <div>
                      <div className="font-medium mb-1">{courseData.name}</div>
                      {!isCreator && <Badge variant="outline">{selectedCoursePlan?.displayNameDE ?? planData.name}</Badge>}
                    </div>
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
                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Wird verarbeitet...</> : <><ArrowRight className="mr-2 h-4 w-4" />Weiter zur Zahlung</>}
                    </Button>
                    <p className="text-xs text-center text-prestige-gray-500">Sichere Zahlung mit Stripe</p>
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
