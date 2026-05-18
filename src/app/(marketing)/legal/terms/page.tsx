import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="text-center space-y-6 mb-12">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold">Allgemeine Geschäftsbedingungen</h1>
        <p className="text-xl text-muted-foreground">
          Nutzungsbedingungen für University Ecom
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>🚧 In Entwicklung</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Die AGB werden in Phase 1 / Step 10 implementiert mit:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground mb-6">
            <li>• EU-rechtskonforme Geschäftsbedingungen</li>
            <li>• Widerrufsrecht und Rückgabebestimmungen</li>
            <li>• Nutzungsrechte für Kursinhalte</li>
            <li>• Haftungsausschlüsse und Gewährleistung</li>
            <li>• Community-Richtlinien</li>
          </ul>
          <Button asChild>
            <Link href="/">
              <ArrowRight className="mr-2 h-4 w-4" />
              Zur Startseite
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
