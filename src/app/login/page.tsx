'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import LoginForm from './login-form'
import { getDashboardRoute } from '@/lib/role-utils'

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If user is already logged in, redirect to appropriate dashboard
    if (!loading && user) {
      const dashboardRoute = getDashboardRoute(user.role)
      router.push(dashboardRoute)
    }
  }, [user, loading, router])

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Überprüfe Anmeldestatus...</p>
        </div>
      </div>
    )
  }

  // If user is logged in, don't render the login form (redirect is happening)
  if (user) {
    return null
  }

  // Render login form for non-authenticated users
  return (
    <div className="container mx-auto px-6 py-12 max-w-md">
      <LoginForm />
    </div>
  )
}
