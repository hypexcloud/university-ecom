import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { moduleProgress, enrollments } from '@/lib/server/db/schema'
import { and, eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    const enrollmentId = request.nextUrl.searchParams.get('enrollmentId')

    if (!userId || !enrollmentId) {
      return NextResponse.json(
        { error: 'User ID and enrollment ID are required' },
        { status: 400 },
      )
    }

    // Verify enrollment exists
    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(and(
        eq(enrollments.id, enrollmentId),
        eq(enrollments.customerUid, userId),
      ))
      .limit(1)

    if (!enrollment) {
      return NextResponse.json({ progress: null })
    }

    // Get all progress for this user
    const progress = await db
      .select()
      .from(moduleProgress)
      .where(eq(moduleProgress.customerUid, userId))

    return NextResponse.json({ progress, enrollment })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
