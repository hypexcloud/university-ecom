'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2, Plus, Trash2, Video, GripVertical } from 'lucide-react'

interface Interview { id: string; title: string; description: string | null; videoUrl: string; thumbnailUrl: string | null; category: string | null; orderIndex: number }

export default function AdminInterviewsPage() {
  const [items, setItems] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', videoUrl: '', thumbnailUrl: '', category: '', orderIndex: 0 })

  const fetchItems = useCallback(async () => {
    const res = await fetch('/api/admin/interviews')
    if (res.ok) setItems((await res.json()).interviews || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  const handleCreate = async () => {
    setSaving(true)
    await fetch('/api/admin/interviews', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, orderIndex: items.length }),
    })
    setForm({ title: '', description: '', videoUrl: '', thumbnailUrl: '', category: '', orderIndex: 0 })
    setShowForm(false)
    setSaving(false)
    fetchItems()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Interview wirklich löschen?')) return
    await fetch(`/api/admin/interviews/${id}`, { method: 'DELETE' })
    fetchItems()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Interviews & Videos</h1>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-1" /> Neues Video</Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>Neues Interview/Video</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>Titel *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div className="space-y-1"><Label>Kategorie</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="z.B. Podcast, Interview" /></div>
            </div>
            <div className="space-y-1"><Label>Video-URL *</Label><Input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://..." /></div>
            <div className="space-y-1"><Label>Thumbnail-URL</Label><Input value={form.thumbnailUrl} onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })} placeholder="https://..." /></div>
            <div className="space-y-1"><Label>Beschreibung</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={saving || !form.title || !form.videoUrl}>
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-1" />} Erstellen
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Abbrechen</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Videos ({items.length})</CardTitle></CardHeader>
        <CardContent>
          {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : items.length === 0 ? (
            <p className="text-muted-foreground">Keine Videos vorhanden.</p>
          ) : (
            <div className="space-y-2">
              {items.map((v, i) => (
                <div key={v.id} className="flex items-center justify-between border rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-6">#{i + 1}</span>
                    {v.thumbnailUrl ? <img src={v.thumbnailUrl} alt="" className="w-16 h-10 object-cover rounded" /> : <div className="w-16 h-10 bg-muted rounded flex items-center justify-center"><Video className="h-4 w-4 text-muted-foreground" /></div>}
                    <div>
                      <p className="font-medium text-sm">{v.title}</p>
                      <p className="text-xs text-muted-foreground">{v.category && <Badge variant="outline" className="mr-1">{v.category}</Badge>}{v.videoUrl.slice(0, 40)}...</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(v.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
