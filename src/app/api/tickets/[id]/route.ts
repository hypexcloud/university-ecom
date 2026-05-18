import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { tickets, ticketMessages, customers } from '@/lib/server/db/schema'
import { eq, and, asc } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth()
    const { id } = await params

    const [ticket] = await db
      .select()
      .from(tickets)
      .where(and(eq(tickets.id, id), eq(tickets.customerUid, user.uid)))
      .limit(1)

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket nicht gefunden' }, { status: 404 })
    }

    // Get messages — exclude internal messages for customers
    const messages = await db
      .select({
        id: ticketMessages.id,
        body: ticketMessages.body,
        authorUid: ticketMessages.authorUid,
        createdAt: ticketMessages.createdAt,
        authorName: customers.firstName,
      })
      .from(ticketMessages)
      .innerJoin(customers, eq(ticketMessages.authorUid, customers.uid))
      .where(and(
        eq(ticketMessages.ticketId, id),
        eq(ticketMessages.isInternal, false),
      ))
      .orderBy(asc(ticketMessages.createdAt))

    return NextResponse.json({ ticket, messages })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
