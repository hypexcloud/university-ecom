'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Lock, LogIn } from 'lucide-react'
import Link from 'next/link'

interface ProtectedRouteProps {
  children: ReactNode
  requireAuth?: boolean
  requireRole?: 'student' | 'instructor' | 'admin'
  redirectTo?: string
  fallback?: ReactNode
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true,
  requireRole,
  redirectTo = '/login',
  fallback 
}: ProtectedRouteProps) {
  const { user, appUser, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && requireAuth && !user) {
      router.push(redirectTo)
    }
  }, [user, loading, requireAuth, redirectTo, router])

  // Show loading state
  if (loading) {
    return fallback || <LoadingFallback />
  }

  // Check authentication requirement
  if (requireAuth && !user) {
    return fallback || <AuthRequiredFallback />
  }

  // Check role requirement
  if (requireRole && appUser && appUser.role !== requireRole) {
    return <RoleRequiredFallback requiredRole={requireRole} userRole={appUser.role} />
  }

  // Render protected content
  return <>{children}</>
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Laden...</p>
      </div>
    </div>
  )
}

// Authentication required fallback
function AuthRequiredFallback() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-md">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Anmeldung erforderlich</CardTitle>
          <CardDescription>
            Sie müssen angemeldet sein, um auf diese Seite zugreifen zu können.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" />
              Jetzt anmelden
            </Link>
          </Button>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Noch kein Konto?{' '}
              <Link href="/register" className="text-primary hover:underline">
                Jetzt registrieren
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Role required fallback
function RoleRequiredFallback({ requiredRole, userRole }: { requiredRole: string; userRole: string }) {
  return (
    <div className="container mx-auto px-6 py-12 max-w-md">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle>Zugriff verweigert</CardTitle>
          <CardDescription>
            Sie haben nicht die erforderlichen Berechtigungen für diese Seite.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>Erforderliche Rolle: <span className="font-medium">{requiredRole}</span></p>
            <p>Ihre Rolle: <span className="font-medium">{userRole}</span></p>
          </div>
          <Button asChild className="w-full" variant="outline">
            <Link href="/dashboard">
              Zum Dashboard zurückkehren
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// Higher-order component for page-level protection
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, 'children'> = {}
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}

// Hook for conditional rendering based on auth state
export function useAuthGuard() {
  const { user, appUser, loading } = useAuth()

  return {
    isAuthenticated: !!user,
    isLoading: loading,
    hasRole: (role: string) => appUser?.role === role,
    isStudent: appUser?.role === 'student',
    isInstructor: appUser?.role === 'instructor',
    isAdmin: appUser?.role === 'admin',
  }
}
