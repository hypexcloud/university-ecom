'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function PublicLeaderboardPage() {
  const [month, setMonth] = useState('')
  const [entries, setEntries] = useState<{ rank: number; displayName: string; referrals: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/affiliate/leaderboard').then((r) => r.json()).then((data) => {
      setMonth(data.month); setEntries(data.leaderboard || [])
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-prestige-black px-6 py-20">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-12">
          <Trophy className="h-12 w-12 mx-auto text-prestige-gold-500 mb-4" />
          <h1 className="text-4xl font-display font-bold text-prestige-white mb-2">Affiliate Leaderboard</h1>
          <p className="text-prestige-gray-400">{month || 'Aktueller Monat'}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-prestige-gold-500" /></div>
        ) : (
          <Card className="bg-prestige-gray-900/50 border-prestige-gray-800">
            <CardHeader><CardTitle className="text-prestige-white">Top Affiliates</CardTitle></CardHeader>
            <CardContent>
              {entries.length === 0 ? (
                <p className="text-prestige-gray-400 text-center py-8">Noch keine Daten für diesen Monat.</p>
              ) : (
                <div className="space-y-2">
                  {entries.map((e) => (
                    <div key={e.rank} className="flex items-center justify-between border border-prestige-gray-800 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-lg font-bold w-8 ${e.rank <= 3 ? 'text-prestige-gold-500' : 'text-prestige-gray-500'}`}>#{e.rank}</span>
                        <span className="font-medium text-prestige-white">{e.displayName}</span>
                      </div>
                      <Badge variant={e.rank <= 3 ? 'default' : 'outline'} className={e.rank <= 3 ? 'bg-prestige-gold-500 text-black' : ''}>
                        {e.referrals} Empfehlungen
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="text-center mt-8">
          <Link href="/affiliate" className="text-prestige-gold-500 hover:underline text-sm">← Zurück zum Affiliate Programm</Link>
        </div>
      </div>
    </div>
  )
}
