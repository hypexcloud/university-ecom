'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="dashboard-shell min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">Etwas ist schiefgelaufen</h1>
        <p className="text-gray-500">Ein unerwarteter Fehler ist aufgetreten.</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} variant="outline">Erneut versuchen</Button>
          <Button asChild><Link href="/student/support">Support kontaktieren</Link></Button>
        </div>
      </div>
    </div>
  )
}
