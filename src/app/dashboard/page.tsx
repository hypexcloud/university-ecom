'use client'

import { useState } from 'react'
import StudentCourseContent from '@/components/StudentCourseContent'
import { CourseType } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BookOpenIcon,
  CalendarIcon,
  TrendingUpIcon,
  PlayIcon,
  CheckCircleIcon,
  ClockIcon,
  ExternalLinkIcon
} from 'lucide-react'

export default function StudentDashboard() {
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null)

  // Mock user data - replace with actual authentication
  const mockUser = {
    id: 'student1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    enrollments: [
      {
        id: 'enrollment1',
        courseType: 'ai' as CourseType,
        planType: 'pro',
        startDate: new Date(2024, 11, 1),
        progress: 60,
        nextSession: new Date(2025, 0, 22, 14, 0),
        instructor: 'Dr. Sarah Wilson'
      }
    ]
  }

  // Quick stats for the overview
  const getQuickStats = () => {
    const enrollment = mockUser.enrollments[0]
    return {
      progress: enrollment.progress,
      nextSession: enrollment.nextSession,
      courseName: enrollment.courseType === 'ai' ? 'AI Mastery Course' : 'Dropshipping Success',
      instructor: enrollment.instructor,
      plan: enrollment.planType
    }
  }

  const stats = getQuickStats()

  if (selectedCourse) {
    const enrollment = mockUser.enrollments.find(e => e.courseType === selectedCourse)
    if (enrollment) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setSelectedCourse(null)}
              className="mb-4"
            >
              ← Back to Dashboard
            </Button>
          </div>
          <StudentCourseContent
            userRole="student"
            userId={mockUser.id}
            courseType={selectedCourse}
            enrollmentId={enrollment.id}
          />
        </div>
      )
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {mockUser.name}!</h1>
        <p className="text-gray-600 mt-1">
          Continue your learning journey and track your progress
        </p>
      </div>

      {/* Quick Overview */}
      <div className="grid gap-6 mb-8">
        {/* Main Course Card */}
        <Card className="col-span-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl mb-2">Your Active Course</CardTitle>
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-blue-600">
                    {stats.courseName}
                  </h2>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {stats.plan.toUpperCase()} Plan
                  </Badge>
                </div>
                <p className="text-gray-600 mt-1">
                  Instructor: {stats.instructor}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">{stats.progress}%</p>
                    <p className="text-sm text-gray-500">Complete</p>
                  </div>
                  <div className="w-20 h-20 relative">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 64 64">
                      <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="4" fill="none" />
                      <circle 
                        cx="32" 
                        cy="32" 
                        r="28" 
                        stroke="#10b981" 
                        strokeWidth="4" 
                        fill="none"
                        strokeDasharray={`${stats.progress * 1.76} 176`}
                        className="transition-all duration-300"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {/* Next Session */}
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <CalendarIcon className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium">Next Session</p>
                  <p className="text-sm text-gray-600">
                    {stats.nextSession.toLocaleDateString()} at {stats.nextSession.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                  <Button size="sm" className="mt-2">
                    <ExternalLinkIcon className="h-3 w-3 mr-1" />
                    Join Session
                  </Button>
                </div>
              </div>

              {/* Current Module */}
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <BookOpenIcon className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-medium">Current Module</p>
                  <p className="text-sm text-gray-600">Week 3: Deep Learning Foundations</p>
                  <Button size="sm" variant="outline" className="mt-2" onClick={() => setSelectedCourse('ai')}>
                    Continue Learning
                  </Button>
                </div>
              </div>

              {/* This Week */}
              <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
                <ClockIcon className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="font-medium">This Week's Goal</p>
                  <p className="text-sm text-gray-600">Complete Neural Networks module</p>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">70%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Access */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedCourse('ai')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpenIcon className="h-5 w-5 text-blue-600" />
              </div>
              AI Mastery Course
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-medium">{stats.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${stats.progress}%` }}></div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">2 modules completed</span>
                </div>
                <Button size="sm">
                  Enter Course
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Placeholder for additional course */}
        <Card className="opacity-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <BookOpenIcon className="h-5 w-5 text-gray-400" />
              </div>
              Additional Course
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                Unlock additional courses as you progress through your current studies.
              </p>
              <Button size="sm" variant="outline" disabled>
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUpIcon className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Completed: Machine Learning Basics</p>
                  <p className="text-xs text-gray-500">Week 2 • 3 days ago</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">Completed</Badge>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <PlayIcon className="h-5 w-5 text-blue-500" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Started: Deep Learning Foundations</p>
                  <p className="text-xs text-gray-500">Week 3 • Yesterday</p>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">In Progress</Badge>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-yellow-500" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Upcoming Session with Dr. Sarah Wilson</p>
                  <p className="text-xs text-gray-500">Jan 22, 2025 at 2:00 PM</p>
                </div>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Scheduled</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
