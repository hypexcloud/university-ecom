import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { moduleProgress, courseResources, courseWeeks, courseModules, courses, enrollments } from '@/lib/server/db/schema'
import { and, eq, sql, isNull } from 'drizzle-orm'
import { emitNotification } from '@/lib/server/notifications'

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
      if (existing.completed) {
        return NextResponse.json({ success: true, message: 'Already completed' })
      }
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

    // Check module + course completion in background (non-blocking)
    checkCompletionAndNotify(userId, resourceId).catch(() => {})

    return NextResponse.json({ success: true, message: 'Resource marked as completed' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/**
 * After marking a resource complete, check if the entire module is now done.
 * If so, send a "Wie war das Modul?" feedback notification.
 * Also check if the entire course is done → upsell notification.
 */
async function checkCompletionAndNotify(customerUid: string, resourceId: string) {
  // Find the module this resource belongs to
  const [resource] = await db
    .select({
      weekId: courseResources.weekId,
    })
    .from(courseResources)
    .where(eq(courseResources.id, resourceId))
    .limit(1)

  if (!resource) return

  const [week] = await db
    .select({ moduleId: courseWeeks.moduleId })
    .from(courseWeeks)
    .where(eq(courseWeeks.id, resource.weekId))
    .limit(1)

  if (!week) return

  const [module] = await db
    .select({ id: courseModules.id, title: courseModules.title, courseId: courseModules.courseId })
    .from(courseModules)
    .where(eq(courseModules.id, week.moduleId))
    .limit(1)

  if (!module) return

  // Count total resources in this module vs completed by this user
  const [counts] = await db
    .select({
      total: sql<number>`count(distinct ${courseResources.id})`,
      completed: sql<number>`count(distinct ${moduleProgress.resourceId})`,
    })
    .from(courseResources)
    .innerJoin(courseWeeks, eq(courseResources.weekId, courseWeeks.id))
    .leftJoin(
      moduleProgress,
      and(
        eq(moduleProgress.resourceId, courseResources.id),
        eq(moduleProgress.customerUid, customerUid),
        eq(moduleProgress.completed, true),
      ),
    )
    .where(eq(courseWeeks.moduleId, module.id))

  if (!counts || Number(counts.total) === 0) return

  // Module complete?
  if (Number(counts.completed) === Number(counts.total)) {
    await emitNotification({
      recipientUid: customerUid,
      event: 'module_completed',
      title: `Modul abgeschlossen: ${module.title}`,
      body: 'Wie war das Modul? Teile uns dein Feedback mit!',
      link: `/student/kurse/${module.courseId}?feedback=${module.id}`,
    })

    // Now check if the entire course is done
    await checkCourseCompletion(customerUid, module.courseId)
  }
}

/**
 * Check if all modules in a course are complete → upsell notification.
 */
async function checkCourseCompletion(customerUid: string, courseId: string) {
  // Count total resources in entire course vs completed
  const [counts] = await db
    .select({
      total: sql<number>`count(distinct ${courseResources.id})`,
      completed: sql<number>`count(distinct ${moduleProgress.resourceId})`,
    })
    .from(courseResources)
    .innerJoin(courseWeeks, eq(courseResources.weekId, courseWeeks.id))
    .innerJoin(courseModules, eq(courseWeeks.moduleId, courseModules.id))
    .leftJoin(
      moduleProgress,
      and(
        eq(moduleProgress.resourceId, courseResources.id),
        eq(moduleProgress.customerUid, customerUid),
        eq(moduleProgress.completed, true),
      ),
    )
    .where(eq(courseModules.courseId, courseId))

  if (!counts || Number(counts.total) === 0) return
  if (Number(counts.completed) < Number(counts.total)) return

  // Mark enrollment as completed
  await db
    .update(enrollments)
    .set({ completedAt: new Date() })
    .where(and(
      eq(enrollments.customerUid, customerUid),
      eq(enrollments.courseId, courseId),
      isNull(enrollments.completedAt),
    ))

  // Get course title for notification
  const [course] = await db
    .select({ title: courses.title })
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1)

  const courseTitle = course?.title || 'Kurs'

  // Congratulations + upsell notification
  await emitNotification({
    recipientUid: customerUid,
    event: 'course_completed',
    title: `Herzlichen Glückwunsch! ${courseTitle} abgeschlossen!`,
    body: 'Du hast alle Module abgeschlossen. Entdecke jetzt dein nächstes Level!',
    link: '/student/upgrade',
    sendEmail: true,
  })
}
