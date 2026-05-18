'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Loader2, Plus, Trash2, Upload } from 'lucide-react'

interface Video {
  guid: string
  title: string
  length: number
  status: number
  storageSize: number
  dateUploaded: string
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [creating, setCreating] = useState(false)

  const fetchVideos = useCallback(async () => {
    const res = await fetch('/api/admin/videos')
    if (res.ok) {
      const data = await res.json()
      setVideos(data.items || [])
      setTotal(data.totalItems || 0)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchVideos() }, [fetchVideos])

  const handleCreate = async () => {
    if (!title.trim()) return
    setCreating(true)
    const res = await fetch('/api/admin/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
    if (res.ok) {
      const data = await res.json()
      alert(`Video erstellt. Upload-URL:\n${data.uploadUrl}\n\nVideoId: ${data.videoId}`)
      setTitle('')
      fetchVideos()
    }
    setCreating(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Video wirklich löschen?')) return
    await fetch(`/api/admin/videos/${id}`, { method: 'DELETE' })
    fetchVideos()
  }

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${String(sec).padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Videos (Bunny Stream)</h1>

      <Card>
        <CardHeader><CardTitle>Neues Video anlegen</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input placeholder="Video-Titel" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Button onClick={handleCreate} disabled={creating || !title.trim()}>
              {creating ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
              Anlegen
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Erstellt einen Platzhalter in Bunny Stream. Die Upload-URL wird danach angezeigt (TUS-Upload).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Videobibliothek ({total})</CardTitle></CardHeader>
        <CardContent>
          {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : videos.length === 0 ? (
            <p className="text-muted-foreground">Keine Videos vorhanden. Bunny Stream konfiguriert?</p>
          ) : (
            <div className="space-y-2">
              {videos.map((v) => (
                <div key={v.guid} className="flex items-center justify-between border rounded-lg p-3 text-sm">
                  <div>
                    <p className="font-medium">{v.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDuration(v.length)} · {(v.storageSize / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={v.status === 4 ? 'default' : 'outline'}>
                      {v.status === 4 ? 'Bereit' : 'Verarbeitung'}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(v.guid)}>
                      <Trash2 className="h-4 w-4" />
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
