'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import { UserService } from '@/lib/firebase/firestore'
import { User as AppUser } from '@/lib/types'
import { Timestamp } from 'firebase/firestore'

interface AuthContextType {
  user: User | null
  appUser: AppUser | null
  loading: boolean
  error: string | null
  
  // Auth methods
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData: { firstName: string; lastName: string }) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateUserProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>
  
  // Utility methods
  clearError: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [appUser, setAppUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  // Create or update user profile in Firestore
  const createOrUpdateAppUser = async (firebaseUser: User, additionalData?: Partial<AppUser>) => {
    try {
      // Check if user already exists
      let existingUser = await UserService.getUserById(firebaseUser.uid) as AppUser | null
      
      if (!existingUser) {
        // Create new user profile with UID as document ID
        const newUserData: Omit<AppUser, 'createdAt' | 'updatedAt'> = {
          uid: firebaseUser.uid, // Include UID for document creation
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || additionalData?.displayName || '',
          photoURL: firebaseUser.photoURL || additionalData?.photoURL || '',
          role: 'student',
          profile: {
            firstName: additionalData?.profile?.firstName || '',
            lastName: additionalData?.profile?.lastName || '',
            company: '',
            industry: '',
            experience: 'beginner',
            goals: [],
            timeZone: 'Europe/Berlin',
            country: 'DE',
            marketingConsent: false,
            communicationPreferences: {
              email: true,
              whatsapp: false,
              discord: false,
            },
          },
          lastLoginAt: Timestamp.now(),
        }

        await UserService.createUser(newUserData)
        existingUser = await UserService.getUserById(firebaseUser.uid) as AppUser | null
      } else {
        // Update last login and any additional data
        const updateData: Partial<AppUser> = {
          lastLoginAt: Timestamp.now(),
          ...(additionalData && { ...additionalData })
        }
        
        await UserService.updateUser(firebaseUser.uid, updateData)
        existingUser = await UserService.getUserById(firebaseUser.uid) as AppUser | null
      }

      if (existingUser) {
        setAppUser(existingUser)
      }
    } catch (error) {
      console.error('Error creating/updating user profile:', error)
      // Don't throw error here - the user can still use the app with Firebase auth only
    }
  }

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      setLoading(true)
      
      const result = await signInWithEmailAndPassword(auth, email, password)
      await createOrUpdateAppUser(result.user)
    } catch (error: any) {
      console.error('Sign in error:', error)
      setError(getAuthErrorMessage(error.code))
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Sign up with email and password
  const signUp = async (email: string, password: string, userData: { firstName: string; lastName: string }) => {
    try {
      setError(null)
      setLoading(true)
      
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update Firebase profile
      await updateProfile(result.user, {
        displayName: `${userData.firstName} ${userData.lastName}`
      })

      // Send email verification (optional - don't block if it fails)
      try {
        await sendEmailVerification(result.user)
      } catch (emailError) {
        console.warn('Email verification failed:', emailError)
        // Continue without email verification
      }
      
      // Create app user profile
      await createOrUpdateAppUser(result.user, {
        displayName: `${userData.firstName} ${userData.lastName}`,
        profile: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          company: '',
          industry: '',
          experience: 'beginner',
          goals: [],
          timeZone: 'Europe/Berlin',
          country: 'DE',
          marketingConsent: false,
          communicationPreferences: {
            email: true,
            whatsapp: false,
            discord: false,
          },
        },
      })
    } catch (error: any) {
      console.error('Sign up error:', error)
      setError(getAuthErrorMessage(error.code))
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null)
      setLoading(true)
      
      const result = await signInWithPopup(auth, googleProvider)
      
      // Extract name from Google profile
      const nameParts = result.user.displayName?.split(' ') || ['', '']
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''
      
      await createOrUpdateAppUser(result.user, {
        profile: {
          firstName,
          lastName,
          company: '',
          industry: '',
          experience: 'beginner',
          goals: [],
          timeZone: 'Europe/Berlin',
          country: 'DE',
          marketingConsent: false,
          communicationPreferences: {
            email: true,
            whatsapp: false,
            discord: false,
          },
        },
      })
    } catch (error: any) {
      console.error('Google sign in error:', error)
      setError(getAuthErrorMessage(error.code))
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Sign out
  const logout = async () => {
    try {
      setError(null)
      setLoading(true)
      
      await signOut(auth)
      setUser(null)
      setAppUser(null)
      
      // Clear any stored data
      if (typeof window !== 'undefined') {
        // Clear any localStorage/sessionStorage if needed
        // localStorage.clear() // Only if you store auth data there
      }
    } catch (error: any) {
      console.error('Sign out error:', error)
      setError('Fehler beim Abmelden')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setError(null)
      await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
      console.error('Password reset error:', error)
      setError(getAuthErrorMessage(error.code))
      throw error
    }
  }

  // Update user profile
  const updateUserProfile = async (data: { displayName?: string; photoURL?: string }) => {
    try {
      setError(null)
      if (!user) throw new Error('No user logged in')
      
      await updateProfile(user, data)
      
      // Update app user profile
      if (appUser) {
        await UserService.updateUser(user.uid, {
          displayName: data.displayName || appUser.displayName,
          photoURL: data.photoURL || appUser.photoURL,
        })
        
        // Refresh app user data
        await refreshUser()
      }
    } catch (error: any) {
      console.error('Profile update error:', error)
      setError('Fehler beim Aktualisieren des Profils')
      throw error
    }
  }

  // Refresh user data
  const refreshUser = async () => {
    if (user) {
      try {
        const updatedAppUser = await UserService.getUserById(user.uid) as AppUser | null
        if (updatedAppUser) {
          setAppUser(updatedAppUser)
        }
      } catch (error) {
        console.error('Error refreshing user:', error)
        // Don't set error state here - just log it
      }
    }
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setLoading(true)
        clearError() // Clear any previous errors
        
        if (firebaseUser) {
          setUser(firebaseUser)
          await createOrUpdateAppUser(firebaseUser)
        } else {
          setUser(null)
          setAppUser(null)
        }
      } catch (error) {
        console.error('Auth state change error:', error)
        // Don't set error for auth state issues - just log them
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const value: AuthContextType = {
    user,
    appUser,
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    clearError,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Helper function to get user-friendly error messages
function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/user-disabled':
      return 'Ihr Konto wurde deaktiviert. Kontaktieren Sie den Support.'
    case 'auth/user-not-found':
      return 'Kein Benutzer mit dieser E-Mail-Adresse gefunden.'
    case 'auth/wrong-password':
      return 'Falsches Passwort. Bitte versuchen Sie es erneut.'
    case 'auth/email-already-in-use':
      return 'Ein Konto mit dieser E-Mail-Adresse existiert bereits.'
    case 'auth/weak-password':
      return 'Das Passwort ist zu schwach. Verwenden Sie mindestens 6 Zeichen.'
    case 'auth/invalid-email':
      return 'Ungültige E-Mail-Adresse.'
    case 'auth/operation-not-allowed':
      return 'Diese Anmeldeoption ist nicht aktiviert.'
    case 'auth/account-exists-with-different-credential':
      return 'Ein Konto mit dieser E-Mail existiert bereits mit einem anderen Anbieter.'
    case 'auth/invalid-credential':
      return 'Ungültige Anmeldedaten.'
    case 'auth/too-many-requests':
      return 'Zu viele fehlgeschlagene Versuche. Versuchen Sie es später erneut.'
    case 'auth/network-request-failed':
      return 'Netzwerkfehler. Überprüfen Sie Ihre Internetverbindung.'
    case 'auth/popup-closed-by-user':
      return 'Anmeldung abgebrochen.'
    case 'auth/popup-blocked':
      return 'Popup wurde blockiert. Erlauben Sie Popups für diese Seite.'
    default:
      return 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
  }
}
