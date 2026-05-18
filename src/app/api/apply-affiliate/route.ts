import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { affiliateLinks, auditLog } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { nanoid } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    if (!verifyCsrf(request)) return NextResponse.json({ error: 'CSRF' }, { status: 403 })
    const user = await requireAuth()

    // Check if already an affiliate
    const [existing] = await db
      .select()
      .from(affiliateLinks)
      .where(eq(affiliateLinks.customerUid, user.uid))
      .limit(1)

    if (existing) {
      return NextResponse.json({ error: 'Du bist bereits Affiliate', code: existing.code }, { status: 400 })
    }

    const code = `AFF-${nanoid(8).toUpperCase()}`

    const [link] = await db.insert(affiliateLinks).values({
      customerUid: user.uid,
      code,
      commissionRate: '0.1500',
    }).returning()

    await db.insert(auditLog).values({
      actorUid: user.uid,
      action: 'affiliate.applied',
      targetType: 'affiliate_link',
      targetId: link.id,
    })

    return NextResponse.json({ success: true, code }, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
