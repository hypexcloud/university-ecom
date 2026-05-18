import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { constructWebhookEvent } from '@/lib/stripe-server'
import { handleStripePaymentSuccess } from '@/lib/server/order-processing'
import { db } from '@/lib/server/db'
import { auditLog, orders, entitlements } from '@/lib/server/db/schema'
import { eq, isNull } from 'drizzle-orm'
import { emitNotification } from '@/lib/server/notifications'
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

      case 'charge.dispute.created':
        await handleChargeback(event.data.object as Stripe.Dispute)
        break

      default:
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

  // Notify customer
  const customerUid = paymentIntent.metadata.customerUid
  if (customerUid) {
    await emitNotification({
      recipientUid: customerUid,
      event: 'invoice_ready',
      title: `Rechnung ${result.invoiceNumber} erstellt`,
      body: `Deine Zahlung über ${(paymentIntent.amount / 100).toFixed(2)} € wurde bestätigt.`,
      link: '/student',
    }).catch(() => {})
  }
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

/**
 * Chargeback: auto-revoke entitlements, mark order refunded, notify admin.
 */
async function handleChargeback(dispute: Stripe.Dispute) {
  const paymentIntentId = typeof dispute.payment_intent === 'string'
    ? dispute.payment_intent
    : dispute.payment_intent?.id

  if (!paymentIntentId) return

  // Find the order by providerRef
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.providerRef, paymentIntentId))
    .limit(1)

  if (!order) return

  // Mark order as refunded
  await db
    .update(orders)
    .set({ status: 'refunded', metadata: { ...order.metadata as object, chargebackId: dispute.id } })
    .where(eq(orders.id, order.id))

  // Revoke all active entitlements from this order
  await db
    .update(entitlements)
    .set({ revokedAt: new Date() })
    .where(eq(entitlements.sourceOrderId, order.id))

  await db.insert(auditLog).values({
    actorUid: null,
    action: 'chargeback.auto_revoke',
    targetType: 'order',
    targetId: order.id,
    after: { disputeId: dispute.id, customerUid: order.customerUid },
  })

  // Notify all admins (emit to the customer who was charged back)
  await emitNotification({
    recipientUid: order.customerUid,
    event: 'chargeback',
    title: 'Zugang gesperrt — Rückbuchung',
    body: 'Aufgrund einer Rückbuchung wurden deine Zugänge gesperrt. Bitte kontaktiere den Support.',
    link: '/student/support',
    sendEmail: true,
  }).catch(() => {})
}
