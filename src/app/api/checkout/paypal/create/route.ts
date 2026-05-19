import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/server/db'
import { plans, products, customers } from '@/lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import { createPayPalOrder } from '@/lib/server/paypal'
import { z } from 'zod'

const bodySchema = z.object({
  planId: z.string().uuid().optional(),
  courseType: z.string().optional(),
  planType: z.string().optional(),
  billingAddress: z.object({
    street: z.string(),
    zipCode: z.string(),
    city: z.string(),
    country: z.string(),
    companyName: z.string().optional(),
    vatId: z.string().optional(),
  }).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const body = bodySchema.parse(await request.json())

    // Resolve plan
    let planId = body.planId || ''
    if (!planId && body.courseType && body.planType) {
      const slugMap: Record<string, string> = { ai: 'ai-kurs', dropshipping: 'dropshipping-kurs' }
      const productSlug = slugMap[body.courseType] || body.courseType

      const [plan] = await db
        .select({ id: plans.id })
        .from(plans)
        .innerJoin(products, eq(plans.productId, products.id))
        .where(and(eq(products.slug, productSlug), eq(plans.code, body.planType)))
        .limit(1)

      planId = plan?.id || ''
    }

    if (!planId) {
      return NextResponse.json({ error: 'Plan nicht gefunden' }, { status: 400 })
    }

    const [plan] = await db
      .select({ id: plans.id, priceCents: plans.priceCents, code: plans.code, productTitle: products.title })
      .from(plans)
      .innerJoin(products, eq(plans.productId, products.id))
      .where(eq(plans.id, planId))
      .limit(1)

    if (!plan) {
      return NextResponse.json({ error: 'Plan nicht gefunden' }, { status: 404 })
    }

    // Save billing address
    if (body.billingAddress) {
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

    const affiliateCode = request.cookies.get('affiliate_ref')?.value || ''

    // custom_id encodes our metadata as JSON (PayPal limit: 127 chars)
    const customId = JSON.stringify({
      uid: user.id,
      pid: planId,
      aff: affiliateCode,
    })

    const amountEur = (plan.priceCents / 100).toFixed(2)
    const description = `${plan.productTitle} — ${plan.code}`

    const order = await createPayPalOrder(amountEur, description, customId)

    return NextResponse.json({ orderId: order.id })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ungültige Eingabedaten' }, { status: 400 })
    }
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
