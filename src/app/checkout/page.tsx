import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="text-center space-y-6 mb-12">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <ShoppingCart className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold">Checkout</h1>
        <p className="text-xl text-muted-foreground">
          Vervollständigen Sie Ihren Kauf und starten Sie Ihre Reise
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>🚧 In Entwicklung</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Die Checkout-Seite wird in Phase 1 / Step 5 implementiert mit:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground mb-6">
            <li>• Intake-Formular vor der Zahlung</li>
            <li>• Stripe Checkout für Kreditkarten</li>
            <li>• PayPal Smart Buttons</li>
            <li>• Coinbase Commerce für Kryptowährungen</li>
            <li>• EU-VAT Compliance</li>
          </ul>
          <Button asChild>
            <Link href="/courses">
              <ArrowRight className="mr-2 h-4 w-4" />
              Zurück zu den Kursen
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
