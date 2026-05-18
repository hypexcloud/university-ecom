import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { entitlements, auditLog } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { emitNotification } from '@/lib/server/notifications'
import { z } from 'zod'

const bodySchema = z.object({
  action: z.enum(['grant', 'revoke']),
  customerUid: z.string().min(1).optional(),
  planId: z.string().min(1).optional(),
  entitlementId: z.string().min(1).optional(),
})

export async function POST(request: NextRequest) {
  try {
    if (!verifyCsrf(request)) {
      return NextResponse.json({ error: 'CSRF check failed' }, { status: 403 })
    }
    const admin = await requireAdmin('customers')
    const raw = await request.json()
    const body = bodySchema.parse(raw)

    if (body.action === 'grant') {
      if (!body.customerUid || !body.planId) {
        return NextResponse.json({ error: 'customerUid und planId erforderlich' }, { status: 400 })
      }
      const [inserted] = await db.insert(entitlements).values({
        customerUid: body.customerUid,
        planId: body.planId,
      }).returning()

      await db.insert(auditLog).values({
        actorUid: admin.uid,
        action: 'entitlement.grant',
        targetType: 'entitlement',
        targetId: inserted.id,
        after: { customerUid: body.customerUid, planId: body.planId },
      })

      await emitNotification({
        recipientUid: body.customerUid,
        event: 'entitlement_granted',
        title: 'Neuer Zugang freigeschaltet',
        body: 'Ein neues Produkt wurde für dich freigeschaltet.',
        link: '/student',
      }).catch(() => {})

      return NextResponse.json({ success: true, id: inserted.id })
    }

    // action === 'revoke'
    if (!body.entitlementId) {
      return NextResponse.json({ error: 'entitlementId erforderlich' }, { status: 400 })
    }
    await db
      .update(entitlements)
      .set({ revokedAt: new Date() })
      .where(eq(entitlements.id, body.entitlementId))

    await db.insert(auditLog).values({
      actorUid: admin.uid,
      action: 'entitlement.revoke',
      targetType: 'entitlement',
      targetId: body.entitlementId,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ungültige Eingabedaten', details: error.issues }, { status: 400 })
    }
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
