'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, DollarSign } from 'lucide-react'

interface PendingAffiliate {
  affiliateUid: string
  code: string
  email: string
  firstName: string
  lastName: string
  pendingCents: number
  approvedCount: number
}

export default function PayoutsPage() {
  const [affiliates, setAffiliates] = useState<PendingAffiliate[]>([])
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState<string | null>(null)

  const fetch_data = useCallback(async () => {
    const res = await fetch('/api/admin/affiliates/payouts')
    if (res.ok) {
      const data = await res.json()
      setAffiliates(data.affiliates)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetch_data() }, [fetch_data])

  const handlePayout = async (affiliateUid: string) => {
    setPaying(affiliateUid)
    await fetch('/api/admin/affiliates/payouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ affiliateUid }),
    })
    setPaying(null)
    fetch_data()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Affiliate-Auszahlungen</h1>

      <Card>
        <CardHeader>
          <CardTitle>Ausstehende Provisionen</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : affiliates.length === 0 ? (
            <p className="text-muted-foreground">Keine ausstehenden Auszahlungen.</p>
          ) : (
            <div className="space-y-3">
              {affiliates.map((a) => (
                <div key={a.affiliateUid} className="flex items-center justify-between border rounded-lg p-4">
                  <div>
                    <p className="font-medium">{a.firstName} {a.lastName}</p>
                    <p className="text-sm text-muted-foreground">{a.email} · Code: {a.code}</p>
                    <p className="text-sm">{a.approvedCount} Empfehlungen</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold">{(Number(a.pendingCents) / 100).toFixed(2)} €</span>
                    <Button
                      onClick={() => handlePayout(a.affiliateUid)}
                      disabled={paying === a.affiliateUid}
                      size="sm"
                    >
                      {paying === a.affiliateUid ? <Loader2 className="h-4 w-4 animate-spin" /> : <DollarSign className="h-4 w-4 mr-1" />}
                      Auszahlen
                    </Button>
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
