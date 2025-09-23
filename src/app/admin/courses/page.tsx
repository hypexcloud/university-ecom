'use client'

import { useState } from 'react'
import AdminCourseManagement from '@/components/AdminCourseManagement'

export default function AdminCoursePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <AdminCourseManagement 
          userRole="admin" 
          userId="admin1" 
        />
      </div>
    </div>
  )
}
