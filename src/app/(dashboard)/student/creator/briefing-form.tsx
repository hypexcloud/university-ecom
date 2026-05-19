'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2, Upload, CheckCircle } from 'lucide-react'

export function CreatorBriefingForm() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    vorname: '', nachname: '', socialLink: '', nische: '',
    follower: '', views: '', ziele: '', probleme: '', erfahrungen: '',
  })
  const [fileUrl, setFileUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const update = (key: string, value: string) => setForm({ ...form, [key]: value })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/creator/briefing-upload', { method: 'POST', body: fd })
    if (res.ok) {
      const data = await res.json()
      setFileUrl(data.url)
    }
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/creator/briefing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, ...(fileUrl ? { fileUrl } : {}) }),
    })
    setLoading(false)
    router.refresh()
  }

  const fields: { key: string; label: string; type: 'input' | 'textarea' }[] = [
    { key: 'vorname', label: 'Vorname', type: 'input' },
    { key: 'nachname', label: 'Nachname', type: 'input' },
    { key: 'socialLink', label: 'Social Media Link', type: 'input' },
    { key: 'nische', label: 'Nische', type: 'input' },
    { key: 'follower', label: 'Aktuelle Follower', type: 'input' },
    { key: 'views', label: 'Durchschnittliche Views', type: 'input' },
    { key: 'ziele', label: 'Deine Ziele', type: 'textarea' },
    { key: 'probleme', label: 'Aktuelle Probleme', type: 'textarea' },
    { key: 'erfahrungen', label: 'Bisherige Erfahrungen', type: 'textarea' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Bitte fülle das Briefing aus, damit wir uns optimal auf dein erstes Gespräch vorbereiten können.
      </p>
      {fields.map((f) => (
        <div key={f.key} className="space-y-1">
          <Label>{f.label}</Label>
          {f.type === 'input' ? (
            <Input
              value={form[f.key as keyof typeof form]}
              onChange={(e) => update(f.key, e.target.value)}
              required
            />
          ) : (
            <Textarea
              value={form[f.key as keyof typeof form]}
              onChange={(e) => update(f.key, e.target.value)}
              required
              className="min-h-[80px]"
            />
          )}
        </div>
      ))}
      <div className="space-y-1">
        <Label>Datei-Upload (optional)</Label>
        <div className="flex items-center gap-2">
          <Input type="file" onChange={handleFileUpload} disabled={uploading} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
          {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
          {fileUrl && <CheckCircle className="h-4 w-4 text-green-600" />}
        </div>
        <p className="text-xs text-muted-foreground">PDF, Word oder Bild, max. 10 MB</p>
      </div>

      <Button type="submit" disabled={loading || uploading}>
        {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
        Briefing einreichen
      </Button>
    </form>
  )
}
