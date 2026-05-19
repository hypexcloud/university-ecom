import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { plans, products, entitlements } from '@/lib/server/db/schema'
import { eq, and, isNull, gt } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()

    const productSlug = request.nextUrl.searchParams.get('product') || ''
    const currentPlanCode = request.nextUrl.searchParams.get('current') || ''

    // Find the product
    const [product] = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, productSlug))
      .limit(1)

    if (!product) return NextResponse.json({ options: [] })

    // Get current plan price
    const [currentPlan] = await db
      .select({ id: plans.id, priceCents: plans.priceCents })
      .from(plans)
      .where(and(eq(plans.productId, product.id), eq(plans.code, currentPlanCode)))
      .limit(1)

    if (!currentPlan) return NextResponse.json({ options: [] })

    // Get higher plans
    const higherPlans = await db
      .select({ id: plans.id, code: plans.code, priceCents: plans.priceCents, productTitle: products.title })
      .from(plans)
      .innerJoin(products, eq(plans.productId, products.id))
      .where(and(eq(plans.productId, product.id), gt(plans.priceCents, currentPlan.priceCents)))

    const options = higherPlans.map((p) => ({
      planId: p.id,
      planCode: p.code,
      productTitle: p.productTitle,
      priceCents: p.priceCents - currentPlan.priceCents, // delta
    }))

    return NextResponse.json({ options })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ options: [] })
  }
}
