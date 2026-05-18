'use client'

import { useAuth } from '@/lib/auth/auth-provider'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import StudentLayout from '@/components/StudentLayout'
import '../dashboard-globals.css'

export default function StudentRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()

  useEffect(() => {
    document.documentElement.classList.remove('dark')
    document.documentElement.style.colorScheme = 'light'
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
      </div>
    )
  }

  if (!user) return null // Middleware handles redirect

  return <StudentLayout>{children}</StudentLayout>
}
