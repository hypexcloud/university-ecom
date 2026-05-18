import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { sessions, customers } from '@/lib/server/db/schema'
import { eq, desc } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { emitNotification } from '@/lib/server/notifications'
import { z } from 'zod'

export async function GET() {
  try {
    await requireAdmin('mentor')

    const result = await db
      .select({
        id: sessions.id,
        customerUid: sessions.customerUid,
        mentorUid: sessions.mentorUid,
        type: sessions.type,
        status: sessions.status,
        scheduledAt: sessions.scheduledAt,
        customerProposal: sessions.customerProposal,
        notes: sessions.notes,
        meetingUrl: sessions.meetingUrl,
        createdAt: sessions.createdAt,
        customerFirstName: customers.firstName,
        customerLastName: customers.lastName,
        customerEmail: customers.email,
      })
      .from(sessions)
      .innerJoin(customers, eq(sessions.customerUid, customers.uid))
      .orderBy(desc(sessions.scheduledAt))
      .limit(100)

    return NextResponse.json({ sessions: result })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const createSchema = z.object({
  customerUid: z.string().uuid(),
  scheduledAt: z.string().datetime(),
  type: z.enum(['zoom', 'meet', 'discord']),
  meetingUrl: z.string().url().optional(),
})

export async function POST(request: NextRequest) {
  try {
    if (!verifyCsrf(request)) {
      return NextResponse.json({ error: 'CSRF check failed' }, { status: 403 })
    }
    const admin = await requireAdmin('mentor')
    const data = createSchema.parse(await request.json())

    const [session] = await db.insert(sessions).values({
      customerUid: data.customerUid,
      mentorUid: admin.uid,
      type: data.type,
      status: 'pending',
      scheduledAt: new Date(data.scheduledAt),
      meetingUrl: data.meetingUrl || null,
    }).returning()

    await emitNotification({
      recipientUid: data.customerUid,
      event: 'appointment_created',
      title: 'Neuer Termin erstellt',
      body: `Ein ${data.type}-Termin wurde für dich am ${new Date(data.scheduledAt).toLocaleDateString('de-DE')} erstellt.`,
      link: '/student/termine',
    }).catch(() => {})

    return NextResponse.json({ success: true, session }, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ungültige Eingabedaten' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
