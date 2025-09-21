import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function CommunityPage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="text-center space-y-6 mb-12">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Users className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold">Community</h1>
        <p className="text-xl text-muted-foreground">
          Vernetzen Sie sich mit Gleichgesinnten
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>🚧 In Entwicklung</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Die Community-Features werden in Phase 1 / Step 9 implementiert mit:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground mb-6">
            <li>• Geschützte WhatsApp-Gruppenlinks</li>
            <li>• Discord-Server Zugang</li>
            <li>• Zugang nur für eingeschriebene Studenten</li>
            <li>• Entitlements-basierte Freischaltung</li>
            <li>• Community-Guidelines</li>
          </ul>
          <Button asChild>
            <Link href="/courses">
              <ArrowRight className="mr-2 h-4 w-4" />
              Kurse ansehen um Community-Zugang zu erhalten
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
