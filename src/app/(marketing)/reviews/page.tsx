import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function ReviewsPage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="text-center space-y-6 mb-12">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Star className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold">Bewertungen</h1>
        <p className="text-xl text-muted-foreground">
          Was unsere Studenten über uns sagen
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>🚧 In Entwicklung</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Das Bewertungssystem wird in Phase 1 / Step 9 implementiert mit:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground mb-6">
            <li>• "Google Bewertung" Modul mit 5-Sterne-System</li>
            <li>• "500+ reviews" Platzhalter (konfigurierbar)</li>
            <li>• Echte Kundenbewertungen anzeigen</li>
            <li>• Review-Aggregation von verschiedenen Plattformen</li>
            <li>• Testimonial-Sektion</li>
          </ul>
          <Button asChild>
            <Link href="/about">
              <ArrowRight className="mr-2 h-4 w-4" />
              Mehr über University Ecom erfahren
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
