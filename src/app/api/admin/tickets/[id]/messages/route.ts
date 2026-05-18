import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { tickets, ticketMessages, customers } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { sendTicketReplyEmail } from '@/lib/email/send-ticket-reply'
import { z } from 'zod'

const messageSchema = z.object({
  body: z.string().min(1).max(5000),
  isInternal: z.boolean().default(false),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!verifyCsrf(request)) {
      return NextResponse.json({ error: 'CSRF check failed' }, { status: 403 })
    }
    const admin = await requireAdmin('tickets')
    const { id } = await params
    const data = messageSchema.parse(await request.json())

    const [ticket] = await db.select().from(tickets).where(eq(tickets.id, id)).limit(1)
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket nicht gefunden' }, { status: 404 })
    }

    const [message] = await db.insert(ticketMessages).values({
      ticketId: id,
      authorUid: admin.uid,
      body: data.body,
      isInternal: data.isInternal,
    }).returning()

    await db.update(tickets).set({ lastMessageAt: new Date() }).where(eq(tickets.id, id))

    // Send email to customer if not an internal note
    if (!data.isInternal) {
      const [customer] = await db
        .select({ email: customers.email, firstName: customers.firstName })
        .from(customers)
        .where(eq(customers.uid, ticket.customerUid))
        .limit(1)

      if (customer) {
        await sendTicketReplyEmail({
          to: customer.email,
          customerName: customer.firstName,
          ticketId: id,
          ticketSubject: ticket.subject,
          messagePreview: data.body.slice(0, 200),
        }).catch(() => {
          // Email failure should not block the response
        })
      }
    }

    return NextResponse.json({ success: true, message }, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ungültige Eingabedaten' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
