'use client'

import { AdminGuard } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'
import '../dashboard-globals.css'
import { useEffect } from 'react'

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Force light mode for dashboard
    document.documentElement.classList.remove('dark')
    document.documentElement.style.colorScheme = 'light'
  }, [])

  return (
    <AdminGuard>
      <AdminLayout>
        {children}
      </AdminLayout>
    </AdminGuard>
  )
}