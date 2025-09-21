import RegisterForm from './register-form'
import { UserPlus } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Registrieren - University Ecom',
  description: 'Erstellen Sie Ihr University Ecom Konto und erhalten Sie Zugang zu professionellen Kursen.',
}

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-md">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <UserPlus className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Konto erstellen</h1>
            <p className="text-muted-foreground">
              Beginnen Sie Ihre Reise zum Erfolg
            </p>
          </div>
        </div>

        {/* Register Form */}
        <RegisterForm />
      </div>
    </div>
  )
}
