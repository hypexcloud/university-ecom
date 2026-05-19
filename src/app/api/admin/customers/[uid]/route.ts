import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { customers, auditLog } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { z } from 'zod'

const patchSchema = z.object({
  status: z.enum(['active', 'suspended']).optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> },
) {
  try {
    if (!verifyCsrf(request)) {
      return NextResponse.json({ error: 'CSRF check failed' }, { status: 403 })
    }
    const admin = await requireAdmin('customers')
    const { uid } = await params
    const data = patchSchema.parse(await request.json())

    const [before] = await db.select().from(customers).where(eq(customers.uid, uid)).limit(1)
    if (!before) {
      return NextResponse.json({ error: 'Kunde nicht gefunden' }, { status: 404 })
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() }
    if (data.status) updates.status = data.status

    await db.update(customers).set(updates).where(eq(customers.uid, uid))

    await db.insert(auditLog).values({
      actorUid: admin.uid,
      action: data.status === 'suspended' ? 'customer.suspended' : 'customer.reactivated',
      targetType: 'customer',
      targetId: uid,
      before: { status: before.status },
      after: updates,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ungültige Eingabedaten' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
