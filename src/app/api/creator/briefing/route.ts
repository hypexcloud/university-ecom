import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { customers } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { z } from 'zod'

const briefingSchema = z.object({
  vorname: z.string().min(1),
  nachname: z.string().min(1),
  socialLink: z.string().url(),
  nische: z.string().min(1),
  follower: z.string(),
  views: z.string(),
  ziele: z.string().min(1),
  probleme: z.string().min(1),
  erfahrungen: z.string().min(1),
  fileUrl: z.string().url().optional(),
})

export async function GET() {
  try {
    const user = await requireAuth()

    const [customer] = await db
      .select({ billing: customers.billing })
      .from(customers)
      .where(eq(customers.uid, user.uid))
      .limit(1)

    // Briefing stored in customers.billing.creatorBriefing (JSONB)
    const briefing = (customer?.billing as Record<string, unknown>)?.creatorBriefing || null

    return NextResponse.json({ briefing })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyCsrf(request)) {
      return NextResponse.json({ error: 'CSRF check failed' }, { status: 403 })
    }
    const user = await requireAuth()
    const data = briefingSchema.parse(await request.json())

    // Store briefing in customers.billing JSONB
    const [customer] = await db
      .select({ billing: customers.billing })
      .from(customers)
      .where(eq(customers.uid, user.uid))
      .limit(1)

    const currentBilling = (customer?.billing as Record<string, unknown>) || {}

    await db.update(customers).set({
      billing: {
        ...currentBilling,
        creatorBriefing: { ...data, submittedAt: new Date().toISOString() },
      },
      updatedAt: new Date(),
    }).where(eq(customers.uid, user.uid))

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ungültige Eingabedaten', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
