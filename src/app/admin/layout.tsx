'use client'

import { AdminGuard } from '@/lib/auth/auth-provider'
import AdminLayout from '@/components/AdminLayout'
import '../dashboard-globals.css'

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminGuard>
      <div className="dashboard-shell">
        <AdminLayout>
          {children}
        </AdminLayout>
      </div>
    </AdminGuard>
  )
}
