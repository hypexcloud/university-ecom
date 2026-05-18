import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { db } from '@/lib/server/db'
import { tickets, ticketMessages, customers } from '@/lib/server/db/schema'
import { eq, and, asc } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { TicketReplyForm } from './reply-form'
import { RealtimeMessages } from './realtime-messages'

interface Props {
  params: Promise<{ id: string }>
}

export default async function TicketDetailPage({ params }: Props) {
  const user = await requireAuth()
  const { id } = await params

  const [ticket] = await db
    .select()
    .from(tickets)
    .where(and(eq(tickets.id, id), eq(tickets.customerUid, user.uid)))
    .limit(1)

  if (!ticket) notFound()

  const messages = await db
    .select({
      id: ticketMessages.id,
      body: ticketMessages.body,
      authorUid: ticketMessages.authorUid,
      createdAt: ticketMessages.createdAt,
      authorFirstName: customers.firstName,
    })
    .from(ticketMessages)
    .innerJoin(customers, eq(ticketMessages.authorUid, customers.uid))
    .where(and(
      eq(ticketMessages.ticketId, id),
      eq(ticketMessages.isInternal, false),
    ))
    .orderBy(asc(ticketMessages.createdAt))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{ticket.subject}</h1>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="capitalize">{ticket.category}</Badge>
          <Badge variant={ticket.status === 'offen' ? 'destructive' : ticket.status === 'geschlossen' ? 'outline' : 'default'}>
            {ticket.status}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Erstellt: {ticket.createdAt.toLocaleDateString('de-DE')}
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nachrichten</CardTitle>
        </CardHeader>
        <CardContent>
          <RealtimeMessages
            ticketId={id}
            userId={user.uid}
            initialMessages={messages.map((m) => ({
              id: m.id,
              body: m.body,
              authorUid: m.authorUid,
              createdAt: m.createdAt.toISOString(),
              authorFirstName: m.authorFirstName,
            }))}
          />
        </CardContent>
      </Card>

      {ticket.status !== 'geschlossen' && (
        <TicketReplyForm ticketId={id} />
      )}
    </div>
  )
}
