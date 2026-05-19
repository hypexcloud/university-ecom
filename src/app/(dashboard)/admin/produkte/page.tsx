'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Save, Plus } from 'lucide-react'

interface Plan {
  id: string
  code: string
  priceCents: number
  features: unknown
}

interface Product {
  id: string
  kind: string
  slug: string
  title: string
  isActive: boolean
  plans: Plan[]
}

export default function AdminProduktePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [editPrices, setEditPrices] = useState<Record<string, string>>({})

  const fetchData = useCallback(async () => {
    const res = await fetch('/api/admin/products')
    if (res.ok) {
      const data = await res.json()
      setProducts(data.products)
      // Initialize price inputs
      const prices: Record<string, string> = {}
      for (const p of data.products) {
        for (const pl of p.plans) {
          prices[pl.id] = (pl.priceCents / 100).toFixed(2)
        }
      }
      setEditPrices(prices)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleToggleActive = async (productId: string, current: boolean) => {
    setSaving(productId)
    await fetch(`/api/admin/products/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !current }),
    })
    setSaving(null)
    fetchData()
  }

  const handleSavePrice = async (planId: string) => {
    const euros = parseFloat(editPrices[planId])
    if (isNaN(euros) || euros < 0) return
    setSaving(planId)
    await fetch(`/api/admin/plans/${planId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceCents: Math.round(euros * 100) }),
    })
    setSaving(null)
    fetchData()
  }

  const handleEditTitle = async (productId: string, title: string) => {
    if (!title.trim()) return
    setSaving(productId)
    await fetch(`/api/admin/products/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
    setSaving(null)
    fetchData()
  }

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Produkte & Preise</h1>

      {products.map((product) => (
        <Card key={product.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle>{product.title}</CardTitle>
                <Badge variant="outline">{product.kind}</Badge>
                <Badge variant={product.isActive ? 'default' : 'destructive'}>
                  {product.isActive ? 'Aktiv' : 'Inaktiv'}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleActive(product.id, product.isActive ?? true)}
                disabled={saving === product.id}
              >
                {product.isActive ? 'Deaktivieren' : 'Aktivieren'}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Slug: {product.slug}</p>
          </CardHeader>
          <CardContent>
            {product.plans.length === 0 ? (
              <p className="text-muted-foreground text-sm">Keine Pläne konfiguriert.</p>
            ) : (
              <div className="space-y-3">
                {product.plans.map((plan) => (
                  <div key={plan.id} className="flex items-center gap-4 border rounded-lg p-3">
                    <Badge variant="outline" className="w-24 justify-center">{plan.code}</Badge>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">Preis (EUR)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editPrices[plan.id] || ''}
                        onChange={(e) => setEditPrices({ ...editPrices, [plan.id]: e.target.value })}
                        className="w-28"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSavePrice(plan.id)}
                        disabled={saving === plan.id}
                      >
                        {saving === plan.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                      </Button>
                    </div>
                    <span className="text-xs text-muted-foreground ml-auto">
                      Aktuell: {(plan.priceCents / 100).toFixed(2)} €
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
