import { NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { entitlements, plans, products, affiliateLinks, giftcards } from '@/lib/server/db/schema'
import { eq, and, isNull, gt } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'

export async function GET() {
  try {
    const user = await requireAuth()

    const active = await db
      .select({ planCode: plans.code, productKind: products.kind })
      .from(entitlements)
      .innerJoin(plans, eq(entitlements.planId, plans.id))
      .innerJoin(products, eq(plans.productId, products.id))
      .where(and(eq(entitlements.customerUid, user.uid), isNull(entitlements.revokedAt)))

    const planCodes = active.map((a) => a.planCode)
    const productKinds = active.map((a) => a.productKind)

    const [affiliate] = await db
      .select({ id: affiliateLinks.id })
      .from(affiliateLinks)
      .where(eq(affiliateLinks.customerUid, user.uid))
      .limit(1)

    const [gc] = await db
      .select({ id: giftcards.id })
      .from(giftcards)
      .where(and(eq(giftcards.buyerUid, user.uid), eq(giftcards.status, 'active'), gt(giftcards.balanceCents, 0)))
      .limit(1)

    return NextResponse.json({
      hasCourseEntitlement: productKinds.includes('course'),
      hasBusinessOrInfinity: planCodes.includes('business') || planCodes.includes('infinity'),
      hasCreatorEntitlement: productKinds.includes('creator'),
      isAffiliate: !!affiliate,
      hasGiftcards: !!gc,
    })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({}, { status: 500 })
  }
}
