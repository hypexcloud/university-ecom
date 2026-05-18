'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="de">
      <body className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4 p-8">
          <h2 className="text-2xl font-bold">Etwas ist schiefgelaufen</h2>
          <p className="text-gray-600">Ein unerwarteter Fehler ist aufgetreten.</p>
          <Button onClick={reset}>Erneut versuchen</Button>
        </div>
      </body>
    </html>
  )
}
