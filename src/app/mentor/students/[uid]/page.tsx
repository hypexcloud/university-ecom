'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Loader2, ArrowLeft, User, FileText, Calendar } from 'lucide-react'

export default function MentorStudentDetailPage() {
  const { uid } = useParams<{ uid: string }>()
  const [student, setStudent] = useState<any>(null)
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/mentor/students').then((r) => r.json()),
      fetch('/api/mentor/sessions').then((r) => r.json()),
    ]).then(([studentsData, sessionsData]) => {
      setStudent((studentsData.students || []).find((s: any) => s.uid === uid))
      setSessions((sessionsData.sessions || []).filter((s: any) => s.customerUid === uid))
    }).finally(() => setLoading(false))
  }, [uid])

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
  if (!student) return <p>Teilnehmer nicht gefunden.</p>

  const briefing = (student.billing as Record<string, unknown>)?.creatorBriefing as Record<string, string> | null

  return (
    <div className="space-y-6">
      <Link href="/mentor/students" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Zurück zu Teilnehmer
      </Link>

      <div>
        <h1 className="text-3xl font-bold">{student.firstName} {student.lastName}</h1>
        <p className="text-muted-foreground">{student.email}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Contact */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Kontakt</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Discord</span><span>{student.discordUsername || '—'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">WhatsApp</span><span>{student.whatsapp || '—'}</span></div>
          </CardContent>
        </Card>

        {/* Sessions */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" /> Sessions ({sessions.length})</CardTitle></CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <p className="text-muted-foreground text-sm">Keine Sessions.</p>
            ) : (
              <div className="space-y-1">
                {sessions.slice(0, 5).map((s: any) => (
                  <Link key={s.id} href={`/mentor/sessions/${s.id}`} className="flex justify-between text-sm py-1 hover:text-primary">
                    <span>{new Date(s.scheduledAt).toLocaleDateString('de-DE')}</span>
                    <Badge variant="outline" className="text-xs">{s.status}</Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Briefing */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Creator-Briefing</CardTitle></CardHeader>
        <CardContent>
          {briefing ? (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Social Link</span><p className="break-all">{briefing.socialLink}</p></div>
              <div><span className="text-muted-foreground">Nische</span><p>{briefing.nische}</p></div>
              <div><span className="text-muted-foreground">Follower</span><p>{briefing.follower}</p></div>
              <div><span className="text-muted-foreground">Views</span><p>{briefing.views}</p></div>
              <div className="col-span-2"><span className="text-muted-foreground">Ziele</span><p>{briefing.ziele}</p></div>
              <div className="col-span-2"><span className="text-muted-foreground">Probleme</span><p>{briefing.probleme}</p></div>
              <div className="col-span-2"><span className="text-muted-foreground">Erfahrungen</span><p>{briefing.erfahrungen}</p></div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Kein Briefing eingereicht.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
