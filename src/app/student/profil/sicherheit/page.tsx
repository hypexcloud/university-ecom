'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'
import { Shield, Key, Loader2 } from 'lucide-react'

export default function SicherheitPage() {
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const supabase = createClient()

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
    setSaving(false)

    if (updateError) {
      setError(updateError.message)
    } else {
      setMessage('Passwort erfolgreich geändert')
      setCurrentPw('')
      setNewPw('')
      setConfirmPw('')
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Sicherheit</h1>

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

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Zwei-Faktor-Authentifizierung</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">Schütze dein Konto zusätzlich mit einer Authenticator-App.</p>
          <Button variant="outline" asChild>
            <a href="/admin/mfa/enroll">2FA einrichten</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
