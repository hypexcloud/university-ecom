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

export default function MfaVerifyPage() {
  const [code, setCode] = useState('')
  const [factorId, setFactorId] = useState('')
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getFactors = async () => {
      const { data, error: listError } = await supabase.auth.mfa.listFactors()
      if (listError || !data?.totp || data.totp.length === 0) {
        // No factor enrolled — redirect to enroll
        router.replace('/admin/mfa/enroll')
        return
      }
      setFactorId(data.totp[0].id)
      setLoading(false)
    }

    getFactors()
  }, [supabase, router])

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
      setCode('')
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
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <ShieldCheck className="h-12 w-12 mx-auto text-primary mb-2" />
          <CardTitle>2FA-Verifizierung</CardTitle>
          <CardDescription>
            Geben Sie den Code aus Ihrer Authenticator-App ein.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
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
              Verifizieren
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
