import { NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { sessions, customers } from '@/lib/server/db/schema'
import { eq, desc } from 'drizzle-orm'
import { requireMentor } from '@/lib/server/auth'

export async function GET() {
  try {
    const mentor = await requireMentor()

    const result = await db
      .select({
        id: sessions.id,
        customerUid: sessions.customerUid,
        type: sessions.type,
        status: sessions.status,
        scheduledAt: sessions.scheduledAt,
        customerProposal: sessions.customerProposal,
        notes: sessions.notes,
        meetingUrl: sessions.meetingUrl,
        metadata: sessions.metadata,
        customerFirstName: customers.firstName,
        customerLastName: customers.lastName,
        customerEmail: customers.email,
      })
      .from(sessions)
      .innerJoin(customers, eq(sessions.customerUid, customers.uid))
      .where(eq(sessions.mentorUid, mentor.uid))
      .orderBy(desc(sessions.scheduledAt))
      .limit(100)

    return NextResponse.json({ sessions: result })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
