import { NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { affiliateLinks, affiliateReferrals, customers } from '@/lib/server/db/schema'
import { eq, sql, gte, and } from 'drizzle-orm'

export async function GET() {
  try {
    // Current month boundaries (Berlin time)
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const leaderboard = await db
      .select({
        username: customers.discordUsername,
        firstName: customers.firstName,
        referralCount: sql<number>`count(${affiliateReferrals.id})`,
      })
      .from(affiliateReferrals)
      .innerJoin(affiliateLinks, eq(affiliateReferrals.linkId, affiliateLinks.id))
      .innerJoin(customers, eq(affiliateLinks.customerUid, customers.uid))
      .where(and(
        gte(affiliateReferrals.createdAt, monthStart),
        eq(affiliateReferrals.status, 'approved'),
      ))
      .groupBy(customers.uid, customers.discordUsername, customers.firstName)
      .orderBy(sql`count(${affiliateReferrals.id}) desc`)
      .limit(20)

    // Display username (Discord preferred) or first name initial — no real names
    const ranked = leaderboard.map((row, i) => ({
      rank: i + 1,
      displayName: row.username || `${row.firstName?.charAt(0) || '?'}***`,
      referrals: Number(row.referralCount),
    }))

    return NextResponse.json({
      month: `${now.toLocaleString('de-DE', { month: 'long' })} ${now.getFullYear()}`,
      leaderboard: ranked,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
