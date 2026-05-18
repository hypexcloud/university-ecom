import { NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { sessions, customers } from '@/lib/server/db/schema'
import { eq, sql } from 'drizzle-orm'
import { requireMentor } from '@/lib/server/auth'

export async function GET() {
  try {
    const mentor = await requireMentor()

    // Get unique students assigned to this mentor
    const students = await db
      .selectDistinctOn([sessions.customerUid], {
        uid: sessions.customerUid,
        firstName: customers.firstName,
        lastName: customers.lastName,
        email: customers.email,
        discordUsername: customers.discordUsername,
        billing: customers.billing,
      })
      .from(sessions)
      .innerJoin(customers, eq(sessions.customerUid, customers.uid))
      .where(eq(sessions.mentorUid, mentor.uid))

    return NextResponse.json({ students })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
