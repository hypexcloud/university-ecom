'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { TrendingUp, Loader2, Save } from 'lucide-react'

export default function FortschrittPage() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    followerCount: '',
    totalViews: '',
    viewsPerDay: '',
    wins: '',
    blockers: '',
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    // Store in creator briefing data (extend the existing API)
    await fetch('/api/creator/briefing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vorname: '-', nachname: '-', socialLink: 'https://placeholder.com',
        nische: '-', follower: form.followerCount, views: form.totalViews,
        ziele: form.wins, probleme: form.blockers, erfahrungen: form.viewsPerDay,
      }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold">Fortschritt</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Wöchentlicher Fortschrittsbericht</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label>Follower</Label>
                <Input type="number" placeholder="z.B. 1250" value={form.followerCount} onChange={(e) => setForm({ ...form, followerCount: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Gesamte Views</Label>
                <Input type="number" placeholder="z.B. 50000" value={form.totalViews} onChange={(e) => setForm({ ...form, totalViews: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Views/Tag</Label>
                <Input type="number" placeholder="z.B. 500" value={form.viewsPerDay} onChange={(e) => setForm({ ...form, viewsPerDay: e.target.value })} />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Erfolge diese Woche</Label>
              <Textarea placeholder="Was lief gut? Neue Meilensteine, virale Videos, etc." value={form.wins} onChange={(e) => setForm({ ...form, wins: e.target.value })} className="min-h-[80px]" />
            </div>

            <div className="space-y-1">
              <Label>Blocker / Herausforderungen</Label>
              <Textarea placeholder="Womit brauchst du Hilfe?" value={form.blockers} onChange={(e) => setForm({ ...form, blockers: e.target.value })} className="min-h-[80px]" />
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                {saved ? 'Gespeichert!' : 'Bericht speichern'}
              </Button>

              <Button type="button" variant="outline" disabled>
                Mit TikTok verbinden
                <span className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded">Bald verfügbar</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
