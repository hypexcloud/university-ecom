'use client'

import { useAuth } from '@/contexts/AuthContext'
import SessionList from '@/components/SessionList'
import { Button } from '@/components/ui/button'
import { Calendar, Plus } from 'lucide-react'
import Link from 'next/link'

export default function SessionsPage() {
  const { user } = useAuth()

  // Mock enrollment ID - in production, fetch from user data
  const enrollmentId = 'enrollment-123'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Calendar className="h-8 w-8" />
            Meine Sessions
          </h1>
          <p className="text-gray-600 mt-2">
            Verwalten Sie Ihre gebuchten Coaching-Sessions
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/student/book-session">
            <Plus className="h-4 w-4 mr-2" />
            Neue Session buchen
          </Link>
        </Button>
      </div>

      {/* Session List */}
      <SessionList 
        userId={user?.id || ''}
        enrollmentId={enrollmentId}
      />
    </div>
  )
}
