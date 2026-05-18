'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy, Check, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface AffiliateStats {
  isAffiliate: boolean
  code?: string
  commissionRate?: string
  stats?: {
    totalReferrals: number
    approvedCount: number
    paidCount: number
    pendingCents: number
    paidCents: number
  }
  referrals?: { id: string; status: string; amountCents: number; createdAt: string }[]
}

export default function AffiliatePage() {
  const [data, setData] = useState<AffiliateStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/affiliate/stats')
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!data?.isAffiliate) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <h1 className="text-2xl font-bold">Affiliate-Programm</h1>
        <p className="text-muted-foreground">Du bist noch kein Affiliate. Bewirb dich jetzt!</p>
        <Button asChild>
          <Link href="/apply-affiliate">Jetzt bewerben</Link>
        </Button>
      </div>
    )
  }

  const appUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const referralLink = `${appUrl}?ref=${data.code}`

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold">Affiliate Dashboard</h1>

      {/* Referral Link */}
      <Card>
        <CardHeader>
          <CardTitle>Dein Empfehlungslink</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input value={referralLink} readOnly />
            <Button onClick={handleCopy} variant="outline">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Provision: {(parseFloat(data.commissionRate || '0.15') * 100).toFixed(0)}% · Code: {data.code}
          </p>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">{data.stats?.totalReferrals || 0}</p>
            <p className="text-sm text-muted-foreground">Empfehlungen</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">{data.stats?.approvedCount || 0}</p>
            <p className="text-sm text-muted-foreground">Bestätigt</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">{((data.stats?.pendingCents || 0) / 100).toFixed(2)} €</p>
            <p className="text-sm text-muted-foreground">Ausstehend</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">{((data.stats?.paidCents || 0) / 100).toFixed(2)} €</p>
            <p className="text-sm text-muted-foreground">Ausgezahlt</p>
          </CardContent>
        </Card>
      </div>

      {/* Referrals */}
      <Card>
        <CardHeader>
          <CardTitle>Letzte Empfehlungen</CardTitle>
        </CardHeader>
        <CardContent>
          {(data.referrals?.length || 0) === 0 ? (
            <p className="text-muted-foreground">Noch keine Empfehlungen.</p>
          ) : (
            <div className="space-y-2">
              {data.referrals?.map((r) => (
                <div key={r.id} className="flex items-center justify-between border rounded-lg p-3 text-sm">
                  <span>{new Date(r.createdAt).toLocaleDateString('de-DE')}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{(r.amountCents / 100).toFixed(2)} €</span>
                    <Badge variant={r.status === 'paid' ? 'default' : 'outline'}>{r.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center">
        <Link href="/affiliate/leaderboard" className="text-primary hover:underline text-sm">
          Leaderboard ansehen →
        </Link>
      </div>
    </div>
  )
}
