'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Ban, CheckCircle } from 'lucide-react'

interface GrantRevokeActionsProps {
  customerUid: string
  allPlans: { id: string; code: string; productTitle: string }[]
  activeEntitlementIds: string[]
}

export function GrantRevokeActions({ customerUid, allPlans, activeEntitlementIds }: GrantRevokeActionsProps) {
  const [selectedPlan, setSelectedPlan] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleGrant = async () => {
    if (!selectedPlan) return
    setLoading(true)
    await fetch('/api/admin/entitlements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerUid, planId: selectedPlan, action: 'grant' }),
    })
    setLoading(false)
    router.refresh()
  }

  const handleRevoke = async (entitlementId: string) => {
    setLoading(true)
    await fetch('/api/admin/entitlements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entitlementId, action: 'revoke' }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="space-y-4 pt-4 border-t">
      <div className="flex gap-2">
        <Select value={selectedPlan} onValueChange={setSelectedPlan}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Plan auswählen..." />
          </SelectTrigger>
          <SelectContent>
            {allPlans.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.productTitle} — {p.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleGrant} disabled={!selectedPlan || loading}>
          Freischalten
        </Button>
      </div>

      {activeEntitlementIds.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {activeEntitlementIds.map((id) => (
            <Button
              key={id}
              variant="destructive"
              size="sm"
              onClick={() => handleRevoke(id)}
              disabled={loading}
            >
              Widerrufen ({id.slice(0, 8)}...)
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}

export function SuspendButton({ customerUid, currentStatus }: { customerUid: string; currentStatus: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const isSuspended = currentStatus === 'suspended'

  const handleToggle = async () => {
    setLoading(true)
    await fetch(`/api/admin/customers/${customerUid}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: isSuspended ? 'active' : 'suspended' }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <Button
      variant={isSuspended ? 'default' : 'destructive'}
      size="sm"
      onClick={handleToggle}
      disabled={loading}
    >
      {isSuspended ? <CheckCircle className="h-4 w-4 mr-1" /> : <Ban className="h-4 w-4 mr-1" />}
      {isSuspended ? 'Reaktivieren' : 'Sperren'}
    </Button>
  )
}
