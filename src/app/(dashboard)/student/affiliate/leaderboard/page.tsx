'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Trophy } from 'lucide-react'

export default function StudentLeaderboardPage() {
  const [month, setMonth] = useState('')
  const [entries, setEntries] = useState<{ rank: number; displayName: string; referrals: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/affiliate/leaderboard').then((r) => r.json()).then((data) => {
      setMonth(data.month); setEntries(data.leaderboard || [])
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Trophy className="h-10 w-10 mx-auto text-yellow-500 mb-2" />
        <h1 className="text-3xl font-bold">Affiliate Leaderboard</h1>
        <p className="text-muted-foreground">{month}</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Top Affiliates</CardTitle></CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-muted-foreground text-center">Noch keine Daten.</p>
          ) : (
            <div className="space-y-2">
              {entries.map((e) => (
                <div key={e.rank} className="flex items-center justify-between border rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <span className={`text-lg font-bold w-8 ${e.rank <= 3 ? 'text-yellow-500' : 'text-muted-foreground'}`}>#{e.rank}</span>
                    <span className="font-medium">{e.displayName}</span>
                  </div>
                  <Badge variant={e.rank <= 3 ? 'default' : 'outline'}>{e.referrals} Empfehlungen</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
