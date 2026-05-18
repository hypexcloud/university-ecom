import { NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { affiliateLinks, affiliateReferrals, customers } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const links = await db
      .select({
        id: affiliateLinks.id,
        code: affiliateLinks.code,
        commissionRate: affiliateLinks.commissionRate,
        createdAt: affiliateLinks.createdAt,
        customerUid: affiliateLinks.customerUid,
        email: customers.email,
        firstName: customers.firstName,
        lastName: customers.lastName,
      })
      .from(affiliateLinks)
      .innerJoin(customers, eq(affiliateLinks.customerUid, customers.uid))

    const referrals = await db.select().from(affiliateReferrals)

    return NextResponse.json({ affiliates: links, referrals })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
