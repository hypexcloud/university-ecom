import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { affiliateLinks, affiliateReferrals, payouts, customers, auditLog } from '@/lib/server/db/schema'
import { eq, sql } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { z } from 'zod'

export async function GET() {
  try {
    await requireAdmin('affiliate')

    // Affiliates with approved (unpaid) earnings
    const pending = await db
      .select({
        affiliateUid: affiliateLinks.customerUid,
        code: affiliateLinks.code,
        email: customers.email,
        firstName: customers.firstName,
        lastName: customers.lastName,
        pendingCents: sql<number>`coalesce(sum(${affiliateReferrals.amountCents}) filter (where ${affiliateReferrals.status} = 'approved'), 0)`,
        approvedCount: sql<number>`count(*) filter (where ${affiliateReferrals.status} = 'approved')`,
      })
      .from(affiliateLinks)
      .innerJoin(customers, eq(affiliateLinks.customerUid, customers.uid))
      .leftJoin(affiliateReferrals, eq(affiliateReferrals.linkId, affiliateLinks.id))
      .groupBy(affiliateLinks.customerUid, affiliateLinks.code, customers.email, customers.firstName, customers.lastName)
      .having(sql`sum(${affiliateReferrals.amountCents}) filter (where ${affiliateReferrals.status} = 'approved') > 0`)

    return NextResponse.json({ affiliates: pending })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const payoutSchema = z.object({
  affiliateUid: z.string().uuid(),
  notes: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    if (!verifyCsrf(request)) {
      return NextResponse.json({ error: 'CSRF check failed' }, { status: 403 })
    }
    const admin = await requireAdmin('affiliate')
    const data = payoutSchema.parse(await request.json())

    // Get affiliate link
    const [link] = await db
      .select()
      .from(affiliateLinks)
      .where(eq(affiliateLinks.customerUid, data.affiliateUid))
      .limit(1)

    if (!link) {
      return NextResponse.json({ error: 'Affiliate nicht gefunden' }, { status: 404 })
    }

    // Sum approved referrals
    const [sum] = await db
      .select({ total: sql<number>`coalesce(sum(amount_cents), 0)` })
      .from(affiliateReferrals)
      .where(eq(affiliateReferrals.linkId, link.id))
      .where(eq(affiliateReferrals.status, 'approved'))

    const amount = Number(sum.total)
    if (amount <= 0) {
      return NextResponse.json({ error: 'Keine ausstehende Provision' }, { status: 400 })
    }

    // Create payout
    const [payout] = await db.insert(payouts).values({
      affiliateUid: data.affiliateUid,
      amountCents: amount,
      status: 'paid',
      paidAt: new Date(),
      notes: data.notes || null,
    }).returning()

    // Mark referrals as paid
    await db
      .update(affiliateReferrals)
      .set({ status: 'paid' })
      .where(eq(affiliateReferrals.linkId, link.id))
      .where(eq(affiliateReferrals.status, 'approved'))

    await db.insert(auditLog).values({
      actorUid: admin.uid,
      action: 'affiliate.payout',
      targetType: 'payout',
      targetId: payout.id,
      after: { affiliateUid: data.affiliateUid, amountCents: amount },
    })

    return NextResponse.json({ success: true, payout })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ungültige Eingabedaten' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
