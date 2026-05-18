'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2, ArrowLeft, CheckCircle, XCircle, Save } from 'lucide-react'
import Link from 'next/link'

export default function MentorSessionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [meetingUrl, setMeetingUrl] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/mentor/sessions')
      .then((r) => r.json())
      .then((data) => {
        const s = (data.sessions || []).find((s: any) => s.id === id)
        if (s) {
          setSession(s)
          setNotes(s.notes || '')
          setMeetingUrl(s.meetingUrl || '')
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  const updateSession = async (updates: Record<string, string>) => {
    setSaving(true)
    await fetch(`/api/mentor/sessions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    setSaving(false)
    router.refresh()
    // Refresh session data
    const res = await fetch('/api/mentor/sessions')
    const data = await res.json()
    const s = (data.sessions || []).find((s: any) => s.id === id)
    if (s) setSession(s)
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
  if (!session) return <p>Session nicht gefunden.</p>

  return (
    <div className="space-y-6 max-w-2xl">
      <Link href="/mentor/sessions" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Zurück zu Sessions
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Session mit {session.customerFirstName} {session.customerLastName}</CardTitle>
            <Badge variant={session.status === 'accepted' ? 'default' : 'outline'}>{session.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">Datum</span><p className="font-medium">{new Date(session.scheduledAt).toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}</p></div>
            <div><span className="text-muted-foreground">Uhrzeit</span><p className="font-medium">{new Date(session.scheduledAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr</p></div>
            <div><span className="text-muted-foreground">Plattform</span><p className="font-medium capitalize">{session.type}</p></div>
            <div><span className="text-muted-foreground">E-Mail</span><p className="font-medium">{session.customerEmail}</p></div>
          </div>

          {session.customerProposal && (
            <div className="bg-amber-50 rounded-lg p-3 text-sm text-amber-800">
              Alternativvorschlag vom Kunden: {new Date(session.customerProposal).toLocaleString('de-DE')}
            </div>
          )}

          {/* Actions */}
          {session.status === 'pending' && (
            <div className="flex gap-2">
              <Button onClick={() => updateSession({ status: 'accepted' })} disabled={saving}>
                <CheckCircle className="h-4 w-4 mr-1" /> Akzeptieren
              </Button>
              <Button variant="destructive" onClick={() => updateSession({ status: 'cancelled' })} disabled={saving}>
                <XCircle className="h-4 w-4 mr-1" /> Absagen
              </Button>
            </div>
          )}

          {session.status === 'accepted' && (
            <Button onClick={() => updateSession({ status: 'completed' })} disabled={saving}>
              <CheckCircle className="h-4 w-4 mr-1" /> Als abgeschlossen markieren
            </Button>
          )}

          {/* Meeting URL */}
          <div className="space-y-1">
            <Label>Meeting-URL</Label>
            <div className="flex gap-2">
              <Input value={meetingUrl} onChange={(e) => setMeetingUrl(e.target.value)} placeholder="https://zoom.us/j/..." />
              <Button variant="outline" onClick={() => updateSession({ meetingUrl })} disabled={saving}>
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <Label>Notizen (nur für dich sichtbar)</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notizen zur Session..." className="min-h-[100px]" />
            <Button variant="outline" size="sm" onClick={() => updateSession({ notes })} disabled={saving}>
              {saving ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Save className="h-3 w-3 mr-1" />}
              Notizen speichern
            </Button>
          </div>

          {/* Link to student profile */}
          <Link href={`/mentor/students/${session.customerUid}`} className="text-sm text-primary hover:underline">
            Teilnehmerprofil ansehen →
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
