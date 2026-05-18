import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { sessions, auditLog } from '@/lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import { requireMentor } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { emitNotification } from '@/lib/server/notifications'
import { z } from 'zod'

const patchSchema = z.object({
  status: z.enum(['accepted', 'completed', 'missed', 'cancelled']).optional(),
  notes: z.string().optional(),
  meetingUrl: z.string().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!verifyCsrf(request)) return NextResponse.json({ error: 'CSRF' }, { status: 403 })
    const mentor = await requireMentor()
    const { id } = await params
    const data = patchSchema.parse(await request.json())

    const [session] = await db.select().from(sessions)
      .where(and(eq(sessions.id, id), eq(sessions.mentorUid, mentor.uid)))
      .limit(1)

    if (!session) return NextResponse.json({ error: 'Session nicht gefunden' }, { status: 404 })

    const updates: Record<string, unknown> = { updatedAt: new Date() }
    if (data.status) updates.status = data.status
    if (data.notes !== undefined) updates.notes = data.notes
    if (data.meetingUrl) updates.meetingUrl = data.meetingUrl

    await db.update(sessions).set(updates).where(eq(sessions.id, id))

    await db.insert(auditLog).values({
      actorUid: mentor.uid,
      action: 'session.mentor_update',
      targetType: 'session',
      targetId: id,
      before: { status: session.status },
      after: updates,
    })

    if (data.status) {
      await emitNotification({
        recipientUid: session.customerUid,
        event: 'appointment_updated',
        title: `Termin ${data.status === 'accepted' ? 'bestätigt' : data.status === 'completed' ? 'abgeschlossen' : 'aktualisiert'}`,
        link: `/student/termine/${id}`,
      }).catch(() => {})
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
