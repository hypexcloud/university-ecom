import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { moduleProgress } from '@/lib/server/db/schema'
import { and, eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, resourceId } = body

    if (!userId || !resourceId) {
      return NextResponse.json({ error: 'userId and resourceId are required' }, { status: 400 })
    }

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
        .set({ completed: true, progressPct: 100, completedAt: new Date(), updatedAt: new Date() })
        .where(eq(moduleProgress.id, existing.id))
    } else {
      await db.insert(moduleProgress).values({
        customerUid: userId,
        resourceId,
        completed: true,
        progressPct: 100,
        completedAt: new Date(),
      })
    }

    return NextResponse.json({ success: true, message: 'Resource marked as completed' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
