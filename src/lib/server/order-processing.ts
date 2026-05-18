import { db } from '@/lib/server/db'
import {
  orders, orderItems, entitlements, invoices, customers, plans,
} from '@/lib/server/db/schema'
import { eq, and, isNull, sql } from 'drizzle-orm'
import type Stripe from 'stripe'

/**
 * Generate the next sequential invoice number: INV-YYYY-NNNNNN
 */
export async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const prefix = `INV-${year}-`

  const [result] = await db
    .select({ maxNum: sql<string>`max(number)` })
    .from(invoices)
    .where(sql`number like ${prefix + '%'}`)

  let next = 1
  if (result?.maxNum) {
    const lastNum = parseInt(result.maxNum.replace(prefix, ''), 10)
    if (!isNaN(lastNum)) next = lastNum + 1
  }

  return `${prefix}${String(next).padStart(6, '0')}`
}

interface FulfillParams {
  customerUid: string
  planId: string
  totalCents: number
  provider: 'stripe' | 'paypal' | 'crypto'
  providerRef: string | null
  isUpgrade?: boolean
  upgradeFromPlanId?: string | null
}

/**
 * Create order + items + entitlements + invoice in a single operation.
 * Handles upgrades by revoking the old entitlement.
 */
export async function fulfillOrder(params: FulfillParams) {
  const {
    customerUid, planId, totalCents, provider, providerRef,
    isUpgrade = false, upgradeFromPlanId = null,
  } = params

  // Create order
  const [order] = await db.insert(orders).values({
    customerUid,
    totalCents,
    currency: 'EUR',
    status: 'paid',
    provider,
    providerRef,
  }).returning()

  // Create order item
  await db.insert(orderItems).values({
    orderId: order.id,
    planId,
    priceCents: totalCents,
    isUpgrade,
    upgradeFromPlanId,
  })

  // If upgrade, revoke old entitlement
  if (isUpgrade && upgradeFromPlanId) {
    await db
      .update(entitlements)
      .set({ revokedAt: new Date() })
      .where(and(
        eq(entitlements.customerUid, customerUid),
        eq(entitlements.planId, upgradeFromPlanId),
        isNull(entitlements.revokedAt),
      ))
  }

  // Grant new entitlement
  await db.insert(entitlements).values({
    customerUid,
    planId,
    sourceOrderId: order.id,
  })

  // Generate invoice
  const invoiceNumber = await generateInvoiceNumber()
  await db.insert(invoices).values({
    orderId: order.id,
    number: invoiceNumber,
  })

  return { orderId: order.id, invoiceNumber }
}

/**
 * Process a successful Stripe PaymentIntent into Postgres.
 */
export async function handleStripePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const meta = paymentIntent.metadata

  const customerUid = meta.customerUid
  const planId = meta.planId

  if (!customerUid || !planId) {
    throw new Error(`Missing metadata on PaymentIntent ${paymentIntent.id}: customerUid=${customerUid}, planId=${planId}`)
  }

  return fulfillOrder({
    customerUid,
    planId,
    totalCents: paymentIntent.amount,
    provider: 'stripe',
    providerRef: paymentIntent.id,
    isUpgrade: meta.isUpgrade === 'true',
    upgradeFromPlanId: meta.upgradeFromPlanId || null,
  })
}
