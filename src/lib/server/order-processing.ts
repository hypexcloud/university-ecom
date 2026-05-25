import { db } from '@/lib/server/db'
import {
  orders, orderItems, entitlements, invoices, plans, sessions,
  affiliateLinks, affiliateReferrals, customers, products,
  enrollments, courses,
} from '@/lib/server/db/schema'
import { eq, and, isNull, sql } from 'drizzle-orm'
import { emitNotification } from '@/lib/server/notifications'
import { generateAndUploadInvoicePdf } from './invoice-generate'
import { addRole, removeRole } from './discord'
import { sendWelcomeEmail, sendOrderConfirmationEmail } from '@/lib/email-utils'
import type Stripe from 'stripe'
import type { CourseType, PlanType } from '@/lib/stripe'

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
  isNewUser?: boolean
  tempPassword?: string
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

  // Create enrollment row (links customer to course for progress tracking)
  await createEnrollment(customerUid, planId)

  // Auto-assign Discord role (non-fatal)
  const [grantedPlan] = await db
    .select({ code: plans.code })
    .from(plans)
    .where(eq(plans.id, planId))
    .limit(1)

  if (grantedPlan) {
    const [customer] = await db
      .select({ discordUserId: customers.discordUserId })
      .from(customers)
      .where(eq(customers.uid, customerUid))
      .limit(1)

    if (customer?.discordUserId) {
      // Remove old role on upgrade, add new one
      if (isUpgrade && upgradeFromPlanId) {
        const [oldPlan] = await db
          .select({ code: plans.code })
          .from(plans)
          .where(eq(plans.id, upgradeFromPlanId))
          .limit(1)
        if (oldPlan) {
          removeRole(customer.discordUserId, oldPlan.code).catch(() => {})
        }
      }
      addRole(customer.discordUserId, grantedPlan.code).catch(() => {})
    }
  }

  // Generate invoice
  const invoiceNumber = await generateInvoiceNumber()
  const [invoice] = await db.insert(invoices).values({
    orderId: order.id,
    number: invoiceNumber,
  }).returning()

  // Generate PDF + upload to Supabase Storage (non-fatal)
  generateAndUploadInvoicePdf({
    invoiceId: invoice.id,
    invoiceNumber,
    customerUid,
    orderId: order.id,
    totalCents,
    netCents,
    vatCents,
    vatRate: 19,
    provider,
    providerRef: providerRef || '',
    planId,
  }).catch(() => {})

  // Auto-schedule creator sessions if applicable
  const [plan] = await db.select().from(plans).where(eq(plans.id, planId)).limit(1)
  if (plan && (plan.code === 'tiktok' || plan.code === 'youtube')) {
    await scheduleCreatorSessions(customerUid, plan.code)
  }

  // Affiliate attribution + commission
  if (affiliateCode) {
    await attributeAffiliate(affiliateCode, customerUid, order.id, totalCents)
  }

  // Send post-purchase emails (non-fatal)
  sendPostPurchaseEmails({
    customerUid,
    planId,
    orderId: order.id,
    totalCents,
    isNewUser: params.isNewUser ?? false,
    tempPassword: params.tempPassword,
  }).catch(() => {})

  return { orderId: order.id, invoiceNumber }
}

/**
 * Process a successful Stripe PaymentIntent into Postgres.
 * Supports multi-item carts via planIds metadata (JSON array).
 */
