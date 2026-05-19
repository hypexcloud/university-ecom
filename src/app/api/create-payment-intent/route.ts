import { NextRequest, NextResponse } from 'next/server'
import { createPaymentIntent } from '@/lib/stripe-server'
import { createClient } from '@/lib/supabase/server'
import { calculateTotal } from '@/lib/stripe'
import { db } from '@/lib/server/db'
import { plans, products, customers } from '@/lib/server/db/schema'
import { eq, and } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, metadata, customerEmail } = body

    if (!amount || !currency) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get authenticated user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Resolve plan UUID from courseType + planType
    let planId = metadata?.planId || ''
    if (!planId && metadata?.courseType && metadata?.planType) {
      // Map courseType to product slug: 'ai' → 'ai-kurs', 'dropshipping' → 'dropshipping-kurs'
      const slugMap: Record<string, string> = { ai: 'ai-kurs', dropshipping: 'dropshipping-kurs' }
      const productSlug = slugMap[metadata.courseType] || metadata.courseType

      const [plan] = await db
        .select({ id: plans.id })
        .from(plans)
        .innerJoin(products, eq(plans.productId, products.id))
        .where(and(eq(products.slug, productSlug), eq(plans.code, metadata.planType)))
        .limit(1)

      planId = plan?.id || ''
    }

    // Save billing address to customer record
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

    // Read affiliate cookie
    const affiliateCode = request.cookies.get('affiliate_ref')?.value || null

    const totalAmount = calculateTotal(amount)

    const paymentIntent = await createPaymentIntent({
      amount: totalAmount,
      currency: currency || 'EUR',
      metadata: {
        ...metadata,
        customerUid: user?.id || '',
        planId,
        affiliateCode: affiliateCode || '',
      },
      customerEmail: customerEmail || user?.email,
      description: `University Ecom - ${metadata?.courseName || 'Kurs'} - ${metadata?.planName || 'Plan'}`,
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
