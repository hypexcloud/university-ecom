import { NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { customers, entitlements, plans, sessions } from '@/lib/server/db/schema'
import { eq, and, isNull, inArray, gte } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'

/**
 * Clears the mustChangePassword flag after a successful password change.
 * Returns the next redirect destination (booking page for business/infinity, or dashboard).
 */
export async function POST() {
  const user = await requireAuth()

  // Clear the flag
  await db
    .update(customers)
    .set({ mustChangePassword: false, updatedAt: new Date() })
    .where(eq(customers.uid, user.uid))

  // Determine next redirect (same logic as getStudentRedirect in /api/auth/role)
  const redirect = await getPostPasswordRedirect(user.uid)

  return NextResponse.json({ success: true, redirect })
}

async function getPostPasswordRedirect(uid: string): Promise<string> {
  try {
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

    // Check for upcoming sessions
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
