'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  FileVideo,
  FileText,
  Link as LinkIcon,
  Download,
  Loader2,
  Check,
  X,
  Eye,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import type { CourseModule, CourseResource } from '@/lib/course-types'

export default function CourseContentManagement() {
  const [selectedCourse, setSelectedCourse] = useState<'ai' | 'dropshipping'>('ai')
  const [modules, setModules] = useState<CourseModule[]>([])
  const [loading, setLoading] = useState(true)
  
  // Module dialog state
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false)
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null)
  const [moduleForm, setModuleForm] = useState({
    week: 1,
    title: '',
    description: '',
    objectives: [''],
    duration: '',
    hasSession: false,
    sessionRequired: false,
    requiresPreviousModule: true,
    status: 'draft' as 'draft' | 'published',
  })

  // Resource dialog state
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false)
  const [selectedModuleForResource, setSelectedModuleForResource] = useState<string | null>(null)
  const [resources, setResources] = useState<CourseResource[]>([])
  const [resourceForm, setResourceForm] = useState({
    title: '',
    description: '',
    type: 'video' as 'video' | 'pdf' | 'link' | 'template' | 'document',
    url: '',
    videoProvider: 'youtube' as 'youtube' | 'vimeo' | 'custom',
    duration: '',
    isRequired: true,
    estimatedTime: '',
  })

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadModules()
  }, [selectedCourse])

  const loadModules = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/course-modules?courseType=${selectedCourse}`)
      if (response.ok) {
        const data = await response.json()
        setModules(data.modules || [])
      }
    } catch (error) {
      console.error('Error loading modules:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadResources = async (moduleId: string) => {
    try {
      const response = await fetch(`/api/admin/course-resources?moduleId=${moduleId}`)
      if (response.ok) {
        const data = await response.json()
        setResources(data.resources || [])
      }
    } catch (error) {
      console.error('Error loading resources:', error)
    }
  }

  const handleCreateModule = () => {
    setEditingModule(null)
    setModuleForm({
      week: modules.length + 1,
      title: '',
      description: '',
      objectives: [''],
      duration: '',
      hasSession: false,
      sessionRequired: false,
      requiresPreviousModule: true,
      status: 'draft',
    })
    setIsModuleDialogOpen(true)
  }

  const handleEditModule = (module: CourseModule) => {
    setEditingModule(module)
    setModuleForm({
      week: module.week,
      title: module.title,
      description: module.description,
      objectives: module.objectives,
      duration: module.duration,
      hasSession: module.hasSession,
      sessionRequired: module.sessionRequired,
      requiresPreviousModule: module.requiresPreviousModule,
      status: module.status,
    })
    setIsModuleDialogOpen(true)
  }

  const handleSaveModule = async () => {
    setSaving(true)
    try {
      const url = editingModule
        ? `/api/admin/course-modules/${editingModule.id}`
        : '/api/admin/course-modules'

      const response = await fetch(url, {
        method: editingModule ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...moduleForm,
          courseType: selectedCourse,
          order: moduleForm.week,
        }),
      })

      if (response.ok) {
        await loadModules()
        setIsModuleDialogOpen(false)
      }
    } catch (error) {
      console.error('Error saving module:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module? All resources will be deleted.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/course-modules/${moduleId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await loadModules()
      }
    } catch (error) {
      console.error('Error deleting module:', error)
    }
  }

  const handleAddResource = (moduleId: string) => {
    setSelectedModuleForResource(moduleId)
    setResourceForm({
      title: '',
      description: '',
      type: 'video',
      url: '',
      videoProvider: 'youtube',
      duration: '',
      isRequired: true,
      estimatedTime: '',
    })
    loadResources(moduleId)
    setIsResourceDialogOpen(true)
  }

  const handleSaveResource = async () => {
    if (!selectedModuleForResource) return

    setSaving(true)
    try {
      const response = await fetch('/api/admin/course-resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...resourceForm,
          moduleId: selectedModuleForResource,
          order: resources.length + 1,
        }),
      })

      if (response.ok) {
        await loadResources(selectedModuleForResource)
        setResourceForm({
          title: '',
          description: '',
          type: 'video',
          url: '',
          videoProvider: 'youtube',
          duration: '',
          isRequired: true,
          estimatedTime: '',
        })
      }
    } catch (error) {
      console.error('Error saving resource:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteResource = async (resourceId: string) => {
    if (!selectedModuleForResource) return

    try {
      const response = await fetch(`/api/admin/course-resources/${resourceId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await loadResources(selectedModuleForResource)
      }
    } catch (error) {
      console.error('Error deleting resource:', error)
    }
  }

  const handlePublishModule = async (moduleId: string) => {
    try {
      const response = await fetch(`/api/admin/course-modules/${moduleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' }),
      })

      if (response.ok) {
        await loadModules()
      }
    } catch (error) {
      console.error('Error publishing module:', error)
    }
  }

  const addObjective = () => {
    setModuleForm({
      ...moduleForm,
      objectives: [...moduleForm.objectives, ''],
    })
  }

  const removeObjective = (index: number) => {
    setModuleForm({
      ...moduleForm,
      objectives: moduleForm.objectives.filter((_, i) => i !== index),
    })
  }

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...moduleForm.objectives]
    newObjectives[index] = value
    setModuleForm({ ...moduleForm, objectives: newObjectives })
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <FileVideo className="h-4 w-4" />
      case 'pdf':
      case 'document':
        return <FileText className="h-4 w-4" />
      case 'link':
        return <LinkIcon className="h-4 w-4" />
      case 'template':
        return <Download className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kursverwaltung</h1>
          <p className="text-gray-600 mt-1">Verwalten Sie Module, Lektionen und Ressourcen</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedCourse} onValueChange={(value: any) => setSelectedCourse(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ai">KI Automation Kurs</SelectItem>
              <SelectItem value="dropshipping">EU Dropshipping Kurs</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleCreateModule}>
            <Plus className="h-4 w-4 mr-2" />
            Neues Modul
          </Button>
        </div>
      </div>

      {/* Modules List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="space-y-4">
          {modules.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Noch keine Module für diesen Kurs</p>
                <Button onClick={handleCreateModule}>
                  <Plus className="h-4 w-4 mr-2" />
                  Erstes Modul erstellen
                </Button>
              </CardContent>
            </Card>
          ) : (
            modules.map((module) => (
              <Card key={module.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle>
                          Woche {module.week}: {module.title}
                        </CardTitle>
                        <Badge variant={module.status === 'published' ? 'default' : 'secondary'}>
                          {module.status === 'published' ? 'Veröffentlicht' : 'Entwurf'}
                        </Badge>
                        {module.hasSession && (
                          <Badge variant="outline" className="bg-blue-50">
                            Mit Session
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{module.description}</CardDescription>
                      <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                        <span>📚 {module.objectives.length} Lernziele</span>
                        <span>⏱️ {module.duration}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {module.status === 'draft' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePublishModule(module.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Veröffentlichen
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddResource(module.id)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Ressource
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditModule(module)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteModule(module.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Module Dialog */}
      <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingModule ? 'Modul bearbeiten' : 'Neues Modul erstellen'}
            </DialogTitle>
            <DialogDescription>
              Erstellen Sie ein neues Kursmodul mit Lernzielen und Ressourcen
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Woche</Label>
                <Input
                  type="number"
                  min="1"
                  value={moduleForm.week}
                  onChange={(e) =>
                    setModuleForm({ ...moduleForm, week: parseInt(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label>Dauer</Label>
                <Input
                  placeholder="z.B. 2 Stunden"
                  value={moduleForm.duration}
                  onChange={(e) => setModuleForm({ ...moduleForm, duration: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Titel</Label>
              <Input
                placeholder="z.B. Einführung in KI Grundlagen"
                value={moduleForm.title}
                onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
              />
            </div>

            <div>
              <Label>Beschreibung</Label>
              <Textarea
                placeholder="Beschreiben Sie die Inhalte dieses Moduls..."
                value={moduleForm.description}
                onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Lernziele</Label>
                <Button type="button" size="sm" variant="outline" onClick={addObjective}>
                  <Plus className="h-4 w-4 mr-1" />
                  Hinzufügen
                </Button>
              </div>
              <div className="space-y-2">
                {moduleForm.objectives.map((objective, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="z.B. Verstehen der Grundlagen von Machine Learning"
                      value={objective}
                      onChange={(e) => updateObjective(index, e.target.value)}
                    />
                    {moduleForm.objectives.length > 1 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => removeObjective(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hasSession"
                  checked={moduleForm.hasSession}
                  onChange={(e) =>
                    setModuleForm({ ...moduleForm, hasSession: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor="hasSession" className="font-normal">
                  Hat Mentoring-Session
                </Label>
              </div>
              {moduleForm.hasSession && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="sessionRequired"
                    checked={moduleForm.sessionRequired}
                    onChange={(e) =>
                      setModuleForm({ ...moduleForm, sessionRequired: e.target.checked })
                    }
                    className="rounded"
                  />
                  <Label htmlFor="sessionRequired" className="font-normal">
                    Session erforderlich
                  </Label>
                </div>
              )}
            </div>

            <div>
              <Label>Status</Label>
              <Select
                value={moduleForm.status}
                onValueChange={(value: any) => setModuleForm({ ...moduleForm, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Entwurf</SelectItem>
                  <SelectItem value="published">Veröffentlicht</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModuleDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSaveModule} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Speichern...
                </>
              ) : (
                'Speichern'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resource Dialog */}
      <Dialog open={isResourceDialogOpen} onOpenChange={setIsResourceDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ressourcen verwalten</DialogTitle>
            <DialogDescription>
              Fügen Sie Videos, PDFs und andere Lernmaterialien hinzu
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="add">
            <TabsList>
              <TabsTrigger value="add">Neue Ressource</TabsTrigger>
              <TabsTrigger value="list">Alle Ressourcen ({resources.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="add" className="space-y-4">
              <div>
                <Label>Typ</Label>
                <Select
                  value={resourceForm.type}
                  onValueChange={(value: any) => setResourceForm({ ...resourceForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="pdf">PDF Dokument</SelectItem>
                    <SelectItem value="document">Dokument</SelectItem>
                    <SelectItem value="link">Externer Link</SelectItem>
                    <SelectItem value="template">Vorlage/Template</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Titel</Label>
                <Input
                  placeholder="z.B. Einführungsvideo KI Grundlagen"
                  value={resourceForm.title}
                  onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                />
              </div>

              <div>
                <Label>Beschreibung (optional)</Label>
                <Textarea
                  placeholder="Kurze Beschreibung der Ressource..."
                  value={resourceForm.description}
                  onChange={(e) =>
                    setResourceForm({ ...resourceForm, description: e.target.value })
                  }
                  rows={2}
                />
              </div>

              {resourceForm.type === 'video' && (
                <>
                  <div>
                    <Label>Video Provider</Label>
                    <Select
                      value={resourceForm.videoProvider}
                      onValueChange={(value: any) =>
                        setResourceForm({ ...resourceForm, videoProvider: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="vimeo">Vimeo</SelectItem>
                        <SelectItem value="custom">Custom URL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Video URL</Label>
                    <Input
                      placeholder={
                        resourceForm.videoProvider === 'youtube'
                          ? 'https://www.youtube.com/watch?v=...'
                          : resourceForm.videoProvider === 'vimeo'
                          ? 'https://vimeo.com/...'
                          : 'Video URL'
                      }
                      value={resourceForm.url}
                      onChange={(e) => setResourceForm({ ...resourceForm, url: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Dauer (optional)</Label>
                    <Input
                      placeholder="z.B. 15:30"
                      value={resourceForm.duration}
                      onChange={(e) =>
                        setResourceForm({ ...resourceForm, duration: e.target.value })
                      }
                    />
                  </div>
                </>
              )}

              {(resourceForm.type === 'pdf' ||
                resourceForm.type === 'document' ||
                resourceForm.type === 'template') && (
                <div>
                  <Label>Datei URL</Label>
                  <Input
                    placeholder="Firebase Storage URL oder externer Link"
                    value={resourceForm.url}
                    onChange={(e) => setResourceForm({ ...resourceForm, url: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Laden Sie die Datei zu Firebase Storage hoch und fügen Sie die URL hier ein
                  </p>
                </div>
              )}

              {resourceForm.type === 'link' && (
                <div>
                  <Label>URL</Label>
                  <Input
                    placeholder="https://..."
                    value={resourceForm.url}
                    onChange={(e) => setResourceForm({ ...resourceForm, url: e.target.value })}
                  />
                </div>
              )}

              <div>
                <Label>Geschätzte Bearbeitungszeit</Label>
                <Input
                  placeholder="z.B. 30 Minuten"
                  value={resourceForm.estimatedTime}
                  onChange={(e) =>
                    setResourceForm({ ...resourceForm, estimatedTime: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isRequired"
                  checked={resourceForm.isRequired}
                  onChange={(e) =>
                    setResourceForm({ ...resourceForm, isRequired: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor="isRequired" className="font-normal">
                  Pflichtressource (muss abgeschlossen werden)
                </Label>
              </div>

              <Button onClick={handleSaveResource} disabled={saving} className="w-full">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Speichern...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Ressource hinzufügen
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="list">
              {resources.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Noch keine Ressourcen für dieses Modul
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titel</TableHead>
                      <TableHead>Typ</TableHead>
                      <TableHead>Pflicht</TableHead>
                      <TableHead>Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resources.map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getResourceIcon(resource.type)}
                            <div>
                              <p className="font-medium">{resource.title}</p>
                              {resource.description && (
                                <p className="text-xs text-gray-500">{resource.description}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{resource.type.toUpperCase()}</Badge>
                        </TableCell>
                        <TableCell>
                          {resource.isRequired ? (
                            <Badge variant="secondary">Pflicht</Badge>
                          ) : (
                            <Badge variant="outline">Optional</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteResource(resource.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}
