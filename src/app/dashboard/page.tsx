import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="text-center space-y-6 mb-12">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <LayoutDashboard className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-xl text-muted-foreground">
          Ihr persönlicher Lernbereich
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>🚧 In Entwicklung</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Das Dashboard wird nach der Authentifizierung implementiert mit:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground mb-6">
            <li>• Kursfortschritt anzeigen</li>
            <li>• Zugang zu gekauften Kursen</li>
            <li>• Wöchentliche Feedback-Formulare</li>
            <li>• Community-Links (WhatsApp/Discord)</li>
            <li>• Profil-Verwaltung</li>
          </ul>
          <Button asChild>
            <Link href="/login">
              <ArrowRight className="mr-2 h-4 w-4" />
              Zuerst anmelden
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
