'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Plus, Trash2 } from 'lucide-react'

const CATEGORIES = ['news', 'updates', 'ankuendigungen', 'erfolge'] as const

export default function AdminCommunityPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ category: 'news', title: '', body: '' })
  const [saving, setSaving] = useState(false)

  const fetchPosts = useCallback(async () => {
    const res = await fetch('/api/admin/community')
    if (res.ok) { const data = await res.json(); setPosts(data.posts) }
    setLoading(false)
  }, [])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  const handleCreate = async () => {
    setSaving(true)
    await fetch('/api/admin/community', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, publishNow: true }),
    })
    setForm({ category: 'news', title: '', body: '' })
    setShowForm(false)
    setSaving(false)
    fetchPosts()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/community/${id}`, { method: 'DELETE' })
    fetchPosts()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Community / News</h1>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-1" /> Neuer Beitrag</Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input placeholder="Titel" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Textarea placeholder="Inhalt..." value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="min-h-[120px]" />
            <Button onClick={handleCreate} disabled={saving || !form.title || !form.body}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-1" />} Veröffentlichen
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Beiträge ({posts.length})</CardTitle></CardHeader>
        <CardContent>
          {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : posts.length === 0 ? (
            <p className="text-muted-foreground">Keine Beiträge.</p>
          ) : (
            <div className="space-y-2">
              {posts.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between border rounded-lg p-3">
                  <div>
                    <p className="font-medium">{p.title}</p>
                    <Badge variant="outline" className="capitalize">{p.category}</Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
