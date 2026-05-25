'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'
import { Shield, Key, Loader2, AlertCircle } from 'lucide-react'

export default function SicherheitPage() {
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isForced, setIsForced] = useState(false)
  const router = useRouter()

  const supabase = createClient()

  useEffect(() => {
    // Check if this is a forced password change (cookie set by login)
    const hasCookie = document.cookie.split(';').some(c => c.trim().startsWith('x-must-change-pw='))
    setIsForced(hasCookie)
  }, [])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (newPw !== confirmPw) {
      setError('Passwörter stimmen nicht überein')
      return
    }
    if (newPw.length < 8) {
      setError('Passwort muss mindestens 8 Zeichen haben')
      return
    }

    setSaving(true)
    const { error: updateError } = await supabase.auth.updateUser({ password: newPw })

    if (updateError) {
      setSaving(false)
      setError(updateError.message)
      return
    }

    // Clear the mustChangePassword flag in DB
    const res = await fetch('/api/student/clear-password-flag', { method: 'POST' })
    setSaving(false)

    if (!res.ok) {
      setError('Passwort geändert, aber ein Fehler ist aufgetreten. Bitte neu einloggen.')
      return
    }

    // Clear the middleware cookie
    document.cookie = 'x-must-change-pw=; path=/; max-age=0'

    if (isForced) {
      // Determine next redirect (booking for business/infinity, or dashboard)
      const data = await res.json()
      const redirect = data.redirect || '/student'
      setMessage('Passwort erfolgreich geändert! Du wirst weitergeleitet...')
      setTimeout(() => router.push(redirect), 1500)
    } else {
      setMessage('Passwort erfolgreich geändert')
      setNewPw('')
      setConfirmPw('')
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Sicherheit</h2>

      {isForced && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Bitte ändere dein temporäres Passwort, bevor du fortfahren kannst.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Key className="h-5 w-5" /> Passwort ändern</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            {message && <Alert><AlertDescription>{message}</AlertDescription></Alert>}
            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
            <div className="space-y-1">
              <Label>Neues Passwort</Label>
              <Input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Mindestens 8 Zeichen" />
            </div>
            <div className="space-y-1">
              <Label>Passwort bestätigen</Label>
              <Input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
            </div>
            <Button type="submit" disabled={saving || !newPw || !confirmPw}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Passwort ändern
            </Button>
          </form>
        </CardContent>
      </Card>

      {!isForced && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Zwei-Faktor-Authentifizierung</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Schütze dein Konto zusätzlich mit einer Authenticator-App.</p>
            <Button variant="outline" asChild>
              <a href="/admin/mfa/enroll">2FA einrichten</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
