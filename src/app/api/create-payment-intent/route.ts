import { NextRequest, NextResponse } from 'next/server'
import { createPaymentIntent } from '@/lib/stripe-server'
import { createClient } from '@/lib/supabase/server'
import { calculateTotal } from '@/lib/stripe'
import { db } from '@/lib/server/db'
import { plans, products, customers } from '@/lib/server/db/schema'
import { eq, and } from 'drizzle-orm'

const SLUG_MAP: Record<string, string> = {
  ai: 'ai-kurs',
  dropshipping: 'dropshipping-kurs',
  'tiktok-creator': 'tiktok-creator',
  'youtube-creator': 'youtube-creator',
}

async function resolvePlanId(courseType: string, planType: string): Promise<string> {
  const productSlug = SLUG_MAP[courseType] || courseType
  try {
    const [plan] = await db
      .select({ id: plans.id })
      .from(plans)
      .innerJoin(products, eq(plans.productId, products.id))
      .where(and(eq(products.slug, productSlug), eq(plans.code, planType)))
      .limit(1)
    return plan?.id || ''
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    throw new Error(
      `Konnte Plan nicht auflösen (product=${productSlug}, plan=${planType}): ${msg}. ` +
      'Wurden die Tabellen erstellt (db:push) und der Seed ausgeführt?'
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, metadata, customerEmail } = body

    if (!amount || !currency) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Resolve plan IDs — support both single item and cart
    const cartItems: { course: string; plan: string }[] = body.cartItems || []
    let planIds: string[] = []

    if (cartItems.length > 0) {
      planIds = await Promise.all(cartItems.map((i) => resolvePlanId(i.course, i.plan)))
      planIds = planIds.filter(Boolean)
    } else {
      // Legacy single-item path
      let planId = metadata?.planId || ''
      if (!planId && metadata?.courseType && metadata?.planType) {
        planId = await resolvePlanId(metadata.courseType, metadata.planType)
      }
      if (planId) planIds = [planId]
    }

    // Save billing address
    if (user?.id && body.billingAddress) {
      const addr = body.billingAddress
      await db
        .update(customers)
        .set({
          billing: {
            street: addr.street || '',
            zipCode: addr.zipCode || '',
            city: addr.city || '',
            country: addr.country || 'Deutschland',
            companyName: addr.companyName || '',
            vatId: addr.vatId || '',
          },
          updatedAt: new Date(),
        })
        .where(eq(customers.uid, user.id))
    }

    const affiliateCode = request.cookies.get('affiliate_ref')?.value || null
    const totalAmount = calculateTotal(amount)

    const paymentIntent = await createPaymentIntent({
      amount: totalAmount,
      currency: currency || 'EUR',
      metadata: {
        ...metadata,
        customerUid: user?.id || '',
        planId: planIds[0] || '', // primary plan for backward compat
        planIds: JSON.stringify(planIds), // all plans
        affiliateCode: affiliateCode || '',
      },
      customerEmail: customerEmail || user?.email,
      description: `University Ecom - ${planIds.length} Produkt${planIds.length > 1 ? 'e' : ''}`,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
