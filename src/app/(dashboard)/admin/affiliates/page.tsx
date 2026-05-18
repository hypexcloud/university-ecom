'use client'

import AdminAffiliateManagement from '@/components/AdminAffiliateManagement'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users } from 'lucide-react'
import Link from 'next/link'

export default function AdminAffiliatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8" />
            Affiliate Verwaltung
          </h1>
          <p className="text-gray-600 mt-2">
            Verwalten Sie Affiliates, Bewerbungen und Provisionen
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück
          </Link>
        </Button>
      </div>

      <AdminAffiliateManagement />
    </div>
  )
}
