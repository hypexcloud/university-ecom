import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { tickets, ticketMessages } from '@/lib/server/db/schema'
import { eq, desc } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { z } from 'zod'

const CATEGORIES = [
  'support', 'hilfe', 'feedback', 'kursfrage',
  'affiliate', 'creator', 'technisches_problem',
] as const

const createSchema = z.object({
  category: z.enum(CATEGORIES),
  subject: z.string().min(1).max(200),
  body: z.string().min(1).max(5000),
})

export async function GET() {
  try {
    const user = await requireAuth()

    const result = await db
      .select()
      .from(tickets)
      .where(eq(tickets.customerUid, user.uid))
      .orderBy(desc(tickets.lastMessageAt))

    return NextResponse.json({ tickets: result })
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
    const body = createSchema.parse(await request.json())
    const now = new Date()

    const [ticket] = await db.insert(tickets).values({
      customerUid: user.uid,
      category: body.category,
      subject: body.subject,
      status: 'offen',
      lastMessageAt: now,
    }).returning()

    await db.insert(ticketMessages).values({
      ticketId: ticket.id,
      authorUid: user.uid,
      body: body.body,
    })

    return NextResponse.json({ success: true, ticket }, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ungültige Eingabedaten', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
