import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { customers, auditLog } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'

/**
 * DSGVO Art. 17 — Recht auf Löschung.
 * Customer requests account deletion → status = 'deletion_requested'.
 * Admin reviews (GoBD requires keeping orders/invoices for 10 years).
 * On approval: PII anonymized, entitlements revoked, auth user disabled.
 */
export async function POST(request: NextRequest) {
  try {
    if (!verifyCsrf(request)) {
      return NextResponse.json({ error: 'CSRF' }, { status: 403 })
    }
    const user = await requireAuth()

    // Mark as deletion_requested (admin reviews)
    await db
      .update(customers)
      .set({ status: 'deletion_requested', updatedAt: new Date() })
      .where(eq(customers.uid, user.uid))

    await db.insert(auditLog).values({
      actorUid: user.uid,
      action: 'account.deletion_requested',
      targetType: 'customer',
      targetId: user.uid,
    })

    return NextResponse.json({
      success: true,
      message: 'Löschungsantrag eingereicht. Wir bearbeiten Ihre Anfrage innerhalb von 30 Tagen.',
    })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
