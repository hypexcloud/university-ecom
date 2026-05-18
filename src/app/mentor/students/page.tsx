'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function MentorStudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/mentor/students')
      .then((r) => r.json())
      .then((data) => setStudents(data.students || []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Meine Teilnehmer</h1>
      <Card>
        <CardHeader><CardTitle>Teilnehmer ({students.length})</CardTitle></CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <p className="text-muted-foreground text-sm">Noch keine Teilnehmer zugewiesen.</p>
          ) : (
            <div className="space-y-2">
              {students.map((s: any) => {
                const briefing = (s.billing as Record<string, unknown>)?.creatorBriefing
                return (
                  <Link key={s.uid} href={`/mentor/students/${s.uid}`} className="flex items-center justify-between border rounded-lg p-3 hover:bg-accent transition-colors">
                    <div>
                      <p className="font-medium text-sm">{s.firstName} {s.lastName}</p>
                      <p className="text-xs text-muted-foreground">{s.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {s.discordUsername && <span className="text-xs text-muted-foreground">{s.discordUsername}</span>}
                      {briefing ? <Badge variant="default">Briefing</Badge> : <Badge variant="outline">Kein Briefing</Badge>}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
