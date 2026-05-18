import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { entitlements, plans, products } from '@/lib/server/db/schema'
import { eq, and, isNull } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { createPaymentIntent } from '@/lib/stripe-server'
import { z } from 'zod'

const upgradeSchema = z.object({
  targetPlanId: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  try {
    if (!verifyCsrf(request)) {
      return NextResponse.json({ error: 'CSRF check failed' }, { status: 403 })
    }
    const user = await requireAuth()
    const { targetPlanId } = upgradeSchema.parse(await request.json())

    // Get target plan + product
    const [targetPlan] = await db
      .select({ id: plans.id, priceCents: plans.priceCents, productId: plans.productId, code: plans.code })
      .from(plans)
      .where(eq(plans.id, targetPlanId))
      .limit(1)

    if (!targetPlan) {
      return NextResponse.json({ error: 'Plan nicht gefunden' }, { status: 404 })
    }

    // Find current active entitlement for same product
    const currentEntitlement = await db
      .select({
        id: entitlements.id,
        planId: entitlements.planId,
        planPriceCents: plans.priceCents,
        planCode: plans.code,
      })
      .from(entitlements)
      .innerJoin(plans, eq(entitlements.planId, plans.id))
      .where(and(
        eq(entitlements.customerUid, user.uid),
        eq(plans.productId, targetPlan.productId),
        isNull(entitlements.revokedAt),
      ))
      .limit(1)

    if (!currentEntitlement[0]) {
      return NextResponse.json({ error: 'Kein aktuelles Produkt für Upgrade gefunden' }, { status: 400 })
    }

    const current = currentEntitlement[0]

    // Validate upgrade direction (price must increase)
    if (targetPlan.priceCents <= current.planPriceCents) {
      return NextResponse.json({ error: 'Upgrade nur auf höheren Plan möglich' }, { status: 400 })
    }

    const deltaCents = targetPlan.priceCents - current.planPriceCents

    // Create PaymentIntent for the difference
    const paymentIntent = await createPaymentIntent({
      amount: deltaCents / 100, // stripe-server multiplies by 100 internally
      currency: 'EUR',
      metadata: {
        customerUid: user.uid,
        planId: targetPlanId,
        isUpgrade: 'true',
        upgradeFromPlanId: current.planId,
      },
      customerEmail: user.email,
      description: `Upgrade: ${current.planCode} → ${targetPlan.code}`,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      deltaCents,
      fromPlan: current.planCode,
      toPlan: targetPlan.code,
    })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ungültige Eingabedaten' }, { status: 400 })
    }
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
