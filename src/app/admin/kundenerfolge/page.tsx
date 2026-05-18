'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Plus, Trash2, Image, Video } from 'lucide-react'

interface Erfolg { id: string; title: string; description: string | null; mediaType: string; mediaUrl: string; orderIndex: number }

export default function AdminKundenerPage() {
  const [items, setItems] = useState<Erfolg[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', mediaType: 'image', mediaUrl: '' })

  const fetchItems = useCallback(async () => {
    const res = await fetch('/api/admin/kundenerfolge')
    if (res.ok) setItems((await res.json()).kundenerfolge || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  const handleCreate = async () => {
    setSaving(true)
    await fetch('/api/admin/kundenerfolge', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, orderIndex: items.length }),
    })
    setForm({ title: '', description: '', mediaType: 'image', mediaUrl: '' })
    setShowForm(false)
    setSaving(false)
    fetchItems()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Eintrag wirklich löschen?')) return
    await fetch(`/api/admin/kundenerfolge/${id}`, { method: 'DELETE' })
    fetchItems()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Kundenerfolge</h1>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-1" /> Neuer Erfolg</Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>Neuer Kundenerfolg</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>Titel *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div className="space-y-1">
                <Label>Medientyp *</Label>
                <Select value={form.mediaType} onValueChange={(v) => setForm({ ...form, mediaType: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Bild</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1"><Label>Medien-URL *</Label><Input value={form.mediaUrl} onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })} placeholder="https://..." /></div>
            <div className="space-y-1"><Label>Beschreibung</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={saving || !form.title || !form.mediaUrl}>
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-1" />} Erstellen
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Abbrechen</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Erfolge ({items.length})</CardTitle></CardHeader>
        <CardContent>
          {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : items.length === 0 ? (
            <p className="text-muted-foreground">Keine Kundenerfolge vorhanden.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {items.map((e, i) => (
                <div key={e.id} className="border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-muted relative">
                    {e.mediaType === 'image' ? (
                      <img src={e.mediaUrl} alt={e.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Video className="h-8 w-8 text-muted-foreground" /></div>
                    )}
                    <Badge variant="default" className="absolute top-2 left-2 text-xs">#{i + 1}</Badge>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{e.title}</p>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(e.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                    </div>
                    {e.description && <p className="text-xs text-muted-foreground mt-1">{e.description}</p>}
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
