'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

const statusLabels: Record<string, string> = {
  pending: 'Ausstehend', accepted: 'Bestätigt', completed: 'Abgeschlossen',
  missed: 'Verpasst', cancelled: 'Storniert', rejected: 'Abgelehnt',
}

export default function MentorSessionsPage() {
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSessions = useCallback(async () => {
    const res = await fetch('/api/mentor/sessions')
    if (res.ok) setSessions((await res.json()).sessions || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchSessions() }, [fetchSessions])

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Alle Sessions</h1>
      <Card>
        <CardHeader><CardTitle>Sessions ({sessions.length})</CardTitle></CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-muted-foreground">Keine Sessions zugewiesen.</p>
          ) : (
            <div className="space-y-2">
              {sessions.map((s: any) => (
                <Link key={s.id} href={`/mentor/sessions/${s.id}`} className="flex items-center justify-between border rounded-lg p-3 hover:bg-accent transition-colors">
                  <div>
                    <p className="font-medium text-sm">{s.customerFirstName} {s.customerLastName}</p>
                    <p className="text-xs text-muted-foreground">{new Date(s.scheduledAt).toLocaleString('de-DE')} · {s.type.toUpperCase()}</p>
                  </div>
                  <Badge variant={s.status === 'accepted' ? 'default' : s.status === 'completed' ? 'default' : 'outline'}>
                    {statusLabels[s.status] || s.status}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
