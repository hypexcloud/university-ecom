import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Home, Search, BookOpen, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div className="container mx-auto px-6 py-12 min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-8 max-w-2xl">
        {/* 404 Hero */}
        <div className="space-y-4">
          <div className="text-8xl md:text-9xl font-bold text-primary/20">404</div>
          <h1 className="text-4xl md:text-5xl font-bold">Seite nicht gefunden</h1>
          <p className="text-xl text-muted-foreground">
            Die Seite, die Sie suchen, existiert nicht oder wurde verschoben.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">AI Kurs</CardTitle>
              <CardDescription>Künstliche Intelligenz lernen</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/courses/ai">
                  Zum AI Kurs
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Dropshipping Kurs</CardTitle>
              <CardDescription>E-Commerce ohne Lager</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/courses/dropshipping">
                  Zum Dropshipping Kurs
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Options */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Zur Startseite
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
            <Link href="/courses">
              <Search className="mr-2 h-5 w-5" />
              Kurse durchsuchen
            </Link>
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t">
          <p className="text-sm text-muted-foreground mb-4">Häufig gesuchte Seiten:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/about" className="text-primary hover:underline">
              Über uns
            </Link>
            <Link href="/pricing/ai" className="text-primary hover:underline">
              AI Preise
            </Link>
            <Link href="/pricing/dropshipping" className="text-primary hover:underline">
              Dropshipping Preise
            </Link>
            <Link href="/support" className="text-primary hover:underline">
              Support
            </Link>
            <Link href="/community" className="text-primary hover:underline">
              Community
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
