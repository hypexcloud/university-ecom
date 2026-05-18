import { NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import {
  customers, orders, entitlements, tickets, sessions,
  notifications, enrollments, moduleProgress, consentLog,
} from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'

/**
 * DSGVO Art. 15 — Auskunftsrecht / Data Export.
 * Returns all personal data as JSON download.
 */
export async function GET() {
  try {
    const user = await requireAuth()
    const uid = user.uid

    const [profile] = await db.select().from(customers).where(eq(customers.uid, uid))
    const userOrders = await db.select().from(orders).where(eq(orders.customerUid, uid))
    const userEntitlements = await db.select().from(entitlements).where(eq(entitlements.customerUid, uid))
    const userTickets = await db.select().from(tickets).where(eq(tickets.customerUid, uid))
    const userSessions = await db.select().from(sessions).where(eq(sessions.customerUid, uid))
    const userNotifications = await db.select().from(notifications).where(eq(notifications.recipientUid, uid))
    const userEnrollments = await db.select().from(enrollments).where(eq(enrollments.customerUid, uid))
    const userProgress = await db.select().from(moduleProgress).where(eq(moduleProgress.customerUid, uid))
    const userConsent = await db.select().from(consentLog).where(eq(consentLog.customerUid, uid))

    const exportData = {
      exportedAt: new Date().toISOString(),
      profile: {
        uid: profile.uid,
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        discordUsername: profile.discordUsername,
        whatsapp: profile.whatsapp,
        status: profile.status,
        billing: profile.billing,
        createdAt: profile.createdAt,
      },
      orders: userOrders,
      entitlements: userEntitlements,
      tickets: userTickets,
      sessions: userSessions,
      notifications: userNotifications,
      enrollments: userEnrollments,
      progress: userProgress,
      consentLog: userConsent,
    }

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="daten-export-${uid}.json"`,
      },
    })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
