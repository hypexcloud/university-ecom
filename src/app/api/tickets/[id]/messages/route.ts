import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { tickets, ticketMessages } from '@/lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { z } from 'zod'

const messageSchema = z.object({
  body: z.string().min(1).max(5000),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!verifyCsrf(request)) {
      return NextResponse.json({ error: 'CSRF check failed' }, { status: 403 })
    }
    const user = await requireAuth()
    const { id } = await params
    const data = messageSchema.parse(await request.json())

    // Verify ticket belongs to user
    const [ticket] = await db
      .select()
      .from(tickets)
      .where(and(eq(tickets.id, id), eq(tickets.customerUid, user.uid)))
      .limit(1)

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket nicht gefunden' }, { status: 404 })
    }

    if (ticket.status === 'geschlossen') {
      return NextResponse.json({ error: 'Ticket ist geschlossen' }, { status: 400 })
    }

    const [message] = await db.insert(ticketMessages).values({
      ticketId: id,
      authorUid: user.uid,
      body: data.body,
      isInternal: false,
    }).returning()

    await db.update(tickets).set({ lastMessageAt: new Date() }).where(eq(tickets.id, id))

    return NextResponse.json({ success: true, message }, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ungültige Eingabedaten' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
