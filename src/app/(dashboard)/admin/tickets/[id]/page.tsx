'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Send, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Message {
  id: string
  body: string
  authorUid: string
  isInternal: boolean
  createdAt: string
  authorFirstName: string
  authorLastName: string
}

interface Ticket {
  id: string
  subject: string
  category: string
  status: string
  assigneeUid: string | null
  customerUid: string
  customerFirstName: string
  customerLastName: string
  customerEmail: string
  createdAt: string
}

export default function AdminTicketDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [replyBody, setReplyBody] = useState('')
  const [isInternal, setIsInternal] = useState(false)
  const [sending, setSending] = useState(false)

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/admin/tickets/${id}`)
    if (res.ok) {
      const data = await res.json()
      setTicket(data.ticket)
      setMessages(data.messages)
    }
    setLoading(false)
  }, [id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleStatusChange = async (status: string) => {
    await fetch(`/api/admin/tickets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchData()
  }

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyBody.trim()) return
    setSending(true)
    await fetch(`/api/admin/tickets/${id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: replyBody, isInternal }),
    })
    setReplyBody('')
    setIsInternal(false)
    setSending(false)
    fetchData()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!ticket) {
    return <p>Ticket nicht gefunden.</p>
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/tickets" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Zurück zur Warteschlange
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{ticket.subject}</h1>
          <p className="text-sm text-muted-foreground">
            {ticket.customerFirstName} {ticket.customerLastName} ({ticket.customerEmail})
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize">{ticket.category}</Badge>
          <Select value={ticket.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="offen">Offen</SelectItem>
              <SelectItem value="in_bearbeitung">In Bearbeitung</SelectItem>
              <SelectItem value="geschlossen">Geschlossen</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Nachrichten</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {messages.map((msg) => {
            const isCustomer = msg.authorUid === ticket.customerUid
            return (
              <div
                key={msg.id}
                className={`rounded-lg p-4 ${
                  msg.isInternal
                    ? 'bg-yellow-50 border border-yellow-200'
                    : isCustomer
                      ? 'bg-muted mr-8'
                      : 'bg-primary/5 ml-8'
                }`}
              >
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>
                    {msg.authorFirstName} {msg.authorLastName}
                    {msg.isInternal && <Badge variant="outline" className="ml-2 text-yellow-700">Intern</Badge>}
                  </span>
                  <span>{new Date(msg.createdAt).toLocaleString('de-DE')}</span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Reply form */}
      {ticket.status !== 'geschlossen' && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleReply} className="space-y-4">
              <Textarea
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                placeholder="Antwort schreiben..."
                className="min-h-[100px]"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="internal"
                    checked={isInternal}
                    onCheckedChange={(v) => setIsInternal(v as boolean)}
                  />
                  <Label htmlFor="internal" className="text-sm">
                    Interne Notiz (nur für Admins sichtbar)
                  </Label>
                </div>
                <Button type="submit" disabled={!replyBody.trim() || sending}>
                  {sending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                  {isInternal ? 'Notiz speichern' : 'Antworten'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
