'use client'

import { useAuth } from '@/lib/auth/auth-provider'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Menu, X, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SidebarNav } from '@/components/dashboard/sidebar-nav'
import { NotificationBell } from '@/components/notification-bell'
import '../dashboard-globals.css'

interface NavFlags {
  hasCourseEntitlement: boolean
  hasBusinessOrInfinity: boolean
  hasCreatorEntitlement: boolean
  isAffiliate: boolean
  hasGiftcards: boolean
}

export default function StudentRootLayout({ children }: { children: React.ReactNode }) {
  const { user, customer, loading, signOut } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [navFlags, setNavFlags] = useState<NavFlags>({
    hasCourseEntitlement: false, hasBusinessOrInfinity: false,
    hasCreatorEntitlement: false, isAffiliate: false, hasGiftcards: false,
  })

  useEffect(() => {
    document.documentElement.classList.remove('dark')
    document.documentElement.style.colorScheme = 'light'
  }, [])

  useEffect(() => {
    if (!user) return
    fetch('/api/student/nav-flags')
      .then((r) => (r.ok ? r.json() : {}))
      .then((data: Partial<NavFlags>) => setNavFlags((prev) => ({ ...prev, ...data })))
      .catch(() => {})
  }, [user])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
  }
  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <div className="lg:hidden bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-sm">UE</span></div>
            <span className="font-bold text-gray-900">University Ecom</span>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center h-16 px-6 border-b">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3"><span className="text-white font-bold text-sm">UE</span></div>
            <div><h1 className="font-bold text-gray-900 text-sm">University Ecom</h1><p className="text-xs text-gray-500">Dashboard</p></div>
          </div>
          <div className="flex-1 px-4 py-6 overflow-y-auto">
            <SidebarNav {...navFlags} />
          </div>
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-700">
                {customer?.firstName?.charAt(0) || 'K'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{customer?.firstName} {customer?.lastName}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => { signOut(); router.push('/login') }} className="w-full justify-start">
              <LogOut className="h-4 w-4 mr-2" /> Abmelden
            </Button>
          </div>
        </div>
      </div>

      {sidebarOpen && <div className="fixed inset-0 bg-gray-600/75 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="lg:pl-64">
        <div className="hidden lg:flex items-center justify-end p-4 border-b bg-white"><NotificationBell /></div>
        <main className="w-full min-h-screen">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
