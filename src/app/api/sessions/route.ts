import { NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { sessions, customers } from '@/lib/server/db/schema'
import { eq, desc } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'

export async function GET() {
  try {
    const user = await requireAuth()

    const result = await db
      .select({
        id: sessions.id,
        type: sessions.type,
        status: sessions.status,
        scheduledAt: sessions.scheduledAt,
        notes: sessions.notes,
        meetingUrl: sessions.meetingUrl,
        customerProposal: sessions.customerProposal,
        mentorUid: sessions.mentorUid,
        mentorFirstName: customers.firstName,
        mentorLastName: customers.lastName,
        createdAt: sessions.createdAt,
      })
      .from(sessions)
      .innerJoin(customers, eq(sessions.mentorUid, customers.uid))
      .where(eq(sessions.customerUid, user.uid))
      .orderBy(desc(sessions.scheduledAt))

    return NextResponse.json({ sessions: result })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
