'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'

export default function AdminGiftcardsPage() {
  const [cards, setCards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/giftcards')
      .then((r) => r.json())
      .then((data) => setCards(data.giftcards || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gutscheine</h1>
      <Card>
        <CardHeader><CardTitle>Alle Gutscheine ({cards.length})</CardTitle></CardHeader>
        <CardContent>
          {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : cards.length === 0 ? (
            <p className="text-muted-foreground">Keine Gutscheine vorhanden.</p>
          ) : (
            <div className="space-y-2">
              {cards.map((c: any) => (
                <div key={c.id} className="flex items-center justify-between border rounded-lg p-3 text-sm">
                  <div>
                    <code className="font-mono font-bold">{c.code}</code>
                    <span className="ml-2 text-muted-foreground">{c.recipientEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{(c.balanceCents / 100).toFixed(2)} € / {(c.initialCents / 100).toFixed(2)} €</span>
                    <Badge variant={c.status === 'active' ? 'default' : 'outline'}>{c.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
