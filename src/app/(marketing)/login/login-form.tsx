'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/lib/auth/auth-provider'
import { LogIn, Eye, EyeOff, Mail, Lock, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
  password: z.string().min(6, 'Das Passwort muss mindestens 6 Zeichen haben'),
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginFormContent() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const explicitRedirect = searchParams.get('redirectTo')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      setError('')

      const { error: signInError } = await signIn(data.email, data.password)
      if (signInError) {
        setError('Ungültige E-Mail oder Passwort')
      } else {
        // Determine role-based redirect and set cookie for middleware
        const roleRes = await fetch('/api/auth/role')
        const roleData = await roleRes.json().catch(() => ({ role: 'student', redirect: '/student' }))
        // Set role cookie for middleware gating
        document.cookie = `x-user-role=${roleData.role}; path=/; max-age=300`
        router.push(explicitRedirect || roleData.redirect || '/student')
        router.refresh()
      }
    } catch {
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Anmelden</CardTitle>
          <CardDescription>
            Geben Sie Ihre E-Mail-Adresse und Ihr Passwort ein, um sich anzumelden.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail-Adresse</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="max@beispiel.de"
                  autoComplete="email"
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  {...register('email')}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  {...register('password')}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
                  </span>
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Link
                href="/login/reset-password"
                className="text-sm text-primary hover:underline"
              >
                Passwort vergessen?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Anmelden...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Anmelden
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Noch kein Konto?{' '}
          <Link href="/courses" className="text-primary hover:underline font-medium">
            Kurs kaufen & Zugang erhalten
          </Link>
        </p>
      </div>
    </div>
  )
}

function LoginFormFallback() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Anmelden</CardTitle>
          <CardDescription>Laden...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginForm() {
  return (
    <Suspense fallback={<LoginFormFallback />}>
      <LoginFormContent />
    </Suspense>
  )
}
