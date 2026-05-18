import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { db } from '@/lib/server/db'
import { sessions, customers } from '@/lib/server/db/schema'
import { eq, desc } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { CreatorBriefingForm } from './briefing-form'

export default async function CreatorPage() {
  const user = await requireAuth()

  // Get creator sessions (metadata contains creatorProgram)
  const creatorSessions = await db
    .select({
      id: sessions.id,
      type: sessions.type,
      status: sessions.status,
      scheduledAt: sessions.scheduledAt,
      metadata: sessions.metadata,
      mentorFirstName: customers.firstName,
    })
    .from(sessions)
    .innerJoin(customers, eq(sessions.mentorUid, customers.uid))
    .where(eq(sessions.customerUid, user.uid))
    .orderBy(desc(sessions.scheduledAt))

  const creatorOnly = creatorSessions.filter(
    (s) => (s.metadata as Record<string, unknown>)?.creatorProgram,
  )

  // Get briefing
  const [customer] = await db
    .select({ billing: customers.billing })
    .from(customers)
    .where(eq(customers.uid, user.uid))
    .limit(1)

  const briefing = (customer?.billing as Record<string, unknown>)?.creatorBriefing as Record<string, string> | null

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Creator Programm</h1>

      {/* Termine */}
      <Card>
        <CardHeader>
          <CardTitle>Deine Creator-Termine</CardTitle>
        </CardHeader>
        <CardContent>
          {creatorOnly.length === 0 ? (
            <p className="text-muted-foreground">Noch keine Creator-Termine geplant.</p>
          ) : (
            <div className="space-y-3">
              {creatorOnly.map((s) => {
                const meta = s.metadata as Record<string, unknown>
                return (
                  <div key={s.id} className="flex items-center justify-between border rounded-lg p-3">
                    <div>
                      <p className="font-medium">
                        Call {String(meta?.callNumber || '?')} — {new Date(s.scheduledAt).toLocaleDateString('de-DE')}
                      </p>
                      <p className="text-sm text-muted-foreground">{s.type.toUpperCase()} · {s.mentorFirstName}</p>
                    </div>
                    <Badge variant={s.status === 'accepted' ? 'default' : 'outline'}>{s.status}</Badge>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Briefing */}
      <Card>
        <CardHeader>
          <CardTitle>Briefing</CardTitle>
        </CardHeader>
        <CardContent>
          {briefing ? (
            <div className="space-y-2 text-sm">
              <p><strong>Social Link:</strong> {briefing.socialLink}</p>
              <p><strong>Nische:</strong> {briefing.nische}</p>
              <p><strong>Follower:</strong> {briefing.follower}</p>
              <p><strong>Views:</strong> {briefing.views}</p>
              <p><strong>Ziele:</strong> {briefing.ziele}</p>
              <p><strong>Probleme:</strong> {briefing.probleme}</p>
              <p><strong>Erfahrungen:</strong> {briefing.erfahrungen}</p>
              <Badge variant="default">Eingereicht</Badge>
            </div>
          ) : (
            <CreatorBriefingForm />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
