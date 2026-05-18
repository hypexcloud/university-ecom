import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { db } from '@/lib/server/db'
import { tickets } from '@/lib/server/db/schema'
import { eq, desc } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { NewTicketForm } from './new-ticket-form'

const statusColors: Record<string, 'default' | 'destructive' | 'outline'> = {
  offen: 'destructive',
  in_bearbeitung: 'default',
  geschlossen: 'outline',
}

export default async function SupportPage() {
  const user = await requireAuth()

  const userTickets = await db
    .select()
    .from(tickets)
    .where(eq(tickets.customerUid, user.uid))
    .orderBy(desc(tickets.lastMessageAt))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Support</h1>
      </div>

      <NewTicketForm />

      <Card>
        <CardHeader>
          <CardTitle>Meine Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {userTickets.length === 0 ? (
            <p className="text-muted-foreground">Noch keine Tickets erstellt.</p>
          ) : (
            <div className="space-y-2">
              {userTickets.map((t) => (
                <Link
                  key={t.id}
                  href={`/student/support/${t.id}`}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{t.subject}</p>
                    <p className="text-sm text-muted-foreground capitalize">{t.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {t.lastMessageAt?.toLocaleDateString('de-DE')}
                    </span>
                    <Badge variant={statusColors[t.status] || 'outline'}>
                      {t.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
