import { db } from '@/lib/server/db'
import { sessions, customers, entitlements, plans } from '@/lib/server/db/schema'
import { eq, and, isNull, desc } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { SessionCalendar, type CalendarSession } from '@/components/dashboard/session-calendar'

export default async function TerminePage() {
  const user = await requireAuth()

  // Check if user has a 1:1 plan
  const userPlans = await db
    .select({ code: plans.code })
    .from(entitlements)
    .innerJoin(plans, eq(entitlements.planId, plans.id))
    .where(and(eq(entitlements.customerUid, user.uid), isNull(entitlements.revokedAt)))
  const canBook = userPlans.some((p) => ['business', 'infinity', 'tiktok', 'youtube'].includes(p.code))

  const allSessions = await db
    .select({
      id: sessions.id,
      type: sessions.type,
      status: sessions.status,
      scheduledAt: sessions.scheduledAt,
      meetingUrl: sessions.meetingUrl,
      customerProposal: sessions.customerProposal,
      mentorFirstName: customers.firstName,
      mentorLastName: customers.lastName,
    })
    .from(sessions)
    .innerJoin(customers, eq(sessions.mentorUid, customers.uid))
    .where(eq(sessions.customerUid, user.uid))
    .orderBy(desc(sessions.scheduledAt))

  const calendarSessions: CalendarSession[] = allSessions.map((s) => ({
    id: s.id,
    scheduledAt: s.scheduledAt.toISOString(),
    status: s.status,
    type: s.type,
    meetingUrl: s.meetingUrl,
    customerProposal: s.customerProposal?.toISOString() ?? null,
    mentorFirstName: s.mentorFirstName ?? undefined,
    mentorLastName: s.mentorLastName ?? undefined,
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Meine Termine</h1>
      <SessionCalendar
        sessions={calendarSessions}
        mode="student"
        canBook={canBook}
        bookingHref="/student/termine/buchen"
      />
    </div>
  )
}
