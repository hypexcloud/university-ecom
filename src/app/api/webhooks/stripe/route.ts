import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { constructWebhookEvent } from '@/lib/stripe-server'
import { handleStripePaymentSuccess } from '@/lib/server/order-processing'
import { db } from '@/lib/server/db'
import { auditLog } from '@/lib/server/db/schema'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = (await headers()).get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
    }

    const event = await constructWebhookEvent(body, signature)

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent)
        break

      default:
        // Unhandled event types are acknowledged but not processed
        break
    }

    return NextResponse.json({ received: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Webhook error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const result = await handleStripePaymentSuccess(paymentIntent)

  await db.insert(auditLog).values({
    actorUid: paymentIntent.metadata.customerUid || null,
    action: 'order.paid',
    targetType: 'order',
    targetId: result.orderId,
    after: {
      paymentIntentId: paymentIntent.id,
      invoiceNumber: result.invoiceNumber,
      amount: paymentIntent.amount,
    },
  })
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  await db.insert(auditLog).values({
    actorUid: paymentIntent.metadata.customerUid || null,
    action: 'payment.failed',
    targetType: 'payment_intent',
    targetId: paymentIntent.id,
    after: {
      error: paymentIntent.last_payment_error?.message || 'Unknown error',
    },
  })
}
