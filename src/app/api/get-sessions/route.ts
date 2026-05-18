import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { sessions } from '@/lib/server/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const coachId = searchParams.get('coachId')

    if (!userId && !coachId) {
      return NextResponse.json({ error: 'Missing userId or coachId' }, { status: 400 })
    }

    const result = await db
      .select()
      .from(sessions)
      .where(
        coachId
          ? eq(sessions.mentorUid, coachId)
          : eq(sessions.customerUid, userId!),
      )
      .orderBy(desc(sessions.scheduledAt))

    return NextResponse.json({ sessions: result })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
