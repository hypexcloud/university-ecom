'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import TeilnehmerDashboard from '@/components/TeilnehmerDashboard'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else {
        // Redirect based on user role
        if (user.role === 'admin') {
          router.push('/admin')
        } else if (user.role === 'mentor') {
          router.push('/mentor/dashboard')
        }
        // If user is 'teilnehmer', stay on this page and show TeilnehmerDashboard
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Lade Dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  // Show participant dashboard for students/teilnehmer
  if (user.role === 'teilnehmer' || !user.role) {
    return <TeilnehmerDashboard />
  }

  return null // Will redirect for admin/mentor roles
}
