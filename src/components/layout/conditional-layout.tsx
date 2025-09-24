'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Check if current route is an admin route
  const isAdminRoute = pathname.startsWith('/admin')
  
  // For admin routes, render children directly without homepage header/footer
  if (isAdminRoute) {
    return <>{children}</>
  }
  
  // For non-admin routes, render with homepage layout
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
