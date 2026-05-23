'use client'

import { usePathname } from 'next/navigation'
import { PrestigeHeader } from '@/components/prestige-header'
import { PrestigeFooter } from '@/components/prestige-footer'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Check if current route is a dashboard route (admin, mentor, student, dashboard, or login)
  const isDashboardRoute = pathname.startsWith('/admin') || 
                          pathname.startsWith('/mentor') || 
                          pathname.startsWith('/student') ||
                          pathname.startsWith('/dashboard') ||
                          pathname.startsWith('/login') ||
                          pathname.startsWith('/reset-password')
  
  // For dashboard routes, render children directly without homepage header/footer
  if (isDashboardRoute) {
    return <>{children}</>
  }
  
  // For non-dashboard routes, render with prestige homepage layout
  return (
    <div className="flex min-h-screen flex-col bg-prestige-black">
      <PrestigeHeader />
      <main className="flex-1">
        {children}
      </main>
      <PrestigeFooter />
    </div>
  )
}
