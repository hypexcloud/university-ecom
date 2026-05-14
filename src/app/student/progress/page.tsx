'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  Award,
  CheckCircle,
  Clock,
  Video,
  FileText,
  Download,
  Calendar,
  Target,
  Zap,
  ArrowLeft,
  Loader2,
  Trophy
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

interface ProgressData {
  overallProgress: number
  modulesCompleted: number
  totalModules: number
  quizzesCompleted: number
  totalQuizzes: number
  averageQuizScore: number
  totalTimeSpent: number // minutes
  currentStreak: number
  weeklyProgress: WeekProgress[]
  quizHistory: QuizAttempt[]
  certificates: Certificate[]
}

interface WeekProgress {
  week: number
  progress: number
  modulesCompleted: number
}

interface QuizAttempt {
  id: string
  quizTitle: string
  moduleName: string
  score: number
  maxScore: number
  completedAt: Date
  passed: boolean
}

interface Certificate {
  id: string
  courseName: string
  completedAt: Date
  certificateUrl?: string
  canGenerate: boolean
}

export default function StudentProgressPage() {
  const router = useRouter()
  const [progressData, setProgressData] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [generatingCert, setGeneratingCert] = useState(false)

  useEffect(() => {
    loadProgressData()
  }, [])

  const loadProgressData = async () => {
    setLoading(true)
    try {
      // Mock data - in production, fetch from Firebase
      const mockData: ProgressData = {
        overallProgress: 45,
        modulesCompleted: 8,
        totalModules: 24,
        quizzesCompleted: 6,
        totalQuizzes: 12,
        averageQuizScore: 87,
        totalTimeSpent: 420, // 7 hours
        currentStreak: 5,
        weeklyProgress: [
          { week: 1, progress: 100, modulesCompleted: 4 },
          { week: 2, progress: 75, modulesCompleted: 3 },
          { week: 3, progress: 25, modulesCompleted: 1 },
          { week: 4, progress: 0, modulesCompleted: 0 },
        ],
        quizHistory: [
          {
            id: 'q1',
            quizTitle: 'AI Grundlagen Quiz',
            moduleName: 'Einführung in AI',
            score: 9,
            maxScore: 10,
            completedAt: new Date('2024-12-20'),
            passed: true
          },
          {
            id: 'q2',
            quizTitle: 'ChatGPT Praxis',
            moduleName: 'ChatGPT für Business',
            score: 8,
            maxScore: 10,
            completedAt: new Date('2024-12-22'),
            passed: true
          },
          {
            id: 'q3',
            quizTitle: 'Make.com Basics',
            moduleName: 'Automatisierung',
            score: 10,
            maxScore: 10,
            completedAt: new Date('2024-12-25'),
            passed: true
          },
        ],
        certificates: [
          {
            id: 'cert1',
            courseName: 'AI Automatisierung - Woche 1 & 2',
            completedAt: new Date('2024-12-26'),
            canGenerate: true
          }
        ]
      }

      setProgressData(mockData)
    } catch (error) {
      console.error('Error loading progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateCertificate = async (certId: string) => {
    setGeneratingCert(true)
    try {
      // Call API to generate certificate
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate
      
      // Reload data
      await loadProgressData()
    } catch (error) {
      console.error('Error generating certificate:', error)
    } finally {
      setGeneratingCert(false)
    }
  }

  if (loading || !progressData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const hoursSpent = Math.floor(progressData.totalTimeSpent / 60)
  const minutesSpent = progressData.totalTimeSpent % 60

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push('/student')} className="mb-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück zum Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Ihr Fortschritt</h1>
        <p className="text-gray-600 mt-1">
          Detaillierte Übersicht Ihrer Lernfortschritte
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mb-2">
                <div className="text-4xl font-bold text-blue-600">{progressData.overallProgress}%</div>
                <p className="text-sm text-gray-600 mt-1">Gesamtfortschritt</p>
              </div>
              <Progress value={progressData.overallProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Module</p>
                <p className="text-2xl font-bold">
                  {progressData.modulesCompleted}/{progressData.totalModules}
                </p>
                <p className="text-xs text-gray-500">abgeschlossen</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Quiz Ø</p>
                <p className="text-2xl font-bold text-purple-600">
                  {progressData.averageQuizScore}%
                </p>
                <p className="text-xs text-gray-500">
                  {progressData.quizzesCompleted} von {progressData.totalQuizzes}
                </p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Lernzeit</p>
                <p className="text-2xl font-bold">
                  {hoursSpent}h {minutesSpent}m
                </p>
                <p className="text-xs text-gray-500">gesamt</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Wöchentlicher Fortschritt
              </CardTitle>
              <CardDescription>
                Ihr Lernfortschritt pro Woche
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progressData.weeklyProgress.map((week) => (
                  <div key={week.week}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Woche {week.week}</span>
                        {week.progress === 100 && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">
                          {week.modulesCompleted} Module
                        </span>
                        <span className="font-semibold text-blue-600">
                          {week.progress}%
                        </span>
                      </div>
                    </div>
                    <Progress value={week.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quiz History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Quiz Ergebnisse
              </CardTitle>
              <CardDescription>
                Ihre letzten Quiz-Versuche
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {progressData.quizHistory.map((quiz) => {
                  const percentage = (quiz.score / quiz.maxScore) * 100
                  
                  return (
                    <div
                      key={quiz.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-semibold">{quiz.quizTitle}</p>
                        <p className="text-sm text-gray-600">{quiz.moduleName}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(quiz.completedAt, 'd. MMM yyyy', { locale: de })}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={quiz.passed ? "default" : "destructive"}
                            className={quiz.passed ? "bg-green-600" : ""}
                          >
                            {quiz.score}/{quiz.maxScore}
                          </Badge>
                        </div>
                        <p className="text-sm font-semibold text-blue-600 mt-1">
                          {percentage}%
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                Erfolge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-4 text-center">
                  <Zap className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <p className="font-bold text-2xl">{progressData.currentStreak}</p>
                  <p className="text-xs text-gray-600">Tage Streak</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="font-bold text-2xl">{progressData.modulesCompleted}</p>
                  <p className="text-xs text-gray-600">Module</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <Award className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <p className="font-bold text-2xl">{progressData.averageQuizScore}%</p>
                  <p className="text-xs text-gray-600">Quiz Ø</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="font-bold text-2xl">{hoursSpent}h</p>
                  <p className="text-xs text-gray-600">Lernzeit</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Certificates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Zertifikate
              </CardTitle>
              <CardDescription>
                Ihre erworbenen Zertifikate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {progressData.certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-purple-50"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="bg-white rounded-full p-2">
                      <Award className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{cert.courseName}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Abgeschlossen: {format(cert.completedAt, 'd. MMM yyyy', { locale: de })}
                      </p>
                    </div>
                  </div>
                  
                  {cert.certificateUrl ? (
                    <Button asChild className="w-full" size="sm">
                      <a href={cert.certificateUrl} download>
                        <Download className="h-4 w-4 mr-2" />
                        Herunterladen
                      </a>
                    </Button>
                  ) : cert.canGenerate ? (
                    <Button
                      onClick={() => generateCertificate(cert.id)}
                      disabled={generatingCert}
                      className="w-full"
                      size="sm"
                    >
                      {generatingCert ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Wird erstellt...
                        </>
                      ) : (
                        <>
                          <Award className="h-4 w-4 mr-2" />
                          Zertifikat erstellen
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button disabled className="w-full" size="sm" variant="outline">
                      Noch nicht verfügbar
                    </Button>
                  )}
                </div>
              ))}

              {progressData.certificates.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Noch keine Zertifikate</p>
                  <p className="text-xs mt-1">
                    Schließen Sie Module ab, um Zertifikate zu erhalten
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nächste Schritte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full" variant="outline">
                <Link href="/student/course">
                  <Video className="h-4 w-4 mr-2" />
                  Weiter lernen
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link href="/student/termine">
                  <Calendar className="h-4 w-4 mr-2" />
                  Session buchen
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link href="/student/resources">
                  <FileText className="h-4 w-4 mr-2" />
                  Materialien
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Motivation */}
          <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <Trophy className="h-12 w-12 mx-auto mb-3" />
                <p className="font-bold text-lg mb-2">Großartige Arbeit!</p>
                <p className="text-sm text-blue-100">
                  Sie haben bereits {progressData.overallProgress}% des Kurses abgeschlossen. 
                  Weiter so! 🚀
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
