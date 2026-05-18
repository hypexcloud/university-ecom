'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-provider'
import { NotificationBell } from '@/components/notification-bell'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Home, Calendar, Clock, Users, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import '../dashboard-globals.css'

const nav = [
  { name: 'Dashboard', href: '/mentor', icon: Home },
  { name: 'Sessions', href: '/mentor/sessions', icon: Calendar },
  { name: 'Verfügbarkeit', href: '/mentor/availability', icon: Clock },
  { name: 'Teilnehmer', href: '/mentor/students', icon: Users },
]

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  const { user, customer, signOut } = useAuth()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="dashboard-shell min-h-screen bg-gray-50">
      {/* Mobile header */}
      <div className="lg:hidden bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-sm">M</span></div>
            <span className="font-bold text-gray-900">Mentor Portal</span>
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
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3"><span className="text-white font-bold text-sm">M</span></div>
            <div><h1 className="font-bold text-gray-900 text-sm">Mentor Portal</h1><p className="text-xs text-gray-500">University Ecom</p></div>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1">
            {nav.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link key={item.href} href={item.href} className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                  isActive ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-600 hover:bg-gray-100',
                )}>
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm font-medium text-green-700">
                {customer?.firstName?.charAt(0) || 'M'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{customer?.firstName} {customer?.lastName}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => signOut()} className="w-full justify-start">
              <LogOut className="h-4 w-4 mr-2" /> Abmelden
            </Button>
          </div>
        </div>
      </div>

      {sidebarOpen && <div className="fixed inset-0 bg-gray-600/75 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="lg:pl-64">
        <div className="hidden lg:flex items-center justify-end p-4 border-b bg-white"><NotificationBell /></div>
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">{children}</main>
      </div>
    </div>
  )
}
