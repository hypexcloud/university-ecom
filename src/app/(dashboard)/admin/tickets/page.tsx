'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

interface TicketRow {
  id: string
  category: string
  subject: string
  status: string
  assigneeUid: string | null
  lastMessageAt: string | null
  createdAt: string
  customerEmail: string
  customerFirstName: string
  customerLastName: string
}

const statusColors: Record<string, 'default' | 'destructive' | 'outline'> = {
  offen: 'destructive',
  in_bearbeitung: 'default',
  geschlossen: 'outline',
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<TicketRow[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('alle')
  const [categoryFilter, setCategoryFilter] = useState('')

  const fetchTickets = useCallback(async () => {
    const params = new URLSearchParams()
    if (statusFilter !== 'alle') params.set('status', statusFilter)
    if (categoryFilter) params.set('category', categoryFilter)

    const res = await fetch(`/api/admin/tickets?${params}`)
    if (res.ok) {
      const data = await res.json()
      setTickets(data.tickets)
    }
    setLoading(false)
  }, [statusFilter, categoryFilter])

  useEffect(() => {
    fetchTickets()
    const interval = setInterval(fetchTickets, 30_000)
    return () => clearInterval(interval)
  }, [fetchTickets])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Ticket-Warteschlange</h1>

      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Status..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle Status</SelectItem>
            <SelectItem value="offen">Offen</SelectItem>
            <SelectItem value="in_bearbeitung">In Bearbeitung</SelectItem>
            <SelectItem value="geschlossen">Geschlossen</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter || 'alle'} onValueChange={(v) => setCategoryFilter(v === 'alle' ? '' : v)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Kategorie..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle Kategorien</SelectItem>
            <SelectItem value="support">Support</SelectItem>
            <SelectItem value="hilfe">Hilfe</SelectItem>
            <SelectItem value="feedback">Feedback</SelectItem>
            <SelectItem value="kursfrage">Kursfrage</SelectItem>
            <SelectItem value="affiliate">Affiliate</SelectItem>
            <SelectItem value="creator">Creator</SelectItem>
            <SelectItem value="technisches_problem">Technisches Problem</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Tickets ({tickets.length})
            {loading && <Loader2 className="inline h-4 w-4 ml-2 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 && !loading ? (
            <p className="text-muted-foreground">Keine Tickets gefunden.</p>
          ) : (
            <div className="space-y-2">
              {tickets.map((t) => (
                <Link
                  key={t.id}
                  href={`/admin/tickets/${t.id}`}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="font-medium truncate">{t.subject}</p>
                    <p className="text-sm text-muted-foreground">
                      {t.customerFirstName} {t.customerLastName} ({t.customerEmail})
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    <Badge variant="outline" className="capitalize">{t.category}</Badge>
                    <Badge variant={statusColors[t.status] || 'outline'}>{t.status}</Badge>
                    <span className="text-xs text-muted-foreground w-20 text-right">
                      {t.lastMessageAt ? new Date(t.lastMessageAt).toLocaleDateString('de-DE') : '—'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
