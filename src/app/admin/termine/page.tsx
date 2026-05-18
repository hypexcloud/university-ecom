'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'

interface SessionRow {
  id: string
  customerUid: string
  type: string
  status: string
  scheduledAt: string
  customerProposal: string | null
  notes: string | null
  meetingUrl: string | null
  customerFirstName: string
  customerLastName: string
  customerEmail: string
}

const statusLabels: Record<string, string> = {
  pending: 'Ausstehend', accepted: 'Bestätigt', rejected: 'Abgelehnt',
  completed: 'Abgeschlossen', missed: 'Verpasst', cancelled: 'Storniert',
}

export default function AdminTerminePage() {
  const [sessions, setSessions] = useState<SessionRow[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSessions = useCallback(async () => {
    const res = await fetch('/api/admin/sessions')
    if (res.ok) { const data = await res.json(); setSessions(data.sessions || []) }
    setLoading(false)
  }, [])

  useEffect(() => { fetchSessions() }, [fetchSessions])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Sessions & Termine</h1>

      <Card>
        <CardHeader><CardTitle>Alle Termine ({sessions.length})</CardTitle></CardHeader>
        <CardContent>
          {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : sessions.length === 0 ? (
            <p className="text-muted-foreground">Keine Termine vorhanden.</p>
          ) : (
            <div className="space-y-2">
              {sessions.map((s) => (
                <div key={s.id} className="flex items-center justify-between border rounded-lg p-3 text-sm">
                  <div>
                    <p className="font-medium">{s.customerFirstName} {s.customerLastName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(s.scheduledAt).toLocaleString('de-DE')} · {s.type.toUpperCase()}
                    </p>
                    {s.customerProposal && (
                      <p className="text-xs text-amber-600">Alternativvorschlag: {new Date(s.customerProposal).toLocaleString('de-DE')}</p>
                    )}
                  </div>
                  <Badge variant={s.status === 'accepted' ? 'default' : s.status === 'pending' ? 'outline' : 'destructive'}>
                    {statusLabels[s.status] || s.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
