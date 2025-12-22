'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import MentorDashboard from '@/components/MentorDashboard'
import { hasAdminPrivileges } from '@/lib/role-utils'

export default function MentorDashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else if (!hasAdminPrivileges(user.role)) {
        router.push('/dashboard') // Redirect non-admins
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Lade Mentor-Dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || !hasAdminPrivileges(user.role)) {
    return null // Will redirect
  }

  return <MentorDashboard />
}
