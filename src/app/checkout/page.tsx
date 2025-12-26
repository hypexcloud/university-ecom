'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
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
import { COURSE_PRICING, CourseType, PlanType, formatPrice, calculateVAT, calculateTotal, getStripe, createPaymentMetadata } from '@/lib/stripe'
import { ShoppingCart, CreditCard, User, Mail, Phone, MapPin, Calendar, MessageSquare, Check, AlertCircle, Loader2, Info, ArrowRight } from 'lucide-react'
import PaymentForm from '@/components/PaymentForm'

export default function CheckoutPage() {
  const router = useRouter()
  const [step, setStep] = useState<'details' | 'payment'>('details')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [stripePromise, setStripePromise] = useState<any>(null)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { course: 'ai', plan: 'business', address: { country: 'Deutschland' }, acceptNewsletter: false }
  })

  const watchCourse = watch('course', 'ai')
  const watchPlan = watch('plan', 'business')
  const watchAcceptTerms = watch('acceptTerms')

  const courseData = COURSE_PRICING[watchCourse]
  const planData = courseData.plans[watchPlan]
  const subtotal = planData.price
  const vat = calculateVAT(subtotal)
  const total = calculateTotal(subtotal)

  // Load Stripe
  useEffect(() => {
    getStripe().then(setStripePromise)
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
          amount: subtotal,
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
      setStep('payment')
    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePaymentSuccess = () => {
    router.push('/checkout/success')
  }

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage)
    setStep('details')
  }

  if (step === 'payment' && clientSecret && stripePromise) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Zahlung</h1>
            <p className="text-gray-600">Schließen Sie Ihre Bestellung ab</p>
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">← Zurück</Link>
          <h1 className="text-4xl font-bold mb-2">Kasse</h1>
          <p className="text-gray-600">Schließen Sie Ihre Bestellung ab</p>
        </div>

        {error && <Alert variant="destructive" className="mb-6"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}

        <form onSubmit={handleSubmit(onDetailsSubmit)}>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><ShoppingCart className="h-5 w-5" />Kursauswahl</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Kurs *</Label>
                    <Select value={watchCourse} onValueChange={(v) => setValue('course', v as CourseType)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ai">AI Automatisierung (3 Monate)</SelectItem>
                        <SelectItem value="dropshipping">EU Dropshipping (2 Monate)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Plan *</Label>
                    <div className="grid gap-3 mt-2">
                      {Object.entries(courseData.plans).map(([key, plan]) => (
                        <div key={key} onClick={() => setValue('plan', key as PlanType)} 
                             className={`p-4 border-2 rounded-lg cursor-pointer ${watchPlan === key ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">{plan.name}</span>
                            <span className="text-xl font-bold">{formatPrice(plan.price)}</span>
                          </div>
                          <ul className="space-y-1 ml-6">
                            {plan.features.map((f, i) => (<li key={i} className="text-sm text-gray-600 flex items-start gap-2"><Check className="h-4 w-4 text-green-600 mt-0.5" /><span>{f}</span></li>))}
                          </ul>
                        </div>
                      ))}
                    </div>
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
                      <p className="text-sm text-gray-500">Ich akzeptiere die <Link href="/agb" className="text-blue-600">AGB</Link> und <Link href="/datenschutz" className="text-blue-600">Datenschutzerklärung</Link></p>
                    </div>
                  </div>
                  {errors.acceptTerms && <p className="text-sm text-red-500">{errors.acceptTerms.message}</p>}
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
                    <div><div className="font-medium mb-1">{courseData.name}</div><Badge variant="outline">{planData.name}</Badge></div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm"><span>Zwischensumme</span><span className="font-medium">{formatPrice(subtotal)}</span></div>
                      <div className="flex justify-between text-sm"><span>MwSt. (19%)</span><span className="font-medium">{formatPrice(vat)}</span></div>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold"><span>Gesamt</span><span>{formatPrice(total)}</span></div>
                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Wird verarbeitet...</> : <><ArrowRight className="mr-2 h-4 w-4" />Weiter zur Zahlung</>}
                    </Button>
                    <p className="text-xs text-center text-gray-500">Sichere Zahlung mit Stripe</p>
                  </CardContent>
                </Card>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2"><Check className="h-5 w-5 text-blue-600" /><span className="text-sm font-medium">14 Tage Widerrufsrecht</span></div>
                  <div className="flex items-center gap-2 mb-2"><Check className="h-5 w-5 text-blue-600" /><span className="text-sm font-medium">Sofortiger Zugang</span></div>
                  <div className="flex items-center gap-2"><Check className="h-5 w-5 text-blue-600" /><span className="text-sm font-medium">Sichere Zahlung</span></div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
