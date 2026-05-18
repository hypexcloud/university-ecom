import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { affiliateLinks } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'
import { z } from 'zod'

const updateSchema = z.object({
  affiliateUid: z.string().uuid(),
  commissionRate: z.string(), // e.g. "0.1500"
})

export async function POST(request: NextRequest) {
  try {
    await requireAdmin('affiliate')
    const data = updateSchema.parse(await request.json())

    await db
      .update(affiliateLinks)
      .set({ commissionRate: data.commissionRate })
      .where(eq(affiliateLinks.customerUid, data.affiliateUid))

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
