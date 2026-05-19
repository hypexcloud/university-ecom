'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowUp, Loader2, Sparkles } from 'lucide-react'

interface UpgradeTarget {
  planId: string
  planCode: string
  productTitle: string
  priceCents: number
}

interface UpgradeCardProps {
  currentPlan: string
  productSlug: string
}

export function UpgradeCard({ currentPlan, productSlug }: UpgradeCardProps) {
  const [targets, setTargets] = useState<UpgradeTarget[]>([])
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/student/upgrade-options?product=${productSlug}&current=${currentPlan}`)
      .then((r) => r.json())
      .then((data) => setTargets(data.options || []))
      .finally(() => setLoading(false))
  }, [productSlug, currentPlan])

  const handleUpgrade = async (targetPlanId: string) => {
    setUpgrading(targetPlanId)
    setError('')
    const res = await fetch('/api/checkout/upgrade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetPlanId }),
    })

    if (res.ok) {
      const data = await res.json()
      // Redirect to Stripe payment with clientSecret
      // For now, show the delta and let the user know
      window.location.href = `/checkout/upgrade?secret=${data.clientSecret}&delta=${data.deltaCents}&from=${data.fromPlan}&to=${data.toPlan}`
    } else {
      const data = await res.json()
      setError(data.error || 'Upgrade fehlgeschlagen')
    }
    setUpgrading(null)
  }

  if (loading || targets.length === 0) return null

  return (
    <Card className="border-amber-200 bg-amber-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-amber-600" />
          Upgrade verfügbar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Du nutzt aktuell den <Badge variant="outline">{currentPlan}</Badge> Plan. Upgrade und zahle nur die Differenz:
        </p>
        {targets.map((t) => (
          <div key={t.planId} className="flex items-center justify-between border rounded-lg p-3 bg-white">
            <div>
              <span className="font-medium">{t.planCode}</span>
              <span className="text-sm text-muted-foreground ml-2">+{(t.priceCents / 100).toFixed(2)} € Differenz</span>
            </div>
            <Button size="sm" onClick={() => handleUpgrade(t.planId)} disabled={upgrading === t.planId}>
              {upgrading === t.planId ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <ArrowUp className="h-3 w-3 mr-1" />}
              Upgraden
            </Button>
          </div>
        ))}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </CardContent>
    </Card>
  )
}
