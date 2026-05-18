'use client'

import { useAuth } from '@/lib/auth/auth-provider'
import BookingCalendar from '@/components/BookingCalendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, Clock, Video } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function BookSessionPage() {
  const { user } = useAuth()
  const router = useRouter()

  // Mock data - in production, fetch from Firebase
  const enrollmentId = 'enrollment-123'
  const coachId = 'admin-1' // Amin's ID

  const handleBookingComplete = (sessionId: string) => {
    // Redirect to sessions page after 2 seconds
    setTimeout(() => {
      router.push('/student/termine')
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/student">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück zum Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Session buchen</h1>
        <p className="text-gray-600 mt-2">
          Buchen Sie eine 1:1 Session mit Ihrem Coach
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Booking Area */}
        <div className="lg:col-span-2">
          <BookingCalendar
            userId={user?.id || ''}
            coachId={coachId}
            enrollmentId={enrollmentId}
            onBookingComplete={handleBookingComplete}
          />
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Buchungsinformationen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">Session-Dauer</div>
                  <div className="text-sm text-gray-600">60 Minuten</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Video className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">Meeting-Optionen</div>
                  <div className="text-sm text-gray-600">Zoom, Telefon oder Präsenz</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">Verfügbarkeit</div>
                  <div className="text-sm text-gray-600">Mo-Fr, 9:00-18:00 Uhr</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg">Tipps für Ihre Session</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Bereiten Sie spezifische Fragen vor</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Testen Sie Ihre Technik vorher (bei Zoom)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Halten Sie Notizen bereit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Seien Sie pünktlich</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">
                <strong>Hinweis:</strong> Sie können Sessions bis zu 24 Stunden vorher kostenlos stornieren.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
