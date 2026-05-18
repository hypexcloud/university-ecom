'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function MfaEnrollPage() {
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')
  const [factorId, setFactorId] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const enroll = async () => {
      const { data, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'University Ecom Admin',
      })

      if (enrollError) {
        setError(enrollError.message)
        setLoading(false)
        return
      }

      if (data) {
        setQrCode(data.totp.qr_code)
        setSecret(data.totp.secret)
        setFactorId(data.id)
      }
      setLoading(false)
    }

    enroll()
  }, [supabase])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setVerifying(true)
    setError('')

    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId,
    })

    if (challengeError) {
      setError(challengeError.message)
      setVerifying(false)
      return
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code,
    })

    if (verifyError) {
      setError('Ungültiger Code. Bitte erneut versuchen.')
      setVerifying(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <ShieldCheck className="h-12 w-12 mx-auto text-primary mb-2" />
          <CardTitle>2FA einrichten</CardTitle>
          <CardDescription>
            Als Admin ist die Zwei-Faktor-Authentifizierung Pflicht.
            Scannen Sie den QR-Code mit Ihrer Authenticator-App.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {qrCode && (
            <div className="flex justify-center">
              <img src={qrCode} alt="TOTP QR Code" className="w-48 h-48" />
            </div>
          )}

          {secret && (
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Manueller Schlüssel:</p>
              <code className="text-xs font-mono break-all">{secret}</code>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">6-stelliger Code</Label>
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={verifying}
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full" disabled={code.length !== 6 || verifying}>
              {verifying ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Bestätigen
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
