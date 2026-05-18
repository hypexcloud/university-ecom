'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { User, FileText, Award, MessageCircle, Bell, Shield, Lock } from 'lucide-react'

const profileNav = [
  { name: 'Persönliche Daten', href: '/student/profil', icon: User },
  { name: 'Rechnungen', href: '/student/profil/rechnungen', icon: FileText },
  { name: 'Zertifikate', href: '/student/profil/zertifikate', icon: Award },
  { name: 'Discord', href: '/student/profil/discord', icon: MessageCircle },
  { name: 'Benachrichtigungen', href: '/student/profil/benachrichtigungen', icon: Bell },
  { name: 'Termine', href: '/student/profil/termine-einstellungen', icon: Bell },
  { name: 'Sicherheit', href: '/student/profil/sicherheit', icon: Shield },
  { name: 'Datenschutz', href: '/student/profil/datenschutz', icon: Lock },
]

export default function ProfilLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profil</h1>

      {/* Sub-nav tabs */}
      <div className="border-b overflow-x-auto">
        <nav className="flex gap-1 min-w-max">
          {profileNav.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 text-sm border-b-2 transition-colors whitespace-nowrap',
                  isActive
                    ? 'border-blue-600 text-blue-700 font-medium'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300',
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {children}
    </div>
  )
}
