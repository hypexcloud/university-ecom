'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Loader2, Download, TrendingUp, Users, ShoppingCart, Ticket } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

interface AnalyticsData {
  kpi: { totalRevenueCents: number; newCustomers: number; totalOrders: number; openTickets: number }
  revenue: { date: string; totalCents: number }[]
  customers: { date: string; count: number }[]
  tickets: { open: number; inProgress: number; closed: number }
  affiliateRevenueCents: number
  sessions: { upcoming: number; completed: number; missed: number }
  topPlans: { planCode: string; productTitle: string; count: number }[]
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  const defaultFrom = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10)
  const defaultTo = new Date().toISOString().slice(0, 10)
  const [from, setFrom] = useState(defaultFrom)
  const [to, setTo] = useState(defaultTo)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/analytics?from=${from}T00:00:00Z&to=${to}T23:59:59Z`)
    if (res.ok) setData(await res.json())
    setLoading(false)
  }, [from, to])

  useEffect(() => { fetchData() }, [fetchData])

  const exportCsv = (type: string) => {
    window.open(`/api/admin/analytics/export?type=${type}&from=${from}T00:00:00Z&to=${to}T23:59:59Z`)
  }

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="flex items-center gap-2">
          <Label className="text-sm">Von</Label>
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-40" />
          <Label className="text-sm">Bis</Label>
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-40" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Umsatz</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(data.kpi.totalRevenueCents / 100).toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Neue Kunden</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.kpi.newCustomers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bestellungen</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.kpi.totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offene Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.kpi.openTickets}</div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Umsatz pro Tag</CardTitle>
          <Button variant="outline" size="sm" onClick={() => exportCsv('revenue')}>
            <Download className="h-4 w-4 mr-1" /> CSV
          </Button>
        </CardHeader>
        <CardContent>
          {data.revenue.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Keine Daten im Zeitraum.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.revenue.map((r) => ({ ...r, euro: r.totalCents / 100 }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(v) => new Date(v).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })} />
                <YAxis tickFormatter={(v) => `${v} €`} />
                <Tooltip formatter={(v) => [`${Number(v).toFixed(2)} €`, 'Umsatz']} labelFormatter={(l) => new Date(String(l)).toLocaleDateString('de-DE')} />
                <Area type="monotone" dataKey="euro" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Customers Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Neue Kunden pro Tag</CardTitle>
          <Button variant="outline" size="sm" onClick={() => exportCsv('customers')}>
            <Download className="h-4 w-4 mr-1" /> CSV
          </Button>
        </CardHeader>
        <CardContent>
          {data.customers.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Keine Daten im Zeitraum.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.customers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(v) => new Date(v).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })} />
                <YAxis allowDecimals={false} />
                <Tooltip labelFormatter={(l) => new Date(l).toLocaleDateString('de-DE')} />
                <Bar dataKey="count" fill="#D4AF37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Bottom row */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Top Plans */}
        <Card>
          <CardHeader><CardTitle>Top Pläne</CardTitle></CardHeader>
          <CardContent>
            {data.topPlans.length === 0 ? (
              <p className="text-muted-foreground">Keine Daten.</p>
            ) : (
              <div className="space-y-2">
                {data.topPlans.map((p, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span>{p.productTitle} — <Badge variant="outline">{p.planCode}</Badge></span>
                    <span className="font-medium">{p.count}x</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sessions */}
        <Card>
          <CardHeader><CardTitle>Sessions</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Anstehend</span><span className="font-bold">{data.sessions.upcoming}</span></div>
            <div className="flex justify-between"><span>Abgeschlossen</span><span className="font-bold">{data.sessions.completed}</span></div>
            <div className="flex justify-between"><span>Verpasst</span><span className="font-bold">{data.sessions.missed}</span></div>
          </CardContent>
        </Card>

        {/* Affiliate + Tickets */}
        <Card>
          <CardHeader><CardTitle>Affiliate & Tickets</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Affiliate-Provision</span><span className="font-bold">{(data.affiliateRevenueCents / 100).toFixed(2)} €</span></div>
            <div className="flex justify-between"><span>Tickets offen</span><span className="font-bold">{data.tickets.open}</span></div>
            <div className="flex justify-between"><span>In Bearbeitung</span><span className="font-bold">{data.tickets.inProgress}</span></div>
            <div className="flex justify-between"><span>Geschlossen</span><span className="font-bold">{data.tickets.closed}</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
