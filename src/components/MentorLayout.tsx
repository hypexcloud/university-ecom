'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import {
  CalendarIcon,
  Users,
  MessageSquare,
  Settings,
  HomeIcon,
  LogOut,
  MenuIcon,
  XIcon,
  BookOpen,
  TrendingUp
} from 'lucide-react'
import { useState } from 'react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/mentor',
    icon: HomeIcon,
    description: 'Übersicht und heutige Termine'
  },
  {
    name: 'Meine Termine',
    href: '/mentor/termine',
    icon: CalendarIcon,
    description: 'Terminkalender und Sitzungen'
  },
  {
    name: 'Meine Studenten',
    href: '/mentor/studenten',
    icon: Users,
    description: 'Studentenfortschritt verwalten'
  },
  {
    name: 'Nachrichten',
    href: '/mentor/nachrichten',
    icon: MessageSquare,
    description: 'Kommunikation mit Studenten'
  },
  {
    name: 'Materialien',
    href: '/mentor/materialien',
    icon: BookOpen,
    description: 'Kursmaterialien verwalten'
  },
  {
    name: 'Einstellungen',
    href: '/mentor/einstellungen',
    icon: Settings,
    description: 'Profil und Verfügbarkeit'
  }
]

interface MentorLayoutProps {
  children: React.ReactNode
}

export default function MentorLayout({ children }: MentorLayoutProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Mentor Portal</h1>
              <p className="text-xs text-gray-500">{user?.name}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900">Mentor Portal</h1>
                <p className="text-xs text-gray-500">Mentoring System</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/mentor' && pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-colors group',
                    isActive
                      ? 'bg-green-50 text-green-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon 
                    className={cn(
                      'h-5 w-5 transition-colors flex-shrink-0',
                      isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'
                    )} 
                  />
                  <div className="min-w-0">
                    <div className="truncate">{item.name}</div>
                    <div className={cn(
                      'text-xs transition-colors truncate',
                      isActive ? 'text-green-600' : 'text-gray-500'
                    )}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-medium text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || 'M'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Mentor'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="w-full justify-start text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4 mr-2 flex-shrink-0" />
              Abmelden
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="w-full min-h-screen">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
