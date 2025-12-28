import { NextRequest, NextResponse } from 'next/server'
import { getModuleResources } from '@/lib/course-utils'

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
