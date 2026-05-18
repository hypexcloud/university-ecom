'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Calendar, Users, Clock, CheckCircle, Loader2 } from 'lucide-react'

export default function MentorDashboard() {
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/mentor/sessions')
      .then((r) => r.json())
      .then((data) => setSessions(data.sessions || []))
      .finally(() => setLoading(false))
  }, [])

  const now = new Date()
  const today = sessions.filter((s) => {
    const d = new Date(s.scheduledAt)
    return d.toDateString() === now.toDateString()
  })
  const pending = sessions.filter((s) => s.status === 'pending')
  const upcoming = sessions.filter((s) => new Date(s.scheduledAt) > now && s.status !== 'cancelled').slice(0, 5)

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mentor Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heute</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{today.length} Sessions</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ausstehend</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{pending.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamt Sessions</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{sessions.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teilnehmer</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{new Set(sessions.map((s: any) => s.customerUid)).size}</div></CardContent>
        </Card>
      </div>

      {pending.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Ausstehende Bestätigungen</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {pending.map((s: any) => (
              <Link key={s.id} href={`/mentor/sessions/${s.id}`} className="flex items-center justify-between border rounded-lg p-3 hover:bg-accent transition-colors">
                <div>
                  <p className="font-medium text-sm">{s.customerFirstName} {s.customerLastName}</p>
                  <p className="text-xs text-muted-foreground">{new Date(s.scheduledAt).toLocaleString('de-DE')} · {s.type.toUpperCase()}</p>
                  {s.customerProposal && <p className="text-xs text-amber-600">Alternativvorschlag: {new Date(s.customerProposal).toLocaleString('de-DE')}</p>}
                </div>
                <Badge variant="outline">Ausstehend</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Nächste Termine</CardTitle>
          <Link href="/mentor/sessions" className="text-sm text-primary hover:underline">Alle ansehen</Link>
        </CardHeader>
        <CardContent>
          {upcoming.length === 0 ? (
            <p className="text-muted-foreground text-sm">Keine anstehenden Termine.</p>
          ) : (
            <div className="space-y-2">
              {upcoming.map((s: any) => (
                <Link key={s.id} href={`/mentor/sessions/${s.id}`} className="flex items-center justify-between border rounded-lg p-3 hover:bg-accent transition-colors">
                  <div>
                    <p className="font-medium text-sm">{s.customerFirstName} {s.customerLastName}</p>
                    <p className="text-xs text-muted-foreground">{new Date(s.scheduledAt).toLocaleString('de-DE')}</p>
                  </div>
                  <Badge variant={s.status === 'accepted' ? 'default' : 'outline'}>{s.status}</Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
