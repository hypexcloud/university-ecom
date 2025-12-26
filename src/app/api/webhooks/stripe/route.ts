import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { constructWebhookEvent } from '@/lib/stripe-server'
import { processOrder } from '@/lib/order-processing'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get('stripe-signature')
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }
    
    // Construct and verify webhook event
    const event = await constructWebhookEvent(body, signature)
    
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent)
        break
        
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent)
        break
        
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
    
    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    const metadata = paymentIntent.metadata
    
    // Process the order
    const result = await processOrder({
      email: metadata.customerEmail,
      firstName: metadata.customerName?.split(' ')[0] || 'Kunde',
      lastName: metadata.customerName?.split(' ').slice(1).join(' ') || '',
      phone: metadata.customerPhone || '',
      address: {
        street: '',
        zipCode: '',
        city: '',
        country: 'Deutschland'
      },
      course: metadata.courseType as any,
      plan: metadata.planType as any,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100, // Convert from cents
      currency: paymentIntent.currency,
      leadSource: metadata.leadSource,
      affiliateId: metadata.affiliateId
    })
    
    if (result.success) {
      console.log('Order processed successfully:', result.orderId)
    } else {
      console.error('Order processing failed:', result.error)
    }
  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Payment failed:', paymentIntent.id)
    // TODO: Send failure notification email
    // TODO: Log failed payment attempt
  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
}
