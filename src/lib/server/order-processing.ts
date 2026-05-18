import { db } from '@/lib/server/db'
import {
  orders, orderItems, entitlements, invoices, plans, sessions,
  affiliateLinks, affiliateReferrals,
} from '@/lib/server/db/schema'
import { eq, and, isNull, sql } from 'drizzle-orm'
import { emitNotification } from '@/lib/server/notifications'
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
  affiliateCode?: string | null
}

/**
 * Create order + items + entitlements + invoice in a single operation.
 * Handles upgrades by revoking the old entitlement.
 */
export async function fulfillOrder(params: FulfillParams) {
  const {
    customerUid, planId, totalCents, provider, providerRef, affiliateCode,
    isUpgrade = false, upgradeFromPlanId = null,
  } = params

  // Create order with VAT breakdown (19% German USt)
  const vatRate = 0.19
  const netCents = Math.round(totalCents / (1 + vatRate))
  const vatCents = totalCents - netCents

  const [order] = await db.insert(orders).values({
    customerUid,
    totalCents,
    currency: 'EUR',
    status: 'paid',
    provider,
    providerRef,
    metadata: { vatRate, netCents, vatCents },
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

  // Auto-schedule creator sessions if applicable
  const [plan] = await db.select().from(plans).where(eq(plans.id, planId)).limit(1)
  if (plan && (plan.code === 'tiktok' || plan.code === 'youtube')) {
    await scheduleCreatorSessions(customerUid, plan.code)
  }

  // Affiliate attribution + commission
  if (affiliateCode) {
    await attributeAffiliate(affiliateCode, customerUid, order.id, totalCents)
  }

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
    affiliateCode: meta.affiliateCode || null,
  })
}

/**
 * Attribute an order to an affiliate and calculate commission (15% default).
 */
async function attributeAffiliate(code: string, customerUid: string, orderId: string, totalCents: number) {
  const [link] = await db
    .select()
    .from(affiliateLinks)
    .where(eq(affiliateLinks.code, code))
    .limit(1)

  if (!link) return
  // Don't allow self-referral
  if (link.customerUid === customerUid) return

  const rate = parseFloat(link.commissionRate || '0.15')
  const commissionCents = Math.round(totalCents * rate)

  await db.insert(affiliateReferrals).values({
    linkId: link.id,
    referredCustomerUid: customerUid,
    orderId,
    amountCents: commissionCents,
    status: 'approved',
  })

  // Notify affiliate
  await emitNotification({
    recipientUid: link.customerUid,
    event: 'affiliate_commission',
    title: 'Neue Provision!',
    body: `Du hast ${(commissionCents / 100).toFixed(2)} € Provision für eine Empfehlung erhalten.`,
    link: '/affiliate',
  }).catch(() => {})
}

/**
 * Auto-schedule 2 creator program sessions:
 * Call 1: first Friday after purchase
 * Call 2: +1 month from Call 1
 */
async function scheduleCreatorSessions(customerUid: string, planCode: string) {
  // Find the first admin with mentor permission to assign
  // For now, use a placeholder — in production this would pick from available mentors
  const mentorUid = customerUid // Will be reassigned by admin; placeholder so FK is valid

  const now = new Date()

  // First Friday after today
  const call1 = new Date(now)
  const dayOfWeek = call1.getDay() // 0=Sun, 5=Fri
  const daysUntilFriday = dayOfWeek <= 5 ? 5 - dayOfWeek : 5 + (7 - dayOfWeek)
  call1.setDate(call1.getDate() + (daysUntilFriday === 0 ? 7 : daysUntilFriday))
  call1.setHours(14, 0, 0, 0) // 14:00

  // Call 2: +1 month
  const call2 = new Date(call1)
  call2.setMonth(call2.getMonth() + 1)

  const sessionType = 'zoom'

  await db.insert(sessions).values([
    {
      customerUid,
      mentorUid,
      type: sessionType,
      status: 'pending',
      scheduledAt: call1,
      metadata: { creatorProgram: planCode, callNumber: 1 },
    },
    {
      customerUid,
      mentorUid,
      type: sessionType,
      status: 'pending',
      scheduledAt: call2,
      metadata: { creatorProgram: planCode, callNumber: 2 },
    },
  ])
}
