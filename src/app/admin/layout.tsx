'use client'

import { AdminGuard } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminGuard>
      <AdminLayout>
        {children}
      </AdminLayout>
    </AdminGuard>
  )
}