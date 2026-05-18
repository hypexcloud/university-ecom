'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Plus, Trash2, ChevronDown, ChevronRight, BookOpen, Video, FileText, Link as LinkIcon } from 'lucide-react'

interface Course { id: string; title: string; slug: string; isActive: boolean; productTitle: string }
interface Module { id: string; courseId: string; title: string; description: string | null; orderIndex: number; isActive: boolean }
interface Week { id: string; moduleId: string; title: string; orderIndex: number }
interface Resource { id: string; weekId: string; title: string; type: string; url: string | null; duration: number | null; orderIndex: number }

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [weeks, setWeeks] = useState<Week[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const fetchAll = useCallback(async () => {
    const [cRes, mRes, wRes, rRes] = await Promise.all([
      fetch('/api/admin/analytics').then(() => null), // Courses don't have their own list API yet
      fetch('/api/admin/course-modules').then((r) => r.json()),
      fetch('/api/admin/course-weeks').then((r) => r.json()),
      fetch('/api/admin/course-resources').then((r) => r.json()),
    ])
    setModules(mRes?.modules || [])
    setWeeks(wRes?.weeks || [])
    setResources(rRes?.resources || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  // Group modules by courseId
  const courseIds = [...new Set(modules.map((m) => m.courseId))]

  const toggle = (id: string) => setExpanded({ ...expanded, [id]: !expanded[id] })

  const addModule = async (courseId: string) => {
    const title = prompt('Modul-Titel:')
    if (!title) return
    await fetch('/api/admin/course-modules', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, title, orderIndex: modules.filter((m) => m.courseId === courseId).length }),
    })
    fetchAll()
  }

  const deleteModule = async (id: string) => {
    if (!confirm('Modul und alle Inhalte löschen?')) return
    await fetch(`/api/admin/course-modules/${id}`, { method: 'DELETE' })
    fetchAll()
  }

  const addWeek = async (moduleId: string) => {
    const title = prompt('Wochen-Titel:')
    if (!title) return
    await fetch('/api/admin/course-weeks', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moduleId, title, orderIndex: weeks.filter((w) => w.moduleId === moduleId).length }),
    })
    fetchAll()
  }

  const deleteWeek = async (id: string) => {
    if (!confirm('Woche und alle Ressourcen löschen?')) return
    await fetch(`/api/admin/course-weeks/${id}`, { method: 'DELETE' })
    fetchAll()
  }

  const addResource = async (weekId: string) => {
    const title = prompt('Ressourcen-Titel:')
    if (!title) return
    const type = prompt('Typ (video/pdf/link/quiz):', 'video')
    if (!type) return
    const url = prompt('URL (optional):')
    await fetch('/api/admin/course-resources', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weekId, title, type, url: url || undefined, orderIndex: resources.filter((r) => r.weekId === weekId).length }),
    })
    fetchAll()
  }

  const deleteResource = async (id: string) => {
    if (!confirm('Ressource löschen?')) return
    await fetch(`/api/admin/course-resources/${id}`, { method: 'DELETE' })
    fetchAll()
  }

  const resourceIcon = (type: string) => {
    if (type === 'video') return <Video className="h-3 w-3 text-blue-500" />
    if (type === 'pdf') return <FileText className="h-3 w-3 text-red-500" />
    return <LinkIcon className="h-3 w-3 text-gray-500" />
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Kursverwaltung</h1>

      {courseIds.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">Keine Kursmodule vorhanden.</CardContent></Card>
      ) : (
        courseIds.map((courseId) => {
          const courseModulesList = modules.filter((m) => m.courseId === courseId).sort((a, b) => a.orderIndex - b.orderIndex)

          return (
            <Card key={courseId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> Kurs: {courseId.slice(0, 8)}...</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => addModule(courseId)}><Plus className="h-3 w-3 mr-1" /> Modul</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {courseModulesList.map((mod) => {
                  const modWeeks = weeks.filter((w) => w.moduleId === mod.id).sort((a, b) => a.orderIndex - b.orderIndex)
                  const isOpen = expanded[mod.id]

                  return (
                    <div key={mod.id} className="border rounded-lg">
                      <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50" onClick={() => toggle(mod.id)}>
                        <div className="flex items-center gap-2">
                          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          <span className="font-medium">{mod.title}</span>
                          <Badge variant="outline" className="text-xs">{modWeeks.length} Wochen</Badge>
                        </div>
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" onClick={() => addWeek(mod.id)}><Plus className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteModule(mod.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                        </div>
                      </div>

                      {isOpen && (
                        <div className="px-3 pb-3 space-y-2">
                          {modWeeks.map((week) => {
                            const weekResources = resources.filter((r) => r.weekId === week.id).sort((a, b) => a.orderIndex - b.orderIndex)
                            return (
                              <div key={week.id} className="pl-6 border-l-2 border-muted">
                                <div className="flex items-center justify-between py-1">
                                  <span className="text-sm font-medium">{week.title}</span>
                                  <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="sm" onClick={() => addResource(week.id)}><Plus className="h-3 w-3" /></Button>
                                    <Button variant="ghost" size="sm" onClick={() => deleteWeek(week.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                                  </div>
                                </div>
                                {weekResources.map((res) => (
                                  <div key={res.id} className="flex items-center justify-between pl-4 py-1 text-sm">
                                    <div className="flex items-center gap-2">
                                      {resourceIcon(res.type)}
                                      <span>{res.title}</span>
                                      {res.url && <span className="text-xs text-muted-foreground truncate max-w-48">({res.url})</span>}
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => deleteResource(res.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                                  </div>
                                ))}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )
        })
      )}
    </div>
  )
}
