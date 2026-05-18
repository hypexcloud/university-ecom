'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, CheckCircle } from 'lucide-react'

interface CryptoOrder {
  id: string
  customerUid: string
  totalCents: number
  createdAt: string
  customerEmail: string
  customerFirstName: string
  customerLastName: string
}

export default function AdminPaymentsPage() {
  const [orders, setOrders] = useState<CryptoOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState<string | null>(null)
  const [txHash, setTxHash] = useState('')

  const fetchOrders = useCallback(async () => {
    const res = await fetch('/api/admin/payments')
    if (res.ok) {
      const data = await res.json()
      setOrders(data.orders)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleConfirm = async (orderId: string) => {
    if (!txHash.trim()) return
    setConfirming(orderId)
    await fetch(`/api/admin/payments/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'paid', txHash: txHash.trim() }),
    })
    setTxHash('')
    setConfirming(null)
    fetchOrders()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Crypto-Zahlungen</h1>

      <Card>
        <CardHeader>
          <CardTitle>Wartende Bestellungen</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : orders.length === 0 ? (
            <p className="text-muted-foreground">Keine offenen Crypto-Bestellungen.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {order.customerFirstName} {order.customerLastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{(order.totalCents / 100).toFixed(2)} €</p>
                      <Badge variant="outline">awaiting_crypto</Badge>
                    </div>
                  </div>

                  <div className="flex gap-2 items-end">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">Transaktions-Hash</Label>
                      <Input
                        placeholder="0x... oder BTC TX ID"
                        value={confirming === order.id ? txHash : ''}
                        onChange={(e) => {
                          setConfirming(order.id)
                          setTxHash(e.target.value)
                        }}
                      />
                    </div>
                    <Button
                      onClick={() => handleConfirm(order.id)}
                      disabled={confirming === order.id && !txHash.trim()}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Bestätigen
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
