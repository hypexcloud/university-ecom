import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { db } from '@/lib/server/db'
import { sessions, customers } from '@/lib/server/db/schema'
import { eq, desc } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { SessionActions } from './session-actions'

const statusLabels: Record<string, string> = {
  pending: 'Ausstehend',
  accepted: 'Bestätigt',
  rejected: 'Abgelehnt',
  completed: 'Abgeschlossen',
  missed: 'Verpasst',
  cancelled: 'Storniert',
}

const statusVariants: Record<string, 'default' | 'destructive' | 'outline'> = {
  pending: 'outline',
  accepted: 'default',
  rejected: 'destructive',
  completed: 'default',
  missed: 'destructive',
  cancelled: 'outline',
}

export default async function TerminePage() {
  const user = await requireAuth()
  const now = new Date()

  const allSessions = await db
    .select({
      id: sessions.id,
      type: sessions.type,
      status: sessions.status,
      scheduledAt: sessions.scheduledAt,
      meetingUrl: sessions.meetingUrl,
      customerProposal: sessions.customerProposal,
      mentorFirstName: customers.firstName,
      mentorLastName: customers.lastName,
    })
    .from(sessions)
    .innerJoin(customers, eq(sessions.mentorUid, customers.uid))
    .where(eq(sessions.customerUid, user.uid))
    .orderBy(desc(sessions.scheduledAt))

  const upcoming = allSessions.filter((s) => new Date(s.scheduledAt) >= now && s.status !== 'cancelled' && s.status !== 'rejected')
  const past = allSessions.filter((s) => new Date(s.scheduledAt) < now || s.status === 'cancelled' || s.status === 'rejected')

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Meine Termine</h1>

      <Card>
        <CardHeader>
          <CardTitle>Anstehende Termine ({upcoming.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {upcoming.length === 0 ? (
            <p className="text-muted-foreground">Keine anstehenden Termine.</p>
          ) : (
            <div className="space-y-4">
              {upcoming.map((s) => (
                <div key={s.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {new Date(s.scheduledAt).toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        {' — '}
                        {new Date(s.scheduledAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Mentor: {s.mentorFirstName} {s.mentorLastName} · {s.type.toUpperCase()}
                      </p>
                    </div>
                    <Badge variant={statusVariants[s.status] || 'outline'}>
                      {statusLabels[s.status] || s.status}
                    </Badge>
                  </div>

                  {s.meetingUrl && s.status === 'accepted' && (
                    <a href={s.meetingUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                      Meeting beitreten →
                    </a>
                  )}

                  {s.status === 'pending' && <SessionActions sessionId={s.id} />}

                  {s.customerProposal && (
                    <p className="text-xs text-muted-foreground">
                      Dein Vorschlag: {new Date(s.customerProposal).toLocaleString('de-DE')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {past.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Vergangene Termine ({past.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {past.slice(0, 10).map((s) => (
                <div key={s.id} className="flex items-center justify-between border rounded-lg p-3 text-sm">
                  <span>{new Date(s.scheduledAt).toLocaleDateString('de-DE')} — {s.mentorFirstName} {s.mentorLastName}</span>
                  <Badge variant={statusVariants[s.status] || 'outline'}>{statusLabels[s.status] || s.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
