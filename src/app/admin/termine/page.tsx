'use client'

import { useAuth } from '@/lib/auth/auth-provider'
import AdminAppointmentView from '@/components/AdminAppointmentView'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function AdminTerminePage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Calendar className="h-8 w-8" />
            Termine Verwaltung
          </h1>
          <p className="text-gray-600 mt-2">
            Überblick über alle gebuchten Coaching-Sessions
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück
          </Link>
        </Button>
      </div>

      <AdminAppointmentView coachId={user?.id || ''} />
    </div>
  )
}
