import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { courseModules, courses, entitlements, plans, products } from '@/lib/server/db/schema'
import { eq, and, isNull, asc } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const courseId = request.nextUrl.searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.json({ error: 'courseId required' }, { status: 400 })
    }

    // Verify enrollment
    const [course] = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1)
    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })

    const enrolled = await db
      .select()
      .from(entitlements)
      .innerJoin(plans, eq(entitlements.planId, plans.id))
      .where(and(
        eq(entitlements.customerUid, user.uid),
        eq(plans.productId, course.productId),
        isNull(entitlements.revokedAt),
      ))
      .limit(1)

    if (enrolled.length === 0) {
      return NextResponse.json({ error: 'Kein Zugang' }, { status: 403 })
    }

    const modules = await db
      .select()
      .from(courseModules)
      .where(and(eq(courseModules.courseId, courseId), eq(courseModules.isActive, true)))
      .orderBy(asc(courseModules.orderIndex))

    return NextResponse.json({ modules })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
