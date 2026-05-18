'use client'

import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Home, ArrowLeft, MessageSquare, BookOpen, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function NotFoundPage() {
  const pathname = usePathname()
  const isDashboard = pathname.startsWith('/student') || pathname.startsWith('/admin') || pathname.startsWith('/mentor')

  if (isDashboard) {
    return <DashboardNotFound pathname={pathname} />
  }

  return <MarketingNotFound />
}

function DashboardNotFound({ pathname }: { pathname: string }) {
  const portal = pathname.startsWith('/admin') ? 'admin' : pathname.startsWith('/mentor') ? 'mentor' : 'student'
  const homeLink = `/${portal}`
  const portalName = portal === 'admin' ? 'Admin' : portal === 'mentor' ? 'Mentor' : 'Dashboard'

  return (
    <div className="dashboard-shell min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-7xl font-bold text-blue-600">404</h1>
        <h2 className="text-2xl font-bold text-gray-900">Seite nicht gefunden</h2>
        <p className="text-gray-500">Diese Seite existiert nicht in deinem {portalName}.</p>
        <div className="flex gap-3 justify-center">
          <Button asChild variant="outline">
            <Link href={homeLink}><ArrowLeft className="h-4 w-4 mr-2" /> Zum {portalName}</Link>
          </Button>
          <Button asChild>
            <Link href="/student/support"><MessageSquare className="h-4 w-4 mr-2" /> Support</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function MarketingNotFound() {
  return (
    <div className="container mx-auto px-6 py-12 min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-8 max-w-2xl">
        <div className="space-y-4">
          <div className="text-8xl md:text-9xl font-bold text-primary/20">404</div>
          <h1 className="text-4xl md:text-5xl font-bold">Seite nicht gefunden</h1>
          <p className="text-xl text-muted-foreground">Die Seite, die Sie suchen, existiert nicht oder wurde verschoben.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">AI Kurs</CardTitle>
              <CardDescription>Künstliche Intelligenz lernen</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full"><Link href="/courses/ai">Zum AI Kurs</Link></Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Dropshipping Kurs</CardTitle>
              <CardDescription>E-Commerce ohne Lager</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full"><Link href="/courses/dropshipping">Zum Dropshipping Kurs</Link></Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Button asChild size="lg"><Link href="/"><Home className="mr-2 h-5 w-5" /> Zur Startseite</Link></Button>
        </div>
      </div>
    </div>
  )
}
