'use client'

import { useAuth } from '@/contexts/AuthContext'
import StudentDashboard from '@/components/StudentDashboard'

export default function StudentPage() {
  const { user } = useAuth()

  // Mock enrollment ID - in production, fetch from user data
  const enrollmentId = 'enrollment-123'

  return <StudentDashboard userId={user?.uid || ''} enrollmentId={enrollmentId} />
}
