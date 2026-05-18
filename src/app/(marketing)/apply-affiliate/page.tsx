'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function ApplyAffiliatePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    reason: '',
    website: '',
    experience: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/apply-affiliate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: user?.id
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Application failed')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/')
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="container mx-auto py-16 px-4 max-w-2xl">
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <strong className="text-green-900">Bewerbung erfolgreich eingereicht!</strong>
            <p className="text-green-800 mt-1">
              Wir prüfen Ihre Bewerbung und melden uns innerhalb von 48 Stunden bei Ihnen.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <TrendingUp className="h-7 w-7" />
            Affiliate-Partner werden
          </CardTitle>
          <CardDescription>
            Verdienen Sie Provisionen, indem Sie University Ecom weiterempfehlen
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Commission Info */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-2">Unsere Provisionen:</h3>
            <ul className="space-y-1 text-sm">
              <li>• <strong>Fast Plan (€200):</strong> 10% = €20 pro Verkauf</li>
              <li>• <strong>Business Plan (€1.000):</strong> 15% = €150 pro Verkauf</li>
              <li>• <strong>Infinity Plan (€3.000):</strong> 20% = €600 pro Verkauf</li>
            </ul>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Ihr Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Max Mustermann"
              />
            </div>

            <div>
              <Label htmlFor="email">E-Mail *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="max@example.com"
              />
            </div>

            <div>
              <Label htmlFor="reason">Warum möchten Sie Affiliate-Partner werden? *</Label>
              <Textarea
                id="reason"
                required
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Erzählen Sie uns, warum Sie University Ecom promoten möchten..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="website">Ihre Website oder Social Media (Optional)</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label htmlFor="experience">Ihre Erfahrung im Affiliate Marketing (Optional)</Label>
              <Textarea
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="Beschreiben Sie Ihre Erfahrung..."
                rows={3}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird eingereicht...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Bewerbung absenden
                </>
              )}
            </Button>

            <p className="text-xs text-center text-gray-500">
              Mit der Bewerbung akzeptieren Sie unsere Affiliate-Bedingungen
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
