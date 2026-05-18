'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, User, Mail, ChevronDown, ChevronRight, CheckCircle, XCircle } from 'lucide-react'

interface Submission {
  id: string
  status?: string
  personalInfo?: { firstName: string; lastName: string; email: string }
  experience?: { currentExperience: string; primaryGoal: string }
  courseSelection?: { interestedCourse: string; preferredPlan: string }
  submittedAt?: string
  [key: string]: unknown
}

const statusColors: Record<string, 'default' | 'destructive' | 'outline'> = {
  pending: 'outline', reviewed: 'default', approved: 'default', rejected: 'destructive',
}

export default function AdminIntakePage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    const res = await fetch('/api/admin/intake-submissions')
    if (res.ok) setSubmissions((await res.json()).submissions || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    setUpdating(id)
    await fetch(`/api/admin/intake-submissions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setUpdating(null)
    fetchData()
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Intake-Bewerbungen</h1>

      <Card>
        <CardHeader><CardTitle>Bewerbungen ({submissions.length})</CardTitle></CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <p className="text-muted-foreground">Keine Bewerbungen vorhanden.</p>
          ) : (
            <div className="space-y-2">
              {submissions.map((s) => {
                const isOpen = expanded === s.id
                const info = s.personalInfo
                return (
                  <div key={s.id} className="border rounded-lg">
                    <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50" onClick={() => setExpanded(isOpen ? null : s.id)}>
                      <div className="flex items-center gap-3">
                        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        <div>
                          <p className="font-medium text-sm">{info?.firstName || '—'} {info?.lastName || '—'}</p>
                          <p className="text-xs text-muted-foreground">{info?.email || '—'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={statusColors[s.status || 'pending'] || 'outline'}>{s.status || 'pending'}</Badge>
                        {s.submittedAt && <span className="text-xs text-muted-foreground">{new Date(s.submittedAt).toLocaleDateString('de-DE')}</span>}
                      </div>
                    </div>

                    {isOpen && (
                      <div className="px-3 pb-3 border-t pt-3 space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div><span className="text-muted-foreground">Erfahrung:</span> {s.experience?.currentExperience || '—'}</div>
                          <div><span className="text-muted-foreground">Ziel:</span> {s.experience?.primaryGoal || '—'}</div>
                          <div><span className="text-muted-foreground">Kurs:</span> {s.courseSelection?.interestedCourse || '—'}</div>
                          <div><span className="text-muted-foreground">Plan:</span> {s.courseSelection?.preferredPlan || '—'}</div>
                        </div>

                        {s.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleStatusUpdate(s.id, 'approved')} disabled={updating === s.id}>
                              <CheckCircle className="h-3 w-3 mr-1" /> Genehmigen
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(s.id, 'rejected')} disabled={updating === s.id}>
                              <XCircle className="h-3 w-3 mr-1" /> Ablehnen
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
