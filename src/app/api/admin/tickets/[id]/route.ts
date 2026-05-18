import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { tickets, ticketMessages, customers, auditLog } from '@/lib/server/db/schema'
import { eq, asc } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { z } from 'zod'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin('tickets')
    const { id } = await params

    const [ticket] = await db
      .select({
        id: tickets.id,
        category: tickets.category,
        subject: tickets.subject,
        status: tickets.status,
        assigneeUid: tickets.assigneeUid,
        lastMessageAt: tickets.lastMessageAt,
        createdAt: tickets.createdAt,
        customerUid: tickets.customerUid,
        customerEmail: customers.email,
        customerFirstName: customers.firstName,
        customerLastName: customers.lastName,
      })
      .from(tickets)
      .innerJoin(customers, eq(tickets.customerUid, customers.uid))
      .where(eq(tickets.id, id))
      .limit(1)

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket nicht gefunden' }, { status: 404 })
    }

    // All messages including internal
    const messages = await db
      .select({
        id: ticketMessages.id,
        body: ticketMessages.body,
        authorUid: ticketMessages.authorUid,
        isInternal: ticketMessages.isInternal,
        createdAt: ticketMessages.createdAt,
        authorFirstName: customers.firstName,
        authorLastName: customers.lastName,
      })
      .from(ticketMessages)
      .innerJoin(customers, eq(ticketMessages.authorUid, customers.uid))
      .where(eq(ticketMessages.ticketId, id))
      .orderBy(asc(ticketMessages.createdAt))

    return NextResponse.json({ ticket, messages })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const patchSchema = z.object({
  status: z.enum(['offen', 'in_bearbeitung', 'geschlossen']).optional(),
  assigneeUid: z.string().uuid().nullable().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!verifyCsrf(request)) {
      return NextResponse.json({ error: 'CSRF check failed' }, { status: 403 })
    }
    const admin = await requireAdmin('tickets')
    const { id } = await params
    const data = patchSchema.parse(await request.json())

    const [before] = await db.select().from(tickets).where(eq(tickets.id, id)).limit(1)
    if (!before) {
      return NextResponse.json({ error: 'Ticket nicht gefunden' }, { status: 404 })
    }

    const updates: Record<string, unknown> = {}
    if (data.status !== undefined) updates.status = data.status
    if (data.assigneeUid !== undefined) updates.assigneeUid = data.assigneeUid

    if (Object.keys(updates).length > 0) {
      await db.update(tickets).set(updates).where(eq(tickets.id, id))

      await db.insert(auditLog).values({
        actorUid: admin.uid,
        action: 'ticket.update',
        targetType: 'ticket',
        targetId: id,
        before: { status: before.status, assigneeUid: before.assigneeUid },
        after: updates,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ungültige Eingabedaten' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
