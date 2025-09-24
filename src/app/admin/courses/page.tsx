'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CoursesPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/admin/termine')
  }, [router])

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <p className="text-gray-600">Weiterleitung zur neuen Termine-Seite...</p>
      </div>
    </div>
  )
}
