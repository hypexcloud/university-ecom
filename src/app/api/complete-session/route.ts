import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { sessions } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, status, completionNotes } = body

    if (!sessionId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await db
      .update(sessions)
      .set({
        status,
        notes: completionNotes || '',
        updatedAt: new Date(),
      })
      .where(eq(sessions.id, sessionId))

    return NextResponse.json({ success: true, message: 'Session updated successfully' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
