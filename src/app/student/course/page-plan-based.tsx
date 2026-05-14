'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Video, 
  FileText, 
  CheckCircle, 
  Lock, 
  Clock,
  Download,
  PlayCircle,
  ChevronRight,
  Award,
  Loader2,
  ArrowLeft,
  Calendar,
  AlertCircle,
  CalendarCheck,
  Sparkles,
  Info
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

type PlanType = 'fast' | 'business' | 'infinity'

interface EnrollmentData {
  planType: PlanType
  courseId: string
  courseName: string
  startDate: Date
  completedSessions: number
  nextSessionDate?: Date
}

interface Module {
  id: string
  title: string
  description: string
  weekNumber: number
  duration: number
  isCompleted: boolean
  isLocked: boolean
  videoUrl?: string
  resources: Resource[]
  
  // Business Plan specific
  requiresSession?: boolean
  sessionCompleted?: boolean
  sessionDate?: Date
  unlockCondition?: string
}

interface Resource {
  id: string
  title: string
  type: 'pdf' | 'template' | 'checklist' | 'video'
  url: string
  size: string
}

export default function StudentCoursePlanBased() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [modules, setModules] = useState<Module[]>([])
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [activeView, setActiveView] = useState<'self-paced' | 'mentored'>('self-paced')

  // Mock enrollment - in production, fetch from Firebase
  const enrollment: EnrollmentData = {
    planType: 'infinity', // Change to test: 'fast', 'business', 'infinity'
    courseId: 'ai-automation',
    courseName: 'AI Automatisierung',
    startDate: new Date('2024-01-15'),
    completedSessions: 2,
    nextSessionDate: new Date('2026-01-10')
  }

  useEffect(() => {
    loadModules()
  }, [])

  const loadModules = async () => {
    setLoading(true)
    try {
      // Mock modules with different unlock conditions
      const mockModules: Module[] = [
        {
          id: 'module-1',
          title: 'AI Grundlagen',
          description: 'Einführung in künstliche Intelligenz und ihre Anwendungen',
          weekNumber: 1,
          duration: 45,
          isCompleted: true,
          isLocked: false,
          videoUrl: '#',
          resources: [
            { id: 'r1', title: 'AI Basics PDF', type: 'pdf', url: '#', size: '2.5 MB' },
            { id: 'r2', title: 'Tool Overview', type: 'template', url: '#', size: '500 KB' }
          ],
          requiresSession: false
        },
        {
          id: 'module-2',
          title: 'Prompt Engineering Fundamentals',
          description: 'Lernen Sie effektive Prompts zu schreiben',
          weekNumber: 1,
          duration: 60,
          isCompleted: true,
          isLocked: false,
          videoUrl: '#',
          resources: [
            { id: 'r3', title: 'Prompt Templates', type: 'template', url: '#', size: '1 MB' }
          ],
          requiresSession: false
        },
        {
          id: 'module-3',
          title: '1:1 Session - Strategie Workshop',
          description: 'Persönliche Strategieentwicklung mit Mentor',
          weekNumber: 2,
          duration: 60,
          isCompleted: true,
          isLocked: false,
          requiresSession: true,
          sessionCompleted: true,
          sessionDate: new Date('2024-01-22'),
          unlockCondition: 'Nach 1:1 Session'
        },
        {
          id: 'module-4',
          title: 'Advanced Prompting Techniques',
          description: 'Fortgeschrittene Techniken für bessere Ergebnisse',
          weekNumber: 2,
          duration: 75,
          isCompleted: false,
          isLocked: enrollment.planType === 'business', // Locked until session 1 complete
          videoUrl: '#',
          resources: [
            { id: 'r4', title: 'Advanced Templates', type: 'template', url: '#', size: '1.5 MB' }
          ],
          requiresSession: false,
          unlockCondition: enrollment.planType === 'business' ? 'Nach 1:1 Session freigeschalten' : undefined
        },
        {
          id: 'module-5',
          title: 'Automation Workflows',
          description: 'Bauen Sie automatisierte Prozesse mit AI',
          weekNumber: 3,
          duration: 90,
          isCompleted: false,
          isLocked: enrollment.planType === 'business', // Locked until session 2 complete
          videoUrl: '#',
          resources: [
            { id: 'r5', title: 'Workflow Templates', type: 'template', url: '#', size: '2 MB' }
          ],
          requiresSession: false,
          unlockCondition: enrollment.planType === 'business' ? 'Nach 2. Session freigeschalten' : undefined
        },
        {
          id: 'module-6',
          title: '1:1 Session - Implementation Review',
          description: 'Review Ihrer Implementierung mit Mentor',
          weekNumber: 4,
          duration: 60,
          isCompleted: false,
          isLocked: enrollment.planType === 'business' ? enrollment.completedSessions < 2 : false,
          requiresSession: true,
          sessionCompleted: false,
          sessionDate: enrollment.nextSessionDate,
          unlockCondition: 'Geplant für 10. Januar 2026'
        },
        {
          id: 'module-7',
          title: 'AI Content Marketing',
          description: 'Erstellen Sie Marketing Content mit AI',
          weekNumber: 4,
          duration: 60,
          isCompleted: false,
          isLocked: enrollment.planType === 'business' ? enrollment.completedSessions < 2 : false,
          videoUrl: '#',
          resources: [],
          unlockCondition: enrollment.planType === 'business' ? 'Nach 2. Session' : undefined
        },
        {
          id: 'module-8',
          title: 'Scaling Your AI Systems',
          description: 'Skalieren Sie Ihre AI Automatisierungen',
          weekNumber: 5,
          duration: 75,
          isCompleted: false,
          isLocked: enrollment.planType === 'business',
          videoUrl: '#',
          resources: [],
          unlockCondition: enrollment.planType === 'business' ? 'Nach allen Sessions' : undefined
        }
      ]

      setModules(mockModules)
      
      // Select first incomplete unlocked module
      const firstIncomplete = mockModules.find(m => !m.isCompleted && !m.isLocked)
      setSelectedModule(firstIncomplete || mockModules[0])
    } catch (error) {
      console.error('Error loading modules:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleModuleClick = (module: Module) => {
    if (!module.isLocked) {
      setSelectedModule(module)
    }
  }

  const markModuleComplete = async (moduleId: string) => {
    setModules(prev => prev.map(m => 
      m.id === moduleId ? { ...m, isCompleted: true } : m
    ))
  }

  // Get modules for Fast Plan (all unlocked)
  const getSelfPacedModules = () => {
    return modules.filter(m => !m.requiresSession)
  }

  // Get modules for Business Plan (session-based)
  const getMentoredModules = () => {
    return modules
  }

  const completedCount = modules.filter(m => m.isCompleted).length
  const totalCount = modules.length
  const progressPercent = (completedCount / totalCount) * 100

  const sessionModules = modules.filter(m => m.requiresSession)
  const contentModules = modules.filter(m => !m.requiresSession)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  // Get plan badge
  const getPlanBadge = () => {
    const badges = {
      fast: { label: 'Fast Plan', color: 'bg-gray-600' },
      business: { label: 'Business Plan', color: 'bg-gradient-to-r from-yellow-500 to-yellow-600' },
      infinity: { label: 'Infinity Plan', color: 'bg-gradient-to-r from-purple-600 to-blue-600' }
    }
    return badges[enrollment.planType]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push('/student')} className="mb-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück zum Dashboard
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{enrollment.courseName}</h1>
            <p className="text-gray-600 mt-1">
              Ihr persönlicher Lernweg
            </p>
          </div>
          <Badge className={`${getPlanBadge().color} text-white border-0 px-4 py-2`}>
            {getPlanBadge().label}
          </Badge>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{Math.round(progressPercent)}%</div>
              <p className="text-sm text-gray-600">Fortschritt</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{completedCount}/{totalCount}</div>
              <p className="text-sm text-gray-600">Module</p>
            </div>
          </CardContent>
        </Card>
        {enrollment.planType !== 'fast' && (
          <>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{enrollment.completedSessions}</div>
                  <p className="text-sm text-gray-600">Sessions absolviert</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-sm font-bold text-orange-600">
                    {enrollment.nextSessionDate 
                      ? format(enrollment.nextSessionDate, 'd. MMM', { locale: de })
                      : 'Keine geplant'
                    }
                  </div>
                  <p className="text-sm text-gray-600">Nächste Session</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <Progress value={progressPercent} className="h-3" />
        </CardContent>
      </Card>

      {/* Plan-Specific Views */}
      {enrollment.planType === 'fast' && (
        // FAST PLAN: Simple self-paced view
        <div>
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900">Self-Paced Learning</p>
                  <p className="text-sm text-blue-800 mt-1">
                    Alle Module sind sofort verfügbar. Lernen Sie in Ihrem eigenen Tempo!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {renderModuleGrid(getSelfPacedModules())}
        </div>
      )}

      {enrollment.planType === 'business' && (
        // BUSINESS PLAN: Session-based calendar view
        <div>
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900">Mentored Learning Path</p>
                  <p className="text-sm text-green-800 mt-1">
                    Module werden nach Ihren 1:1 Sessions freigeschaltet. Ihr persönlicher Mentor begleitet Sie Schritt für Schritt.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {renderSessionBasedView()}
        </div>
      )}

      {enrollment.planType === 'infinity' && (
        // INFINITY PLAN: Both views in tabs
        <div>
          <Card className="mb-6 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-purple-900">Infinity Dual Access</p>
                  <p className="text-sm text-purple-800 mt-1">
                    Sie haben Zugriff auf beide Lernmethoden: Self-Paced für flexible Zeiten und Mentored für strukturiertes Lernen mit persönlicher Betreuung.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="self-paced" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Self-Paced
              </TabsTrigger>
              <TabsTrigger value="mentored" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Mentored Path
              </TabsTrigger>
            </TabsList>

            <TabsContent value="self-paced">
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>Self-Paced Mode:</strong> Erkunden Sie alle Content-Module frei. Perfekt für flexible Lernzeiten!
                </p>
              </div>
              {renderModuleGrid(getSelfPacedModules())}
            </TabsContent>

            <TabsContent value="mentored">
              <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-900">
                  <strong>Mentored Path:</strong> Folgen Sie dem strukturierten Pfad mit 1:1 Sessions für optimale Ergebnisse.
                </p>
              </div>
              {renderSessionBasedView()}
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Module Detail Modal/View would go here */}
      {selectedModule && (
        <Card className="fixed bottom-4 right-4 w-96 shadow-2xl z-50">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="outline" className="mb-2">Woche {selectedModule.weekNumber}</Badge>
                <CardTitle className="text-lg">{selectedModule.title}</CardTitle>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedModule(null)}
              >
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">{selectedModule.description}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Clock className="h-4 w-4" />
              {selectedModule.duration} Minuten
            </div>
            <Button asChild className="w-full">
              <Link href={`/student/course/${selectedModule.id}`}>
                <PlayCircle className="h-4 w-4 mr-2" />
                Modul öffnen
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )

  // Helper function to render modules in grid
  function renderModuleGrid(modulesToShow: Module[]) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {modulesToShow.map((module) => (
          <Card
            key={module.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              module.isLocked ? 'opacity-60' : ''
            } ${module.isCompleted ? 'border-green-200 bg-green-50' : ''}`}
            onClick={() => handleModuleClick(module)}
          >
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  Woche {module.weekNumber}
                </Badge>
                <div>
                  {module.isCompleted && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  {module.isLocked && (
                    <Lock className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
              <CardTitle className="text-lg">{module.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {module.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  {module.duration} Min
                </div>
                {!module.isLocked && !module.isCompleted && (
                  <Button size="sm" variant="outline">
                    <PlayCircle className="h-3 w-3 mr-1" />
                    Start
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Helper function to render session-based timeline
  function renderSessionBasedView() {
    return (
      <div className="space-y-6">
        {/* Timeline View */}
        <div className="space-y-4">
          {getMentoredModules().map((module, index) => (
            <Card 
              key={module.id}
              className={`${
                module.isCompleted ? 'border-green-200 bg-green-50' : 
                module.isLocked ? 'border-gray-200 bg-gray-50' :
                'border-blue-200 bg-blue-50'
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      module.isCompleted ? 'bg-green-600' :
                      module.isLocked ? 'bg-gray-400' :
                      'bg-blue-600'
                    }`}>
                      {module.requiresSession ? (
                        <Video className="h-5 w-5 text-white" />
                      ) : module.isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-white" />
                      ) : module.isLocked ? (
                        <Lock className="h-5 w-5 text-white" />
                      ) : (
                        <PlayCircle className="h-5 w-5 text-white" />
                      )}
                    </div>
                    {index < getMentoredModules().length - 1 && (
                      <div className={`w-0.5 h-16 ${
                        module.isCompleted ? 'bg-green-300' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>

                  {/* Module content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            Woche {module.weekNumber}
                          </Badge>
                          {module.requiresSession && (
                            <Badge className="text-xs bg-purple-600">
                              1:1 Session
                            </Badge>
                          )}
                          {module.isCompleted && (
                            <Badge className="text-xs bg-green-600">
                              ✓ Abgeschlossen
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-lg">{module.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                      </div>
                    </div>

                    {/* Session info */}
                    {module.requiresSession && module.sessionDate && (
                      <div className="flex items-center gap-2 mt-3 p-3 bg-white rounded-lg border">
                        <CalendarCheck className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">
                          {module.sessionCompleted 
                            ? `Abgeschlossen am ${format(module.sessionDate, 'd. MMMM yyyy', { locale: de })}`
                            : `Geplant für ${format(module.sessionDate, 'd. MMMM yyyy', { locale: de })}`
                          }
                        </span>
                      </div>
                    )}

                    {/* Unlock condition */}
                    {module.isLocked && module.unlockCondition && (
                      <div className="flex items-center gap-2 mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-yellow-800">
                          {module.unlockCondition}
                        </span>
                      </div>
                    )}

                    {/* Action button */}
                    <div className="mt-4">
                      {module.isLocked ? (
                        <Button disabled variant="outline" size="sm">
                          <Lock className="h-4 w-4 mr-2" />
                          Gesperrt
                        </Button>
                      ) : module.isCompleted ? (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/student/course/${module.id}`}>
                            Wiederholen
                          </Link>
                        </Button>
                      ) : module.requiresSession ? (
                        <Button size="sm" asChild>
                          <Link href="/student/termine">
                            <Calendar className="h-4 w-4 mr-2" />
                            Session Details
                          </Link>
                        </Button>
                      ) : (
                        <Button size="sm" asChild>
                          <Link href={`/student/course/${module.id}`}>
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Jetzt starten
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }
}
