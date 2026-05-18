import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { db } from '@/lib/server/db'
import { sessions, customers } from '@/lib/server/db/schema'
import { eq, desc } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { Video, FileText, TrendingUp, Calendar, ArrowRight } from 'lucide-react'

export default async function CreatorPage() {
  const user = await requireAuth()

  const creatorSessions = await db
    .select({
      id: sessions.id, type: sessions.type, status: sessions.status,
      scheduledAt: sessions.scheduledAt, metadata: sessions.metadata,
      mentorFirstName: customers.firstName,
    })
    .from(sessions)
    .innerJoin(customers, eq(sessions.mentorUid, customers.uid))
    .where(eq(sessions.customerUid, user.uid))
    .orderBy(desc(sessions.scheduledAt))

  const creatorOnly = creatorSessions.filter(
    (s) => (s.metadata as Record<string, unknown>)?.creatorProgram,
  )

  const [customer] = await db
    .select({ billing: customers.billing })
    .from(customers)
    .where(eq(customers.uid, user.uid))
    .limit(1)

  const briefing = (customer?.billing as Record<string, unknown>)?.creatorBriefing as Record<string, string> | null
  const nextSession = creatorOnly.find((s) => new Date(s.scheduledAt) > new Date())

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Creator Programm</h1>

      {/* 2x2 Card Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Zoom Bereich */}
        <Link href={nextSession?.id ? `/student/termine/${nextSession.id}` : '/student/termine'}>
          <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Zoom Bereich</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {nextSession ? (
                <p className="text-sm">Nächster Call: {new Date(nextSession.scheduledAt).toLocaleDateString('de-DE')}</p>
              ) : (
                <p className="text-sm text-muted-foreground">Kein anstehender Call</p>
              )}
              <p className="text-xs text-primary mt-2 flex items-center gap-1">Termine ansehen <ArrowRight className="h-3 w-3" /></p>
            </CardContent>
          </Card>
        </Link>

        {/* Briefing */}
        <Link href="/student/creator/briefing">
          <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Briefing Bereich</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Badge variant={briefing ? 'default' : 'outline'}>
                {briefing ? 'Eingereicht' : 'Entwurf'}
              </Badge>
              <p className="text-xs text-primary mt-2 flex items-center gap-1">Briefing {briefing ? 'ansehen' : 'bearbeiten'} <ArrowRight className="h-3 w-3" /></p>
            </CardContent>
          </Card>
        </Link>

        {/* Fortschritt */}
        <Link href="/student/creator/fortschritt">
          <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fortschritt</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Wöchentlichen Bericht aktualisieren</p>
              <p className="text-xs text-primary mt-2 flex items-center gap-1">Fortschritt aktualisieren <ArrowRight className="h-3 w-3" /></p>
            </CardContent>
          </Card>
        </Link>

        {/* Termine */}
        <Link href="/student/termine">
          <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Termine</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{creatorOnly.length}</p>
              <p className="text-xs text-muted-foreground">Creator-Calls</p>
              <p className="text-xs text-primary mt-2 flex items-center gap-1">Alle Termine anzeigen <ArrowRight className="h-3 w-3" /></p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
