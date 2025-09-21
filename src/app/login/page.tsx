import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LogIn, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-md">
      <div className="text-center space-y-6 mb-12">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <LogIn className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold">Anmelden</h1>
        <p className="text-xl text-muted-foreground">
          Willkommen zurück bei University Ecom
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>🚧 In Entwicklung</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Die Authentifizierung wird in Phase 1 / Step 3 implementiert mit:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground mb-6">
            <li>• Firebase Authentication</li>
            <li>• Email/Password Login</li>
            <li>• Google OAuth</li>
            <li>• Passwort-Reset</li>
            <li>• Protected Routes</li>
          </ul>
          <Button asChild className="w-full">
            <Link href="/courses">
              <ArrowRight className="mr-2 h-4 w-4" />
              Kurse ohne Anmeldung ansehen
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
