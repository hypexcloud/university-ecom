'use client'

import { useAuth } from '@/contexts/AuthContext'
import StudentDashboardPlanBased from '@/components/StudentDashboardPlanBased'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function StudentPage() {
  const { user } = useAuth()
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In production, fetch the user's active enrollment from Firestore
    // For now, using mock data
    const fetchEnrollment = async () => {
      if (!user?.uid) return

      try {
        // TODO: Replace with actual Firestore query
        // const enrollmentDoc = await getDoc(doc(db, 'enrollments', user.uid))
        // setEnrollmentId(enrollmentDoc.data()?.id)
        
        // Mock enrollment ID for development
        setEnrollmentId('enrollment-123')
      } catch (error) {
        console.error('Error fetching enrollment:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEnrollment()
  }, [user?.uid])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!enrollmentId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Keine aktive Einschreibung gefunden</h2>
          <p className="text-gray-600">Bitte kontaktieren Sie den Support.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <StudentDashboardPlanBased 
        userId={user?.uid || ''} 
        enrollmentId={enrollmentId} 
      />
    </div>
  )
}
