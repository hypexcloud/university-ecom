'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/lib/auth/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Eye, 
  User, 
  Mail, 
  Building, 
  Clock, 
  Euro, 
  BookOpen, 
  Heart, 
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Users,
  TrendingUp
} from 'lucide-react'
import { IntakeService } from '@/lib/firebase/firestore'
import { useAuth } from '@/lib/auth/auth-context'

interface IntakeResponse {
  id: string
  email: string
  responses: {
    firstName: string
    lastName: string
    company?: string
    industry?: string
    currentExperience: string
    primaryGoal: string
    timeCommitment: string
    budget: string
    interestedCourse: string[]
    preferredPlan: string
    motivation: string
    expectedOutcome: string
    challenges: string[]
    timeZone: string
    country: string
    preferredLanguage: string
    howDidYouHear: string
    marketingConsent: boolean
    dataProcessingConsent: boolean
    termsAccepted: boolean
  }
  status: 'pending' | 'approved' | 'rejected'
  reviewNotes?: string
  reviewedBy?: string
  createdAt: any
  updatedAt: any
}

function IntakeManagementContent() {
  const [intakeResponses, setIntakeResponses] = useState<IntakeResponse[]>([])
  const [selectedResponse, setSelectedResponse] = useState<IntakeResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [reviewNotes, setReviewNotes] = useState('')
  const [newStatus, setNewStatus] = useState<'approved' | 'rejected'>('approved')
  const { appUser } = useAuth()

  useEffect(() => {
    loadIntakeResponses()
  }, [])

  const loadIntakeResponses = async () => {
    try {
      setLoading(true)
      const responses = await IntakeService.getPendingIntakes()
      // Type assertion to ensure proper typing
      setIntakeResponses(responses as IntakeResponse[])
    } catch (error) {
      console.error('Error loading intake responses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!selectedResponse || !appUser) return

    try {
      setUpdating(true)
      await IntakeService.updateIntakeStatus(
        selectedResponse.id,
        newStatus,
        reviewNotes,
        appUser.uid
      )

      // Update local state
      setIntakeResponses(prev => 
        prev.filter(response => response.id !== selectedResponse.id)
      )
      setSelectedResponse(null)
      setReviewNotes('')
      
      // Reload to get updated data
      await loadIntakeResponses()
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setUpdating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Ausstehend</Badge>
      case 'approved':
        return <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />Genehmigt</Badge>
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Abgelehnt</Badge>
      default:
        return <Badge variant="secondary">Unbekannt</Badge>
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unbekannt'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCourseNames = (courses: string[]) => {
    if (!courses || !Array.isArray(courses)) return 'Keine Kurse ausgewählt'
    return courses.map(course => {
      switch (course) {
        case 'ai': return 'AI Kurs'
        case 'dropshipping': return 'Dropshipping Kurs'
        default: return course
      }
    }).join(', ')
  }

  const getBudgetLabel = (budget: string) => {
    switch (budget) {
      case 'under-1k': return 'Unter €1.000'
      case '1k-5k': return '€1.000 - €5.000'
      case '5k-10k': return '€5.000 - €10.000'
      case '10k-plus': return 'Über €10.000'
      default: return budget
    }
  }

  const getExperienceLabel = (experience: string) => {
    switch (experience) {
      case 'none': return 'Keine Erfahrung'
      case 'beginner': return 'Anfänger'
      case 'intermediate': return 'Fortgeschritten'
      case 'advanced': return 'Experte'
      default: return experience
    }
  }

  const getTimeCommitmentLabel = (commitment: string) => {
    switch (commitment) {
      case 'part-time': return 'Teilzeit (5-10h/Woche)'
      case 'full-time': return 'Vollzeit (20+h/Woche)'
      case 'weekends': return 'Wochenenden (5-8h/Woche)'
      default: return commitment
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Lade Intake-Antworten...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Intake Management</h1>
          <p className="text-muted-foreground">
            Prüfung und Verwaltung von Vorab-Fragebögen
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={loadIntakeResponses} variant="outline" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Aktualisieren
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ausstehende Antworten</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{intakeResponses.length}</div>
            <p className="text-xs text-muted-foreground">
              Benötigen Prüfung
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heute eingegangen</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {intakeResponses.filter(response => {
                const date = response.createdAt?.toDate ? response.createdAt.toDate() : new Date(response.createdAt)
                const today = new Date()
                return date.toDateString() === today.toDateString()
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Neue Interessenten
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beliebtester Kurs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AI Kurs</div>
            <p className="text-xs text-muted-foreground">
              Meist gewählt
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Intake List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Ausstehende Antworten</h2>
          
          {intakeResponses.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Keine ausstehenden Intake-Antworten</p>
                  <p className="text-sm">Neue Antworten werden hier angezeigt</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {intakeResponses.map((response) => (
                <Card 
                  key={response.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedResponse?.id === response.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedResponse(response)}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {response.responses?.firstName} {response.responses?.lastName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span>{response.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <BookOpen className="h-3 w-3 text-muted-foreground" />
                          <span>{getCourseNames(response.responses?.interestedCourse)}</span>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        {getStatusBadge(response.status)}
                        <div className="text-xs text-muted-foreground">
                          {formatDate(response.createdAt)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Intake Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Details & Prüfung</h2>
          
          {!selectedResponse ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Wählen Sie eine Antwort zur Prüfung aus</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Persönliche Informationen
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Name</Label>
                      <p className="text-sm">{selectedResponse.responses?.firstName} {selectedResponse.responses?.lastName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">E-Mail</Label>
                      <p className="text-sm">{selectedResponse.email}</p>
                    </div>
                  </div>
                  {selectedResponse.responses?.company && (
                    <div>
                      <Label className="text-sm font-medium">Unternehmen</Label>
                      <p className="text-sm">{selectedResponse.responses.company}</p>
                    </div>
                  )}
                  {selectedResponse.responses?.industry && (
                    <div>
                      <Label className="text-sm font-medium">Branche</Label>
                      <p className="text-sm">{selectedResponse.responses.industry}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Land</Label>
                      <p className="text-sm">{selectedResponse.responses?.country}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Zeitzone</Label>
                      <p className="text-sm">{selectedResponse.responses?.timeZone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Experience & Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Erfahrung & Ziele
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Erfahrungslevel</Label>
                      <p className="text-sm">{getExperienceLabel(selectedResponse.responses?.currentExperience)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Budget</Label>
                      <p className="text-sm">{getBudgetLabel(selectedResponse.responses?.budget)}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Zeitaufwand</Label>
                    <p className="text-sm">{getTimeCommitmentLabel(selectedResponse.responses?.timeCommitment)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Hauptziel</Label>
                    <p className="text-sm">{selectedResponse.responses?.primaryGoal}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Course Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Kurs-Auswahl
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Interessierte Kurse</Label>
                    <p className="text-sm">{getCourseNames(selectedResponse.responses?.interestedCourse)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Bevorzugter Plan</Label>
                    <p className="text-sm">
                      {selectedResponse.responses?.preferredPlan === 'pro' ? 'Pro Plan (€497)' : 'Max Plan (€997)'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Motivation */}
              {selectedResponse.responses?.motivation && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Motivation & Erwartungen
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Motivation</Label>
                      <p className="text-sm">{selectedResponse.responses.motivation}</p>
                    </div>
                    {selectedResponse.responses.expectedOutcome && (
                      <div>
                        <Label className="text-sm font-medium">Erwartete Ergebnisse</Label>
                        <p className="text-sm">{selectedResponse.responses.expectedOutcome}</p>
                      </div>
                    )}
                    {selectedResponse.responses.challenges && selectedResponse.responses.challenges.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">Herausforderungen</Label>
                        <ul className="text-sm space-y-1">
                          {selectedResponse.responses.challenges.map((challenge, index) => (
                            <li key={index}>• {challenge}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Review Section */}
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">Prüfung & Entscheidung</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={newStatus} onValueChange={(value: 'approved' | 'rejected') => setNewStatus(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Genehmigen
                          </div>
                        </SelectItem>
                        <SelectItem value="rejected">
                          <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-600" />
                            Ablehnen
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reviewNotes">Notizen</Label>
                    <Textarea
                      id="reviewNotes"
                      placeholder="Interne Notizen zur Entscheidung..."
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <Button 
                    onClick={handleStatusUpdate} 
                    className="w-full" 
                    disabled={updating}
                  >
                    {updating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Wird gespeichert...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Entscheidung speichern
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function IntakeManagementPage() {
  return (
    <ProtectedRoute requireRole="admin">
      <IntakeManagementContent />
    </ProtectedRoute>
  )
}
