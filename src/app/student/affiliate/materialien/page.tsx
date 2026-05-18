'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, Check, Image, FileText, Link as LinkIcon } from 'lucide-react'

export default function AffiliateMatrialienPage() {
  const [copied, setCopied] = useState('')
  const [source, setSource] = useState('')
  const [medium, setMedium] = useState('')
  const [campaign, setCampaign] = useState('')

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  // This would come from the affiliate stats API in production
  const code = 'MEINCODE'
  const utmLink = `${baseUrl}/?ref=${code}${source ? `&utm_source=${source}` : ''}${medium ? `&utm_medium=${medium}` : ''}${campaign ? `&utm_campaign=${campaign}` : ''}`

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Marketing-Materialien</h1>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><LinkIcon className="h-5 w-5" /> UTM Link Generator</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1"><Label>Source</Label><Input placeholder="instagram" value={source} onChange={(e) => setSource(e.target.value)} /></div>
            <div className="space-y-1"><Label>Medium</Label><Input placeholder="social" value={medium} onChange={(e) => setMedium(e.target.value)} /></div>
            <div className="space-y-1"><Label>Campaign</Label><Input placeholder="sommer2026" value={campaign} onChange={(e) => setCampaign(e.target.value)} /></div>
          </div>
          <div className="flex gap-2">
            <Input value={utmLink} readOnly className="font-mono text-xs" />
            <Button variant="outline" onClick={() => handleCopy(utmLink, 'utm')}>
              {copied === 'utm' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Swipe Copy</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[
            'Ich habe den AI-Kurs bei University Ecom gemacht und bin begeistert! Spare mit meinem Link:',
            'EU-Dropshipping lernen von den Besten — starte jetzt mit meinem Empfehlungslink:',
            'Willst du mit AI oder Dropshipping online Geld verdienen? Hier ist mein Tipp:',
          ].map((text, i) => (
            <div key={i} className="flex items-start gap-2 border rounded-lg p-3">
              <p className="text-sm flex-1">{text}</p>
              <Button variant="ghost" size="sm" onClick={() => handleCopy(text + ' ' + utmLink, `swipe-${i}`)}>
                {copied === `swipe-${i}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Image className="h-5 w-5" /> Banner</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Banner-Materialien werden in Kürze bereitgestellt.</p>
        </CardContent>
      </Card>
    </div>
  )
}
