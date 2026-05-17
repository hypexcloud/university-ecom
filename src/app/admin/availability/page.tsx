'use client'

import { useAuth } from '@/contexts/AuthContext'
import AvailabilityManager from '@/components/AvailabilityManager'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AvailabilityPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/admin">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück zum Dashboard
        </Link>
      </Button>

      <AvailabilityManager coachId={user?.id || ''} />
    </div>
  )
}
