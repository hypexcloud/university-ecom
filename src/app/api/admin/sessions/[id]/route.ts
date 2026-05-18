import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { sessions, auditLog } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { z } from 'zod'

const patchSchema = z.object({
  status: z.enum(['pending', 'accepted', 'rejected', 'completed', 'missed', 'cancelled']).optional(),
  notes: z.string().optional(),
  meetingUrl: z.string().url().optional(),
  scheduledAt: z.string().datetime().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!verifyCsrf(request)) {
      return NextResponse.json({ error: 'CSRF check failed' }, { status: 403 })
    }
    const admin = await requireAdmin('customers')
    const { id } = await params
    const data = patchSchema.parse(await request.json())

    const [before] = await db.select().from(sessions).where(eq(sessions.id, id)).limit(1)
    if (!before) {
      return NextResponse.json({ error: 'Session nicht gefunden' }, { status: 404 })
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() }
    if (data.status) updates.status = data.status
    if (data.notes !== undefined) updates.notes = data.notes
    if (data.meetingUrl) updates.meetingUrl = data.meetingUrl
    if (data.scheduledAt) updates.scheduledAt = new Date(data.scheduledAt)

    await db.update(sessions).set(updates).where(eq(sessions.id, id))

    await db.insert(auditLog).values({
      actorUid: admin.uid,
      action: 'session.update',
      targetType: 'session',
      targetId: id,
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
