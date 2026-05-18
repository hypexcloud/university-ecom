'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

interface CustomerProfile {
  uid: string
  email: string
  firstName: string
  lastName: string
  discordUsername: string | null
  whatsapp: string | null
  status: string
}

interface AuthContextType {
  user: User | null
  customer: CustomerProfile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (data: SignUpData) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: string | null }>
}

interface SignUpData {
  email: string
  password: string
  firstName: string
  lastName: string
  discordUsername?: string
  whatsapp?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [customer, setCustomer] = useState<CustomerProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  const fetchCustomerProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/profile')
      if (res.ok) {
        const data = await res.json()
        setCustomer(data)
      }
    } catch {
      setCustomer(null)
    }
  }, [])

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession()
      setSession(initialSession)
      setUser(initialSession?.user ?? null)
      if (initialSession?.user) {
        await fetchCustomerProfile()
      }
      setLoading(false)
    }

    initAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession)
        setUser(newSession?.user ?? null)
        if (newSession?.user) {
          await fetchCustomerProfile()
        } else {
          setCustomer(null)
        }
      },
    )

    return () => subscription.unsubscribe()
  }, [supabase, fetchCustomerProfile])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      return { error: error.message }
    }
    return { error: null }
  }, [supabase])

  const signUp = useCallback(async (data: SignUpData) => {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
        },
      },
    })

    if (authError) {
      return { error: authError.message }
    }

    if (!authData.user) {
      return { error: 'Registrierung fehlgeschlagen' }
    }

    // 2. Create customer row — server verifies via session or service-role lookup
    const registerBody = JSON.stringify({
      uid: authData.user.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      discordUsername: data.discordUsername || null,
      whatsapp: data.whatsapp || null,
    })

    let res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: registerBody,
    })

    if (!res.ok) {
      // Retry once after a short delay
      await new Promise((r) => setTimeout(r, 1000))
      res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: registerBody,
      })
    }

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}))
      return { error: errBody.error || 'Profil konnte nicht erstellt werden' }
    }

    return { error: null }
  }, [supabase])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setCustomer(null)
    setSession(null)
  }, [supabase])

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login/update-password`,
    })
    if (error) {
      return { error: error.message }
    }
    return { error: null }
  }, [supabase])

  return (
    <AuthContext.Provider
      value={{ user, customer, session, loading, signIn, signUp, signOut, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/**
 * Client-side guard for admin layout. Middleware handles the actual redirect,
 * this prevents flash of admin content while redirect happens.
 */
export function AdminGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user) return null

  return <>{children}</>
}
