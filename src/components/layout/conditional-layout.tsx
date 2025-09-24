'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Check if current route is a dashboard route (admin, mentor, or student)
  const isDashboardRoute = pathname.startsWith('/admin') || 
                          pathname.startsWith('/mentor') || 
                          pathname.startsWith('/student')
  
  // For dashboard routes, render children directly without homepage header/footer
  if (isDashboardRoute) {
    return <>{children}</>
  }
  
  // For non-dashboard routes, render with homepage layout
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
