import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { availability } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const mentorUid = request.nextUrl.searchParams.get('coachId')

    if (!mentorUid) {
      return NextResponse.json({ error: 'Missing coachId' }, { status: 400 })
    }

    const slots = await db
      .select()
      .from(availability)
      .where(eq(availability.mentorUid, mentorUid))

    return NextResponse.json({ availability: slots.length > 0 ? slots : null })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
