'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Home, BookOpen, Calendar, Palette, Users, Video, Award,
  Gift, MessageSquare, User, type LucideIcon,
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: LucideIcon
  visible: boolean
}

interface SidebarNavProps {
  hasCourseEntitlement: boolean
  hasBusinessOrInfinity: boolean
  hasCreatorEntitlement: boolean
  isAffiliate: boolean
  hasGiftcards: boolean
}

export function SidebarNav({
  hasCourseEntitlement,
  hasBusinessOrInfinity,
  hasCreatorEntitlement,
  isAffiliate,
  hasGiftcards,
}: SidebarNavProps) {
  const pathname = usePathname()

  const items: NavItem[] = [
    { name: 'Übersicht', href: '/student', icon: Home, visible: true },
    { name: 'Meine Kurse', href: '/student/kurse', icon: BookOpen, visible: hasCourseEntitlement },
    { name: 'Termine', href: '/student/termine', icon: Calendar, visible: hasBusinessOrInfinity },
    { name: 'Creator Programm', href: '/student/creator', icon: Palette, visible: hasCreatorEntitlement },
    { name: 'Community', href: '/student/community', icon: Users, visible: true },
    { name: 'Interviews', href: '/student/interviews', icon: Video, visible: true },
    { name: 'Affiliate', href: '/student/affiliate', icon: Award, visible: isAffiliate },
    { name: 'Giftcards', href: '/student/giftcards', icon: Gift, visible: hasGiftcards },
    { name: 'Support', href: '/student/support', icon: MessageSquare, visible: true },
    { name: 'Profil', href: '/student/profil', icon: User, visible: true },
  ]

  const visibleItems = items.filter((i) => i.visible)

  return (
    <nav className="space-y-1">
      {visibleItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
              isActive
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
            )}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}
