'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Lock, LogIn } from 'lucide-react'
import Link from 'next/link'

interface ProtectedRouteProps {
  children: ReactNode
  requireAuth?: boolean
  redirectTo?: string
  fallback?: ReactNode
}

export function ProtectedRoute({
  children,
  requireAuth: authRequired = true,
  redirectTo = '/login',
  fallback,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && authRequired && !user) {
      router.push(redirectTo)
    }
  }, [user, loading, authRequired, redirectTo, router])

  if (loading) {
    return fallback || <LoadingFallback />
  }

  if (authRequired && !user) {
    return fallback || <AuthRequiredFallback />
  }

  return <>{children}</>
}

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

export function useAuthGuard() {
  const { user, loading } = useAuth()

  return {
    isAuthenticated: !!user,
    isLoading: loading,
  }
}
