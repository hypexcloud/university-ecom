'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, X, Clock, Loader2 } from 'lucide-react'

export function SessionActions({ sessionId }: { sessionId: string }) {
  const [loading, setLoading] = useState(false)
  const [showPropose, setShowPropose] = useState(false)
  const [proposedTime, setProposedTime] = useState('')
  const router = useRouter()

  const handleAction = async (action: 'accept' | 'reject' | 'propose') => {
    setLoading(true)
    await fetch(`/api/sessions/${sessionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        ...(action === 'propose' ? { proposedTime: new Date(proposedTime).toISOString() } : {}),
      }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="flex gap-2 flex-wrap pt-2">
      <Button size="sm" onClick={() => handleAction('accept')} disabled={loading}>
        {loading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Check className="h-3 w-3 mr-1" />}
        Annehmen
      </Button>
      <Button size="sm" variant="destructive" onClick={() => handleAction('reject')} disabled={loading}>
        <X className="h-3 w-3 mr-1" /> Ablehnen
      </Button>
      <Button size="sm" variant="outline" onClick={() => setShowPropose(!showPropose)} disabled={loading}>
        <Clock className="h-3 w-3 mr-1" /> Alternativ vorschlagen
      </Button>

      {showPropose && (
        <div className="flex gap-2 w-full mt-2">
          <Input
            type="datetime-local"
            value={proposedTime}
            onChange={(e) => setProposedTime(e.target.value)}
          />
          <Button size="sm" onClick={() => handleAction('propose')} disabled={!proposedTime || loading}>
            Vorschlagen
          </Button>
        </div>
      )}
    </div>
  )
}
