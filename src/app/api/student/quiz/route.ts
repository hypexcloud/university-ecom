import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { courseResources } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const quizId = request.nextUrl.searchParams.get('quizId')

    if (!quizId) {
      return NextResponse.json({ error: 'Quiz ID is required' }, { status: 400 })
    }

    // Quiz data is stored as metadata on course_resources with type='quiz'
    const [resource] = await db
      .select()
      .from(courseResources)
      .where(eq(courseResources.id, quizId))
      .limit(1)

    if (!resource || resource.type !== 'quiz') {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    return NextResponse.json({
      quiz: { id: resource.id, ...resource.metadata as Record<string, unknown> },
      attempts: [], // TODO: quiz attempts tracked via module_progress
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
