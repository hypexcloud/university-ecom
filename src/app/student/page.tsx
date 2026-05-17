'use client'

import { useAuth } from '@/contexts/AuthContext'
import StudentDashboardPlanBased from '@/components/StudentDashboardPlanBased'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function StudentPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simple timeout to stop loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  // Mock enrollment ID - in production fetch from Firestore
  const enrollmentId = 'enrollment-123'

  return (
    <div className="container mx-auto px-4 py-8">
      <StudentDashboardPlanBased 
        userId={user?.id || 'user-123'}
        enrollmentId={enrollmentId} 
      />
    </div>
  )
}
