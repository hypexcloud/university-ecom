'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronDown, Shield, GraduationCap, Users } from 'lucide-react'

interface Portal {
  role: string
  label: string
  href: string
  icon: typeof Shield
  color: string
}

const ALL_PORTALS: Portal[] = [
  { role: 'admin', label: 'Admin', href: '/admin', icon: Shield, color: 'bg-red-100 text-red-700' },
  { role: 'mentor', label: 'Mentor', href: '/mentor', icon: Users, color: 'bg-green-100 text-green-700' },
  { role: 'student', label: 'Dashboard', href: '/student', icon: GraduationCap, color: 'bg-blue-100 text-blue-700' },
]

export function PortalSwitcher() {
  const pathname = usePathname()
  const [roles, setRoles] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetch('/api/auth/roles')
      .then((r) => r.ok ? r.json() : { roles: ['student'] })
      .then((data) => setRoles(data.roles || ['student']))
      .catch(() => setRoles(['student']))
  }, [])

  const availablePortals = ALL_PORTALS.filter((p) => roles.includes(p.role))
  const currentPortal = ALL_PORTALS.find((p) => pathname.startsWith(p.href)) || ALL_PORTALS[2]

  // Don't show if only one portal
  if (availablePortals.length <= 1) return null

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
      >
        <div className={`w-5 h-5 rounded flex items-center justify-center ${currentPortal.color}`}>
          <currentPortal.icon className="h-3 w-3" />
        </div>
        <span>{currentPortal.label}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1 w-48 bg-white border rounded-lg shadow-lg z-50 py-1">
            {availablePortals.map((portal) => {
              const isActive = pathname.startsWith(portal.href)
              return (
                <Link
                  key={portal.role}
                  href={portal.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 text-sm transition-colors ${isActive ? 'bg-gray-50 font-medium' : 'hover:bg-gray-50'}`}
                >
                  <div className={`w-6 h-6 rounded flex items-center justify-center ${portal.color}`}>
                    <portal.icon className="h-3.5 w-3.5" />
                  </div>
                  <span>{portal.label}</span>
                  {isActive && <span className="ml-auto text-xs text-gray-400">Aktiv</span>}
                </Link>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
