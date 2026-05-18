import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { moduleProgress } from '@/lib/server/db/schema'
import { and, eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { quizId, userId, answers } = body

    if (!quizId || !userId || !answers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // TODO: Proper quiz grading logic — for now score = number of answers provided
    const score = Array.isArray(answers) ? answers.length : 0

    const [existing] = await db
      .select()
      .from(moduleProgress)
      .where(and(
        eq(moduleProgress.customerUid, userId),
        eq(moduleProgress.resourceId, quizId),
      ))
      .limit(1)

    if (existing) {
      await db
        .update(moduleProgress)
        .set({ quizScore: score, completed: true, completedAt: new Date(), updatedAt: new Date() })
        .where(eq(moduleProgress.id, existing.id))
    } else {
      await db.insert(moduleProgress).values({
        customerUid: userId,
        resourceId: quizId,
        quizScore: score,
        completed: true,
        completedAt: new Date(),
      })
    }

    return NextResponse.json({ success: true, attempt: { score, passed: true } })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
