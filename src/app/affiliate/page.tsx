'use client'

import { useAuth } from '@/contexts/AuthContext'
import AffiliateDashboard from '@/components/AffiliateDashboard'
import { Button } from '@/components/ui/button'
import { ArrowLeft, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function AffiliatePage() {
  const { user } = useAuth()

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück
          </Link>
        </Button>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <TrendingUp className="h-8 w-8" />
          Affiliate Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Verwalten Sie Ihre Empfehlungen und Provisionen
        </p>
      </div>

      <AffiliateDashboard userId={user?.uid || ''} />
    </div>
  )
}
