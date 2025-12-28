'use client'

import CourseContentManagement from '@/components/CourseContentManagement'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function AdminCoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BookOpen className="h-8 w-8" />
            Kursinhalte
          </h1>
          <p className="text-gray-600 mt-2">
            Verwalten Sie Module, Lektionen und Lernressourcen
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück
          </Link>
        </Button>
      </div>

      <CourseContentManagement />
    </div>
  )
}
