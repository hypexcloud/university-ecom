'use client'

import { useAuth } from '@/lib/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import RegisterForm from './register-form'

export default function RegisterPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (!loading && user) {
      router.push('/student')
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

  // If user is logged in, don't render the register form (redirect is happening)
  if (user) {
    return null
  }

  // Render register form for non-authenticated users
  return (
    <div className="container mx-auto px-6 py-12 max-w-md">
      <RegisterForm />
    </div>
  )
}
