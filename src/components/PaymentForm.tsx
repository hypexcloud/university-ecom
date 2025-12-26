'use client'

import { useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CreditCard, AlertCircle } from 'lucide-react'
import { getCurrentAffiliateAttribution } from '@/lib/affiliate-tracking'

interface PaymentFormProps {
  customerData: any
  onSuccess: (orderId: string) => void
  onError: (error: string) => void
}

export default function PaymentForm({ customerData, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setMessage('')

    try {
      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required'
      })

      if (error) {
        setMessage(error.message || 'Ein Fehler ist aufgetreten')
        onError(error.message || 'Ein Fehler ist aufgetreten')
        setIsProcessing(false)
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment successful - now process the order
        try {
          // Get affiliate code from cookie if exists
          const affiliateCode = getCurrentAffiliateAttribution()
          
          const response = await fetch('/api/process-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentIntentId: paymentIntent.id,
              customerData,
              affiliateCode // Include affiliate code
            })
          })

          if (!response.ok) {
            throw new Error('Order processing failed')
          }

          const result = await response.json()
          
          if (result.success) {
            // Store order info in session storage for success page
            sessionStorage.setItem('orderInfo', JSON.stringify({
              orderId: result.orderId,
              isNewUser: result.isNewUser,
              tempPassword: result.tempPassword
            }))
            
            onSuccess(result.orderId)
          } else {
            throw new Error(result.error || 'Order processing failed')
          }
        } catch (orderError: any) {
          setMessage('Zahlung erfolgreich, aber Bestellung konnte nicht abgeschlossen werden. Bitte kontaktieren Sie den Support.')
          onError(orderError.message)
          setIsProcessing(false)
        }
      }
    } catch (err: any) {
      setMessage('Ein unerwarteter Fehler ist aufgetreten')
      onError('Ein unerwarteter Fehler ist aufgetreten')
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {message && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Zahlung wird verarbeitet...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Jetzt zahlungspflichtig bestellen
          </>
        )}
      </Button>

      <p className="text-xs text-center text-gray-500">
        Ihre Zahlung wird sicher über Stripe verarbeitet. Wir speichern keine Kreditkartendaten.
      </p>
    </form>
  )
}
