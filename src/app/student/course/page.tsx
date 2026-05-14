'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BookOpen, 
  Clock,
  Loader2,
  GraduationCap,
  Calendar,
  ChevronRight
} from 'lucide-react'
import { useRouter } from 'next/navigation'

type PlanType = 'fast' | 'business' | 'infinity'

interface EnrollmentWithCourse {
  enrollment: {
    id: string
    userId: string
    courseId: string
    planType: PlanType
    planDisplayName: string
    progress: number
    completedModules: number
    completedSessions?: number
    totalSessions?: number
  }
  course: {
    courseId: string
    title: string
    description: string
    thumbnail: string
    category: string
    level: string
    duration: string
    totalModules: number
    totalVideos: number
  }
}

export default function StudentCoursesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [enrollments, setEnrollments] = useState<EnrollmentWithCourse[]>([])

  useEffect(() => {
    loadEnrollments()
  }, [])

  const loadEnrollments = async () => {
    setLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock data
    const mockData: EnrollmentWithCourse[] = [
      {
        enrollment: {
          id: 'enrollment-1',
          userId: 'user-123',
          courseId: 'ai-automation',
          planType: 'business',
          planDisplayName: 'Business Plan',
          progress: 65,
          completedModules: 5,
          completedSessions: 2,
          totalSessions: 6
        },
        course: {
          courseId: 'ai-automation',
          title: 'AI Automatisierung für E-Commerce',
          description: 'Meistern Sie den Einsatz von künstlicher Intelligenz in Ihrem E-Commerce Business. Automatisieren Sie Ihre Prozesse und steigern Sie Ihre Umsätze.',
          thumbnail: '🤖',
          category: 'AI & Automatisierung',
          level: 'Fortgeschritten',
          duration: '3 Monate',
          totalModules: 8,
          totalVideos: 24
        }
      },
      {
        enrollment: {
          id: 'enrollment-2',
          userId: 'user-123',
          courseId: 'dropshipping-eu',
          planType: 'fast',
          planDisplayName: 'Fast Plan',
          progress: 30,
          completedModules: 2
        },
        course: {
          courseId: 'dropshipping-eu',
          title: 'EU-konformes Dropshipping',
          description: 'Starten Sie Ihr rechtssicheres Dropshipping Business in der EU. Lernen Sie alle wichtigen Aspekte von Produktfindung bis Marketing.',
          thumbnail: '📦',
          category: 'Dropshipping',
          level: 'Anfänger',
          duration: '2 Monate',
          totalModules: 6,
          totalVideos: 18
        }
      },
      {
        enrollment: {
          id: 'enrollment-3',
          userId: 'user-123',
          courseId: 'social-media-marketing',
          planType: 'infinity',
          planDisplayName: 'Infinity Plan',
          progress: 15,
          completedModules: 1,
          completedSessions: 0,
          totalSessions: 999
        },
        course: {
          courseId: 'social-media-marketing',
          title: 'Social Media Marketing Masterclass',
          description: 'Werden Sie zum Social Media Experten. Meistern Sie Instagram, TikTok, Facebook Ads und organisches Wachstum.',
          thumbnail: '📱',
          category: 'Marketing',
          level: 'Fortgeschritten',
          duration: '4 Monate',
          totalModules: 10,
          totalVideos: 32
        }
      }
    ]
    
    setEnrollments(mockData)
    setLoading(false)
  }

  const getPlanBadge = (planType: PlanType) => {
    const badges: any = {
      fast: { label: 'Fast Plan', color: 'bg-gray-600 text-white' },
      business: { label: 'Business Plan', color: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white' },
      infinity: { label: 'Infinity Plan', color: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' }
    }
    return badges[planType] || badges.fast
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Lade deine Kurse...</p>
        </div>
      </div>
    )
  }

  if (enrollments.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Noch keine Kurse</h2>
          <p className="text-gray-600 mb-6">
            Du bist noch in keinem Kurs eingeschrieben. Entdecke unsere Kurse und starte deine Lernreise!
          </p>
          <Button onClick={() => router.push('/kurse')} size="lg">
            Kurse entdecken
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Meine Kurse</h1>
        <p className="text-gray-600">
          Du bist in {enrollments.length} {enrollments.length === 1 ? 'Kurs' : 'Kursen'} eingeschrieben
        </p>
      </div>

      {/* Course Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {enrollments.map(({ enrollment, course }) => {
          const planBadge = getPlanBadge(enrollment.planType)
          
          return (
            <Card 
              key={enrollment.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/student/course/${course.courseId}?enrollmentId=${enrollment.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="text-5xl">{course.thumbnail}</div>
                  <Badge className={`${planBadge.color} border-0`}>
                    {planBadge.label}
                  </Badge>
                </div>
                <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Fortschritt</span>
                    <span className="font-semibold text-blue-600">
                      {enrollment.progress}%
                    </span>
                  </div>
                  <Progress value={enrollment.progress} className="h-2" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <BookOpen className="h-4 w-4" />
                    <span>
                      {enrollment.completedModules}/{course.totalModules} Module
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  {(enrollment.planType === 'business' || enrollment.planType === 'infinity') && (
                    <>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {enrollment.completedSessions || 0}/
                          {enrollment.planType === 'infinity' ? '∞' : enrollment.totalSessions || 0} Sessions
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* CTA */}
                <Button 
                  className="w-full" 
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/student/course/${course.courseId}?enrollmentId=${enrollment.id}`)
                  }}
                >
                  Kurs öffnen
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
