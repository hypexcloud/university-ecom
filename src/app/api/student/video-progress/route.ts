import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { moduleProgress } from '@/lib/server/db/schema'
import { and, eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, resourceId, watchedSeconds, totalSeconds } = body

    if (!userId || !resourceId || watchedSeconds === undefined || totalSeconds === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const percentWatched = totalSeconds > 0 ? Math.round((watchedSeconds / totalSeconds) * 100) : 0
    const isCompleted = percentWatched >= 90

    // Upsert progress
    const [existing] = await db
      .select()
      .from(moduleProgress)
      .where(and(
        eq(moduleProgress.customerUid, userId),
        eq(moduleProgress.resourceId, resourceId),
      ))
      .limit(1)

    if (existing) {
      await db
        .update(moduleProgress)
        .set({
          progressPct: percentWatched,
          completed: isCompleted,
          completedAt: isCompleted ? new Date() : null,
          updatedAt: new Date(),
        })
        .where(eq(moduleProgress.id, existing.id))
    } else {
      await db.insert(moduleProgress).values({
        customerUid: userId,
        resourceId,
        progressPct: percentWatched,
        completed: isCompleted,
        completedAt: isCompleted ? new Date() : null,
      })
    }

    return NextResponse.json({ success: true, completed: isCompleted, percentWatched })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
