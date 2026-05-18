'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Eye, EyeOff } from 'lucide-react'

interface GiftcardCodeProps {
  code: string
  balanceCents: number
  initialCents: number
  status: string
}

export function GiftcardCode({ code, balanceCents, initialCents, status }: GiftcardCodeProps) {
  const [revealed, setRevealed] = useState(false)
  const masked = code.slice(0, 4) + '-****-' + code.slice(-4)

  return (
    <div className="flex items-center justify-between border rounded-lg p-4">
      <div className="flex items-center gap-3">
        <button onClick={() => setRevealed(!revealed)} className="text-muted-foreground hover:text-foreground">
          {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
        <code className="font-mono font-bold tracking-wider">{revealed ? code : masked}</code>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span>{(balanceCents / 100).toFixed(2)} € / {(initialCents / 100).toFixed(2)} €</span>
        <Badge variant={status === 'active' ? 'default' : 'outline'}>{status}</Badge>
      </div>
    </div>
  )
}
