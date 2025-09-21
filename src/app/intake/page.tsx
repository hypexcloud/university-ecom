import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { IntakeForm } from '@/components/forms/intake-form'
import { ClipboardList, Shield, Clock, Users } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vorab-Fragebogen - University Ecom',
  description: 'Erzählen Sie uns von Ihren Zielen und Erfahrungen, damit wir Ihnen die beste Beratung bieten können.',
}

export default function IntakePage() {
  return (
    <div className="container mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <ClipboardList className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold">
          Vorab-Fragebogen
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Bevor wir Ihnen das perfekte Angebot machen können, möchten wir Sie besser kennenlernen. 
          Dieser Fragebogen hilft uns dabei, die richtige Empfehlung für Sie zu finden.
        </p>
      </div>

      {/* Benefits */}
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
            <CardTitle className="text-lg">Datenschutz</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ihre Daten werden vertraulich behandelt und nur für die Beratung verwendet.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
            <CardTitle className="text-lg">Nur 5 Minuten</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Der Fragebogen dauert nur wenige Minuten und kann jederzeit unterbrochen werden.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <CardTitle className="text-lg">Persönliche Beratung</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Basierend auf Ihren Antworten erhalten Sie eine maßgeschneiderte Empfehlung.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Form */}
      <IntakeForm />

      {/* Footer Note */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Haben Sie Fragen? Kontaktieren Sie uns unter{' '}
          <a href="mailto:support@university-ecom.com" className="text-primary hover:underline">
            support@university-ecom.com
          </a>
        </p>
      </div>
    </div>
  )
}
