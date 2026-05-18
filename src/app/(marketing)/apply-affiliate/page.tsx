'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function ApplyAffiliatePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '', email: user?.email || '', reason: '', website: '', experience: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/apply-affiliate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: user?.id }),
      })
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || 'Fehler') }
      setSuccess(true)
      setTimeout(() => router.push('/affiliate'), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
    } finally { setLoading(false) }
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold text-prestige-white">Bewerbung eingereicht!</h2>
          <p className="text-prestige-gray-400">Wir prüfen deine Bewerbung und melden uns innerhalb von 48 Stunden.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-prestige-black px-6 py-12">
      <div className="container mx-auto max-w-2xl">
        <Link href="/affiliate" className="inline-flex items-center gap-2 text-prestige-gray-400 hover:text-prestige-white mb-8">
          <ArrowLeft className="h-4 w-4" /> Zurück
        </Link>

        <div className="border border-prestige-gray-800 rounded-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-prestige-white flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-prestige-gold-500" />
              Affiliate-Partner werden
            </h1>
            <p className="text-prestige-gray-400 mt-2">Verdiene Provisionen, indem du University Ecom weiterempfiehlst</p>
          </div>

          {/* Commission Info */}
          <div className="mb-8 p-4 bg-prestige-gold-500/10 border border-prestige-gold-500/30 rounded-lg">
            <h3 className="font-semibold text-prestige-gold-500 mb-2">Unsere Provisionen:</h3>
            <ul className="space-y-1 text-sm text-prestige-gray-300">
              <li>• <strong>Fast Plan (€200):</strong> 15% = €30 pro Verkauf</li>
              <li>• <strong>Business Plan (€1.000):</strong> 15% = €150 pro Verkauf</li>
              <li>• <strong>Infinity Plan (€3.000):</strong> 15% = €450 pro Verkauf</li>
            </ul>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-prestige-white mb-2">Dein Name *</label>
              <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Max Mustermann"
                className="w-full px-4 py-3 bg-prestige-gray-900 border border-prestige-gray-700 rounded-lg text-prestige-white placeholder:text-prestige-gray-600 focus:border-prestige-gold-500 focus:outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-prestige-white mb-2">E-Mail *</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="max@beispiel.de"
                className="w-full px-4 py-3 bg-prestige-gray-900 border border-prestige-gray-700 rounded-lg text-prestige-white placeholder:text-prestige-gray-600 focus:border-prestige-gold-500 focus:outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-prestige-white mb-2">Warum möchtest du Affiliate werden? *</label>
              <textarea required rows={4} value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Erzähle uns, warum du University Ecom promoten möchtest..."
                className="w-full px-4 py-3 bg-prestige-gray-900 border border-prestige-gray-700 rounded-lg text-prestige-white placeholder:text-prestige-gray-600 focus:border-prestige-gold-500 focus:outline-none resize-y" />
            </div>

            <div>
              <label className="block text-sm font-medium text-prestige-white mb-2">Website oder Social Media (Optional)</label>
              <input value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-3 bg-prestige-gray-900 border border-prestige-gray-700 rounded-lg text-prestige-white placeholder:text-prestige-gray-600 focus:border-prestige-gold-500 focus:outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-prestige-white mb-2">Erfahrung im Affiliate Marketing (Optional)</label>
              <textarea rows={3} value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="Beschreibe deine Erfahrung..."
                className="w-full px-4 py-3 bg-prestige-gray-900 border border-prestige-gray-700 rounded-lg text-prestige-white placeholder:text-prestige-gray-600 focus:border-prestige-gold-500 focus:outline-none resize-y" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-4 bg-prestige-gold-500 text-black font-bold rounded-lg hover:bg-prestige-gold-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
              {loading ? 'Wird eingereicht...' : 'Bewerbung absenden'}
            </button>

            <p className="text-xs text-center text-prestige-gray-500">
              Mit der Bewerbung akzeptierst du unsere <Link href="/legal/agb" className="text-prestige-gold-500 hover:underline">Affiliate-Bedingungen</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
