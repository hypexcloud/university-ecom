import { NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { affiliateLinks, affiliateReferrals } from '@/lib/server/db/schema'
import { eq, sql, and } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'

export async function GET() {
  try {
    const user = await requireAuth()

    const [link] = await db
      .select()
      .from(affiliateLinks)
      .where(eq(affiliateLinks.customerUid, user.uid))
      .limit(1)

    if (!link) {
      return NextResponse.json({ isAffiliate: false })
    }

    // Get stats
    const [stats] = await db
      .select({
        totalReferrals: sql<number>`count(*)`,
        approvedCount: sql<number>`count(*) filter (where status = 'approved')`,
        paidCount: sql<number>`count(*) filter (where status = 'paid')`,
        pendingCents: sql<number>`coalesce(sum(amount_cents) filter (where status = 'approved'), 0)`,
        paidCents: sql<number>`coalesce(sum(amount_cents) filter (where status = 'paid'), 0)`,
      })
      .from(affiliateReferrals)
      .where(eq(affiliateReferrals.linkId, link.id))

    // Recent referrals
    const referrals = await db
      .select()
      .from(affiliateReferrals)
      .where(eq(affiliateReferrals.linkId, link.id))
      .orderBy(sql`created_at desc`)
      .limit(20)

    return NextResponse.json({
      isAffiliate: true,
      code: link.code,
      commissionRate: link.commissionRate,
      stats: {
        totalReferrals: Number(stats.totalReferrals),
        approvedCount: Number(stats.approvedCount),
        paidCount: Number(stats.paidCount),
        pendingCents: Number(stats.pendingCents),
        paidCents: Number(stats.paidCents),
      },
      referrals,
    })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
