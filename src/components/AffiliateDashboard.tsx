'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Copy, 
  Check,
  ExternalLink,
  Calendar,
  Loader2,
  Share2
} from 'lucide-react'
import { generateReferralUrl, calculateConversionRate } from '@/lib/affiliate-utils'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

interface AffiliateDashboardProps {
  userId: string
}

export default function AffiliateDashboard({ userId }: AffiliateDashboardProps) {
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [affiliateData, setAffiliateData] = useState<any>(null)
  const [commissions, setCommissions] = useState<any[]>([])
  const [clicks, setClicks] = useState<any[]>([])

  useEffect(() => {
    loadAffiliateData()
  }, [userId])

  const loadAffiliateData = async () => {
    setLoading(true)
    try {
      // Load affiliate data
      const response = await fetch(`/api/affiliate-data?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setAffiliateData(data.affiliateData)
        setCommissions(data.commissions || [])
        setClicks(data.clicks || [])
      }
    } catch (err) {
      console.error('Error loading affiliate data:', err)
    } finally {
      setLoading(false)
    }
  }

  const copyReferralLink = () => {
    const url = generateReferralUrl(affiliateData?.code)
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareOnSocial = (platform: string) => {
    const url = generateReferralUrl(affiliateData?.code)
    const text = 'Schau dir University Ecom an - Die beste Plattform für AI Automatisierung!'
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    }
    
    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!affiliateData) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-600 mb-4">Sie sind noch kein Affiliate-Partner.</p>
          <Button asChild>
            <a href="/apply-affiliate">Jetzt bewerben</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const stats = {
    totalEarnings: affiliateData.totalEarnings || 0,
    pendingEarnings: affiliateData.pendingEarnings || 0,
    paidEarnings: affiliateData.paidEarnings || 0,
    totalReferrals: affiliateData.totalReferrals || 0,
    totalClicks: clicks.length,
    conversions: commissions.filter(c => c.status !== 'rejected').length,
    conversionRate: calculateConversionRate(clicks.length, commissions.filter(c => c.status !== 'rejected').length)
  }

  const pendingCommissions = commissions.filter(c => c.status === 'pending')
  const approvedCommissions = commissions.filter(c => c.status === 'approved')

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamt Verdienst</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{stats.totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Alle Zeit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ausstehend</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{stats.pendingEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {pendingCommissions.length} Provisionen
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ausgezahlt</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{stats.paidEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {affiliateData.lastPayoutAt 
                ? format(affiliateData.lastPayoutAt.toDate(), 'd. MMM', { locale: de })
                : 'Noch keine Auszahlung'
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empfehlungen</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReferrals}</div>
            <p className="text-xs text-muted-foreground">
              {stats.conversionRate}% Conversion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link Section */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Ihr Empfehlungslink
          </CardTitle>
          <CardDescription>Teilen Sie diesen Link, um Provisionen zu verdienen</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={generateReferralUrl(affiliateData.code)}
              readOnly
              className="bg-white"
            />
            <Button onClick={copyReferralLink} className="flex-shrink-0">
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Kopiert!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Kopieren
                </>
              )}
            </Button>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Auf Social Media teilen:</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => shareOnSocial('twitter')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button variant="outline" size="sm" onClick={() => shareOnSocial('facebook')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Facebook
              </Button>
              <Button variant="outline" size="sm" onClick={() => shareOnSocial('linkedin')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <p className="text-sm font-medium mb-2">Ihr Code:</p>
            <code className="text-lg font-bold text-blue-600">{affiliateData.code}</code>
          </div>
        </CardContent>
      </Card>

      {/* Performance Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Klicks gesamt</span>
              <span className="font-bold">{stats.totalClicks}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Conversions</span>
              <span className="font-bold">{stats.conversions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Conversion Rate</span>
              <Badge variant="outline">{stats.conversionRate}%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Ø Provision</span>
              <span className="font-bold">
                €{stats.conversions > 0 ? (stats.totalEarnings / stats.conversions).toFixed(2) : '0.00'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Provisions-Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Ausstehend</span>
              <div className="text-right">
                <p className="font-bold">€{stats.pendingEarnings.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{pendingCommissions.length} Aufträge</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Genehmigt</span>
              <div className="text-right">
                <p className="font-bold text-green-600">
                  €{approvedCommissions.reduce((sum, c) => sum + c.amount, 0).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">{approvedCommissions.length} Aufträge</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Ausgezahlt</span>
              <div className="text-right">
                <p className="font-bold text-blue-600">€{stats.paidEarnings.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Lifetime</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Commissions */}
      <Card>
        <CardHeader>
          <CardTitle>Letzte Provisionen</CardTitle>
          <CardDescription>Ihre neuesten Empfehlungen</CardDescription>
        </CardHeader>
        <CardContent>
          {commissions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Noch keine Provisionen. Teilen Sie Ihren Link!
            </p>
          ) : (
            <div className="space-y-3">
              {commissions.slice(0, 10).map((commission) => (
                <div 
                  key={commission.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">€{commission.amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">
                      {commission.createdAt && format(commission.createdAt.toDate(), 'd. MMM yyyy', { locale: de })}
                    </p>
                  </div>
                  <Badge 
                    variant={
                      commission.status === 'paid' ? 'default' :
                      commission.status === 'approved' ? 'secondary' :
                      commission.status === 'rejected' ? 'destructive' :
                      'outline'
                    }
                  >
                    {commission.status === 'pending' && 'Ausstehend'}
                    {commission.status === 'approved' && 'Genehmigt'}
                    {commission.status === 'paid' && 'Ausgezahlt'}
                    {commission.status === 'rejected' && 'Abgelehnt'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
