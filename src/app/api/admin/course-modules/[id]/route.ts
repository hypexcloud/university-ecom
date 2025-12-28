import { NextRequest, NextResponse } from 'next/server'
import { updateCourseModule, deleteCourseModule } from '@/lib/course-utils'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const moduleId = params.id

    await updateCourseModule(moduleId, body)

    return NextResponse.json({
      success: true,
      message: 'Module updated',
    })
  } catch (error: any) {
    console.error('Error updating course module:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const moduleId = params.id

    await deleteCourseModule(moduleId)

    return NextResponse.json({
      success: true,
      message: 'Module deleted',
    })
  } catch (error: any) {
    console.error('Error deleting course module:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
