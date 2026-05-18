import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { sessions } from '@/lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { emitNotification } from '@/lib/server/notifications'
import { z } from 'zod'

const actionSchema = z.object({
  action: z.enum(['accept', 'reject', 'propose']),
  proposedTime: z.string().datetime().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!verifyCsrf(request)) {
      return NextResponse.json({ error: 'CSRF check failed' }, { status: 403 })
    }
    const user = await requireAuth()
    const { id } = await params
    const data = actionSchema.parse(await request.json())

    const [session] = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.id, id), eq(sessions.customerUid, user.uid)))
      .limit(1)

    if (!session) {
      return NextResponse.json({ error: 'Session nicht gefunden' }, { status: 404 })
    }

    if (session.status !== 'pending') {
      return NextResponse.json({ error: 'Session kann nicht mehr geändert werden' }, { status: 400 })
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() }

    switch (data.action) {
      case 'accept':
        updates.status = 'accepted'
        break
      case 'reject':
        updates.status = 'rejected'
        break
      case 'propose':
        if (!data.proposedTime) {
          return NextResponse.json({ error: 'proposedTime erforderlich' }, { status: 400 })
        }
        updates.customerProposal = new Date(data.proposedTime)
        updates.status = 'pending' // stays pending, mentor sees proposal
        break
    }

    await db.update(sessions).set(updates).where(eq(sessions.id, id))

    // Notify mentor
    await emitNotification({
      recipientUid: session.mentorUid,
      event: 'appointment_updated',
      title: `Session ${data.action === 'accept' ? 'bestätigt' : data.action === 'reject' ? 'abgelehnt' : 'Alternativvorschlag'}`,
      body: `Kunde hat die Session am ${session.scheduledAt.toLocaleDateString('de-DE')} ${data.action === 'accept' ? 'bestätigt' : data.action === 'reject' ? 'abgelehnt' : 'einen neuen Termin vorgeschlagen'}.`,
      link: '/admin/termine',
    }).catch(() => {})

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ungültige Eingabedaten' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
