import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { entitlements, auditLog } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin('customers')
    const body = await request.json()
    const { action } = body

    if (action === 'grant') {
      const { customerUid, planId } = body
      if (!customerUid || !planId) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
      }

      const [inserted] = await db.insert(entitlements).values({
        customerUid,
        planId,
      }).returning()

      await db.insert(auditLog).values({
        actorUid: admin.uid,
        action: 'entitlement.grant',
        targetType: 'entitlement',
        targetId: inserted.id,
        after: { customerUid, planId },
      })

      return NextResponse.json({ success: true, id: inserted.id })
    }

    if (action === 'revoke') {
      const { entitlementId } = body
      if (!entitlementId) {
        return NextResponse.json({ error: 'Missing entitlementId' }, { status: 400 })
      }

      await db
        .update(entitlements)
        .set({ revokedAt: new Date() })
        .where(eq(entitlements.id, entitlementId))

      await db.insert(auditLog).values({
        actorUid: admin.uid,
        action: 'entitlement.revoke',
        targetType: 'entitlement',
        targetId: entitlementId,
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    if (error instanceof Response) return error
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
