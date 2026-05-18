import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { db } from '@/lib/server/db'
import { sessions, customers } from '@/lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { SessionActions } from '../session-actions'
import { MeetingTypeIcon } from '@/components/dashboard/session-card'
import { ArrowLeft, Calendar, ExternalLink, Download } from 'lucide-react'

const statusLabels: Record<string, string> = {
  pending: 'Ausstehend', accepted: 'Bestätigt', rejected: 'Abgelehnt',
  completed: 'Abgeschlossen', missed: 'Verpasst', cancelled: 'Storniert',
}

interface Props { params: Promise<{ sessionId: string }> }

export default async function SessionDetailPage({ params }: Props) {
  const user = await requireAuth()
  const { sessionId } = await params

  const [session] = await db
    .select({
      id: sessions.id, type: sessions.type, status: sessions.status,
      scheduledAt: sessions.scheduledAt, notes: sessions.notes,
      meetingUrl: sessions.meetingUrl, customerProposal: sessions.customerProposal,
      mentorFirstName: customers.firstName, mentorLastName: customers.lastName,
    })
    .from(sessions)
    .innerJoin(customers, eq(sessions.mentorUid, customers.uid))
    .where(and(eq(sessions.id, sessionId), eq(sessions.customerUid, user.uid)))
    .limit(1)

  if (!session) notFound()

  // Generate .ics content
  const icsStart = session.scheduledAt.toISOString().replace(/[-:]/g, '').replace('.000', '')
  const icsEnd = new Date(session.scheduledAt.getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').replace('.000', '')
  const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${icsStart}\nDTEND:${icsEnd}\nSUMMARY:Session mit ${session.mentorFirstName}\nLOCATION:${session.meetingUrl || session.type}\nEND:VEVENT\nEND:VCALENDAR`
  const icsDataUri = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`

  return (
    <div className="space-y-6 max-w-2xl">
      <Link href="/student/termine" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Zurück zu Termine
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MeetingTypeIcon type={session.type} />
              Session mit {session.mentorFirstName} {session.mentorLastName}
            </CardTitle>
            <Badge variant={session.status === 'accepted' ? 'default' : session.status === 'pending' ? 'outline' : 'destructive'}>
              {statusLabels[session.status] || session.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Datum</span>
              <p className="font-medium">{session.scheduledAt.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Uhrzeit</span>
              <p className="font-medium">{session.scheduledAt.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr</p>
            </div>
            <div>
              <span className="text-muted-foreground">Plattform</span>
              <p className="font-medium capitalize">{session.type}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Mentor</span>
              <p className="font-medium">{session.mentorFirstName} {session.mentorLastName}</p>
            </div>
          </div>

          {session.meetingUrl && session.status === 'accepted' && (
            <a href={session.meetingUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-blue-50 text-blue-700 rounded-lg p-3 hover:bg-blue-100 transition-colors">
              <ExternalLink className="h-4 w-4" />
              <span className="font-medium">Meeting beitreten</span>
            </a>
          )}

          {session.customerProposal && (
            <div className="bg-amber-50 rounded-lg p-3 text-sm">
              <p className="text-amber-800">Dein Alternativvorschlag: {new Date(session.customerProposal).toLocaleString('de-DE')}</p>
            </div>
          )}

          {session.notes && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Notizen</p>
              <p className="text-sm">{session.notes}</p>
            </div>
          )}

          {/* Actions based on status */}
          {session.status === 'pending' && <SessionActions sessionId={session.id} />}

          {/* .ics download */}
          {(session.status === 'accepted' || session.status === 'pending') && (
            <a href={icsDataUri} download={`session-${session.id}.ics`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <Download className="h-4 w-4" /> Zum Kalender hinzufügen (.ics)
            </a>
          )}

          {session.status === 'missed' && (
            <p className="text-sm text-muted-foreground">Du hast diesen Termin verpasst. Erstelle ein <Link href="/student/support" className="text-primary hover:underline">Support-Ticket</Link> um einen neuen Termin anzufragen.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
