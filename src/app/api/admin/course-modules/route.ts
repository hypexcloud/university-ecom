import { NextRequest, NextResponse } from 'next/server'
import { getCourseModules, createCourseModule, updateCourseModule, deleteCourseModule } from '@/lib/course-utils'

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      courseType,
      week,
      title,
      description,
      objectives,
      duration,
      order,
      hasSession,
      sessionRequired,
      requiresPreviousModule,
      status,
    } = body

    if (!courseType || !title || !week) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // TODO: Add admin authentication check
    const createdBy = 'admin' // Get from session

    const moduleId = await createCourseModule({
      courseId: `${courseType}-course`, // You can customize this
      courseType,
      week,
      title,
      description: description || '',
      objectives: objectives || [],
      duration: duration || '',
      order: order || week,
      hasSession: hasSession || false,
      sessionRequired: sessionRequired || false,
      requiresPreviousModule: requiresPreviousModule !== false,
      status: status || 'draft',
      createdBy,
    })

    return NextResponse.json({
      success: true,
      moduleId,
    })
  } catch (error: any) {
    console.error('Error creating course module:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
