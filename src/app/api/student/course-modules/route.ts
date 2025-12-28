import { NextRequest, NextResponse } from 'next/server'
import { getCourseModules } from '@/lib/course-utils'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const courseType = searchParams.get('courseType') as 'ai' | 'dropshipping'

    if (!courseType) {
      return NextResponse.json(
        { error: 'Course type is required' },
        { status: 400 }
      )
    }

    const modules = await getCourseModules(courseType)

    return NextResponse.json({ modules })
  } catch (error: any) {
    console.error('Error getting course modules:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
