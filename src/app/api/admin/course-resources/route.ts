import { NextRequest, NextResponse } from 'next/server'
import { getModuleResources, createCourseResource } from '@/lib/course-utils'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const moduleId = searchParams.get('moduleId')

    if (!moduleId) {
      return NextResponse.json(
        { error: 'Module ID is required' },
        { status: 400 }
      )
    }

    const resources = await getModuleResources(moduleId)

    return NextResponse.json({ resources })
  } catch (error: any) {
    console.error('Error getting module resources:', error)
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
      moduleId,
      title,
      description,
      type,
      url,
      videoProvider,
      duration,
      isRequired,
      estimatedTime,
      order,
    } = body

    if (!moduleId || !title || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const resourceId = await createCourseResource({
      moduleId,
      title,
      description,
      type,
      url,
      videoProvider,
      duration,
      isRequired: isRequired !== false,
      estimatedTime,
      order: order || 1,
    })

    return NextResponse.json({
      success: true,
      resourceId,
    })
  } catch (error: any) {
    console.error('Error creating course resource:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
