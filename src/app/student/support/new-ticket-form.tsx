'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PlusCircle, Loader2 } from 'lucide-react'

const CATEGORIES = [
  { value: 'support', label: 'Allgemeiner Support' },
  { value: 'hilfe', label: 'Hilfe' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'kursfrage', label: 'Kursfrage' },
  { value: 'affiliate', label: 'Affiliate' },
  { value: 'creator', label: 'Creator Programm' },
  { value: 'technisches_problem', label: 'Technisches Problem' },
]

export function NewTicketForm() {
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!category || !subject.trim() || !body.trim()) return

    setLoading(true)
    const res = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, subject, body }),
    })

    if (res.ok) {
      const data = await res.json()
      router.push(`/student/support/${data.ticket.id}`)
      router.refresh()
    }
    setLoading(false)
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Neues Ticket
      </Button>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Neues Ticket erstellen</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Kategorie</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Kategorie wählen..." />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Betreff</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Worum geht es?"
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label>Nachricht</Label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Beschreiben Sie Ihr Anliegen..."
              className="min-h-[120px]"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading || !category || !subject.trim() || !body.trim()}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Ticket erstellen
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Abbrechen
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
