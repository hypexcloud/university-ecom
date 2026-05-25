import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/server/db'
import { adminPermissions, mentors, entitlements, plans, sessions, customers } from '@/lib/server/db/schema'
import { eq, and, isNull, inArray, gte } from 'drizzle-orm'

/**
 * Returns the user's primary role for post-login redirect.
 * Priority: admin > mentor > student
 *
 * Students with business/infinity plans who have no upcoming sessions
 * are redirected to the booking page so they can schedule a mentor session.
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ role: 'guest', redirect: '/login' })
    }

    // Check admin
    const [admin] = await db
      .select()
      .from(adminPermissions)
      .where(eq(adminPermissions.uid, user.id))
      .limit(1)

    if (admin) {
      return NextResponse.json({ role: 'admin', redirect: '/admin' })
    }

    // Check mentor
    const [mentor] = await db
      .select()
      .from(mentors)
      .where(eq(mentors.uid, user.id))
      .limit(1)

    if (mentor?.isActive) {
      return NextResponse.json({ role: 'mentor', redirect: '/mentor' })
    }

    // Check if student must change their temp password first
    const [customer] = await db
      .select({ mustChangePassword: customers.mustChangePassword })
      .from(customers)
      .where(eq(customers.uid, user.id))
      .limit(1)

    if (customer?.mustChangePassword) {
      return NextResponse.json({ role: 'student', redirect: '/student/profil/sicherheit', mustChangePassword: true })
    }

    // Student — check if they have business/infinity and need to book a session
    const redirect = await getStudentRedirect(user.id)

    return NextResponse.json({ role: 'student', redirect })
  } catch {
    return NextResponse.json({ role: 'student', redirect: '/student' })
  }
}

/**
 * If student has an active business or infinity entitlement but no upcoming
 * sessions, redirect them to the booking page.
 */
async function getStudentRedirect(uid: string): Promise<string> {
  try {
    // Get active entitlements with plan codes
    const activeEntitlements = await db
      .select({ planCode: plans.code })
      .from(entitlements)
      .innerJoin(plans, eq(entitlements.planId, plans.id))
      .where(and(
        eq(entitlements.customerUid, uid),
        isNull(entitlements.revokedAt),
      ))

    const planCodes = activeEntitlements.map(e => e.planCode)
    const hasMentorPlan = planCodes.some(code => code === 'business' || code === 'infinity')

    if (!hasMentorPlan) {
      return '/student'
    }

    // Check for upcoming sessions (pending or accepted, scheduled in the future)
    const [upcomingSession] = await db
      .select({ id: sessions.id })
      .from(sessions)
      .where(and(
        eq(sessions.customerUid, uid),
        inArray(sessions.status, ['pending', 'accepted']),
        gte(sessions.scheduledAt, new Date()),
      ))
      .limit(1)

    if (upcomingSession) {
      return '/student'
    }

    // Has business/infinity but no upcoming session — redirect to booking
    return '/student/termine/buchen'
  } catch {
    return '/student'
  }
}
