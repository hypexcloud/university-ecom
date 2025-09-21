import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, ArrowRight, Mail, Calendar, Users } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vielen Dank! - University Ecom',
  description: 'Ihr Vorab-Fragebogen wurde erfolgreich übermittelt. Wir melden uns bald bei Ihnen.',
}

export default function IntakeSuccessPage() {
  return (
    <div className="container mx-auto px-6 py-12 space-y-12">
      {/* Success Header */}
      <div className="text-center space-y-6">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold">
          Vielen Dank!
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Ihr Vorab-Fragebogen wurde erfolgreich übermittelt. Unser Team wird Ihre Antworten 
          prüfen und sich innerhalb von 24 Stunden bei Ihnen melden.
        </p>
      </div>

      {/* Next Steps */}
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-center">Was passiert als Nächstes?</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold">1</span>
              </div>
              <CardTitle className="text-lg">Prüfung Ihrer Antworten</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Unser Expertenteam analysiert Ihre Angaben und erstellt eine 
                maßgeschneiderte Empfehlung für Sie.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold">2</span>
              </div>
              <CardTitle className="text-lg">Persönliche Kontaktaufnahme</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Wir kontaktieren Sie per E-Mail mit einer detaillierten 
                Kursempfehlung und Ihren nächsten Schritten.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold">3</span>
              </div>
              <CardTitle className="text-lg">Beratungsgespräch (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Bei Interesse können wir ein kostenloses 15-minütiges 
                Beratungsgespräch vereinbaren.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Information */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bleiben Sie in Kontakt</CardTitle>
          <CardDescription>
            Haben Sie Fragen oder möchten Sie uns direkt kontaktieren?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">E-Mail</div>
                <div className="text-sm text-muted-foreground">support@university-ecom.com</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Antwortzeit</div>
                <div className="text-sm text-muted-foreground">Innerhalb von 24 Stunden</div>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <Button asChild>
              <Link href="/about">
                <Users className="mr-2 h-4 w-4" />
                Mehr über unser Team erfahren
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-bold">Können Sie es kaum erwarten?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Schauen Sie sich schon mal unsere Kurse an oder lesen Sie, was andere 
          Studenten über ihre Erfahrungen sagen.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/courses">
              Kurse ansehen
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/reviews">
              Bewertungen lesen
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center bg-primary/5 rounded-lg p-6">
        <p className="text-sm text-muted-foreground">
          <strong>Wichtiger Hinweis:</strong> Prüfen Sie auch Ihren Spam-Ordner, 
          falls Sie innerhalb von 24 Stunden keine E-Mail von uns erhalten haben.
        </p>
      </div>
    </div>
  )
}