export async function handleStripePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const meta = paymentIntent.metadata
  const customerUid = meta.customerUid

  if (!customerUid) {
    throw new Error(`Missing customerUid on PaymentIntent ${paymentIntent.id}`)
  }

  // Parse planIds — supports both single planId and JSON array
  let planIds: string[] = []
  if (meta.planIds) {
    try { planIds = JSON.parse(meta.planIds) } catch { /* ignore */ }
  }
  if (planIds.length === 0 && meta.planId) {
    planIds = [meta.planId]
  }
  if (planIds.length === 0) {
    throw new Error(`No planIds on PaymentIntent ${paymentIntent.id}`)
  }

  // For multi-item: fulfill first item normally (creates order + invoice),
  // then add additional items to the same order
  const result = await fulfillOrder({
    customerUid,
    planId: planIds[0],
    totalCents: paymentIntent.amount,
    provider: 'stripe',
    providerRef: paymentIntent.id,
    isUpgrade: meta.isUpgrade === 'true',
    upgradeFromPlanId: meta.upgradeFromPlanId || null,
    affiliateCode: meta.affiliateCode || null,
    isNewUser: meta.isNewUser === 'true',
    tempPassword: meta.tempPassword || undefined,
  })

  // Grant entitlements for additional items (2nd+)
  for (let i = 1; i < planIds.length; i++) {
    await db.insert(orderItems).values({
      orderId: result.orderId,
      planId: planIds[i],
      priceCents: 0, // price already included in total
    })
    await db.insert(entitlements).values({
      customerUid,
      planId: planIds[i],
      sourceOrderId: result.orderId,
    })

    // Enrollment for progress tracking
    await createEnrollment(customerUid, planIds[i])

    // Discord role
    const [gp] = await db.select({ code: plans.code }).from(plans).where(eq(plans.id, planIds[i])).limit(1)
    if (gp) {
      const [cust] = await db.select({ discordUserId: customers.discordUserId }).from(customers).where(eq(customers.uid, customerUid)).limit(1)
      if (cust?.discordUserId) {
        addRole(cust.discordUserId, gp.code).catch(() => {})
      }
    }

    // Creator sessions
    const [plan] = await db.select().from(plans).where(eq(plans.id, planIds[i])).limit(1)
    if (plan && (plan.code === 'tiktok' || plan.code === 'youtube')) {
      await scheduleCreatorSessions(customerUid, plan.code)
    }
  }

  return result
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
  // Find an active mentor to assign
  const { mentors } = await import('@/lib/server/db/schema')
  const [mentor] = await db
    .select({ uid: mentors.uid })
    .from(mentors)
    .where(eq(mentors.isActive, true))
    .limit(1)

  // Fall back to customer if no mentors exist (admin will reassign)
  const mentorUid = mentor?.uid || customerUid

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

/**
 * Send welcome email (new users) and order confirmation (all users) after purchase.
 */
async function sendPostPurchaseEmails(params: {
  customerUid: string
  planId: string
  orderId: string
  totalCents: number
  isNewUser: boolean
  tempPassword?: string
}) {
  const [customer] = await db
    .select({ email: customers.email, firstName: customers.firstName })
    .from(customers)
    .where(eq(customers.uid, params.customerUid))
    .limit(1)

  if (!customer) return

  const [plan] = await db
    .select({ code: plans.code, productId: plans.productId })
    .from(plans)
    .where(eq(plans.id, params.planId))
    .limit(1)

  if (!plan) return

  const [product] = await db
    .select({ slug: products.slug })
    .from(products)
    .where(eq(products.id, plan.productId))
    .limit(1)

  const courseSlug = (product?.slug || 'ai') as CourseType
  const planCode = plan.code as PlanType

  // Welcome email for new users with temp password
  if (params.isNewUser && params.tempPassword) {
    await sendWelcomeEmail({
      email: customer.email,
      firstName: customer.firstName,
      tempPassword: params.tempPassword,
      course: courseSlug,
      plan: planCode,
    })
  }

  // Order confirmation for everyone
  await sendOrderConfirmationEmail({
    email: customer.email,
    firstName: customer.firstName,
    orderId: params.orderId,
    course: courseSlug,
    plan: planCode,
    amount: params.totalCents / 100,
  })
}

/**
 * Create an enrollment row linking a customer to the course associated with a plan.
 * This enables progress tracking and course completion detection.
 * Non-fatal: if the plan isn't linked to a course (e.g. giftcard/addon), skip silently.
 */
async function createEnrollment(customerUid: string, planId: string) {
  try {
    // Look up the product for this plan, then find the matching course
    const [plan] = await db
      .select({ productId: plans.productId })
      .from(plans)
      .where(eq(plans.id, planId))
      .limit(1)

    if (!plan) return

    const [course] = await db
      .select({ id: courses.id })
      .from(courses)
      .where(eq(courses.productId, plan.productId))
      .limit(1)

    if (!course) return // Not a course product (creator, giftcard, etc.)

    // Insert enrollment (skip if already exists for this customer+course+plan)
    await db.insert(enrollments).values({
      customerUid,
      courseId: course.id,
      planId,
    }).onConflictDoNothing()
  } catch {
    // Non-fatal — don't break the order flow
  }
}
