'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

// Types
type UserRole = 'admin' | 'mentor' | 'teilnehmer' | 'guest'

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  isMentor: boolean
  isTeilnehmer: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

// Mock users for demo - in production this would be Firebase Auth
const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@uniec.com',
    password: 'admin123',
    role: 'admin',
    isActive: true
  },
  {
    id: 'mentor-1',
    name: 'Dr. Sarah Müller',
    email: 'mentor@uniec.com', 
    password: 'mentor123',
    role: 'mentor',
    isActive: true
  },
  {
    id: 'student-1',
    name: 'Max Mustermann',
    email: 'student@uniec.com',
    password: 'student123',
    role: 'teilnehmer',
    isActive: true
  }
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on app start
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('currentUser')
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser)
        // Validate user object has required properties
        if (parsedUser && parsedUser.id && parsedUser.email && parsedUser.role) {
          setUser(parsedUser)
        } else {
          localStorage.removeItem('currentUser')
        }
      }
    } catch (error) {
      console.error('Error parsing saved user:', error)
      localStorage.removeItem('currentUser')
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Find user in mock database
      const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password)
      
      if (foundUser && foundUser.isActive) {
        const { password: _, ...userWithoutPassword } = foundUser
        setUser(userWithoutPassword)
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))
        setLoading(false)
        return true
      }
      
      setLoading(false)
      return false
    } catch (error) {
      console.error('Login error:', error)
      setLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem('currentUser')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isMentor: user?.role === 'mentor',
    isTeilnehmer: user?.role === 'teilnehmer'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Auth Guard Component
interface AuthGuardProps {
  children: ReactNode
  requiredRole?: UserRole
  fallback?: ReactNode
}

export function AuthGuard({ children, requiredRole, fallback }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Zugriff verweigert</h2>
          <p className="text-gray-600 mb-6">Bitte melden Sie sich an, um fortzufahren.</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Zur Anmeldung
          </button>
        </div>
      </div>
    )
  }

  if (requiredRole && user.role !== requiredRole) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Zugriff verweigert</h2>
          <p className="text-gray-600 mb-4">
            Sie haben nicht die erforderlichen Berechtigungen für diese Seite.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600">
              <strong>Erforderliche Rolle:</strong> {requiredRole}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Ihre Rolle:</strong> {user.role}
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Zur Startseite
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('currentUser')
                router.push('/login')
              }}
              className="w-full bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Anderes Konto verwenden
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Admin Guard - specifically for admin routes
export function AdminGuard({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requiredRole="admin">
      {children}
    </AuthGuard>
  )
}
