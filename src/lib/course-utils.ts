/**
 * Course Content Utilities
 *
 * TODO: Rebuild properly when course content management is implemented.
 * Currently stubbed.
 */

export async function getStudentProgress(
  _userId: string,
  _enrollmentId: string,
): Promise<null> {
  return null
}

export async function initializeStudentProgress(
  _userId: string,
  _enrollmentId: string,
  _courseId: string,
  _courseType: string,
): Promise<string> {
  return 'stub-progress-id'
}

export async function getModuleResources(
  _moduleId: string,
): Promise<{ id: string; isRequired: boolean }[]> {
  return []
}

export async function completeResource(
  _progressId: string,
  _resourceId: string,
  _currentProgress: unknown,
): Promise<void> {
  // Handled via /api/student/complete-resource with Drizzle
}

export async function completeModule(
  _progressId: string,
  _moduleId: string,
  _currentProgress: unknown,
): Promise<void> {
  // Handled via module_progress table
}

export async function updateVideoProgress(
  _progressId: string,
  _resourceId: string,
  _watchedSeconds: number,
  _totalSeconds: number,
  _currentProgress: unknown,
): Promise<void> {
  // Handled via /api/student/video-progress with Drizzle
}

export async function submitQuizAttempt(
  _quizId: string,
  _userId: string,
  _enrollmentId: string,
  _answers: unknown[],
  _timeSpent: number,
): Promise<{ score: number; maxScore: number; passed: boolean; submittedAt: Date }> {
  return { score: 0, maxScore: 0, passed: false, submittedAt: new Date() }
}

// Legacy exports for backward compatibility
export async function getCourseModules(_courseId: string) { return [] }
export async function createCourseModule(_data: unknown) { return { id: 'stub' } }
export async function updateCourseModule(_id: string, _data: unknown) { return }
export async function deleteCourseModule(_id: string) { return }
export async function createCourseResource(_data: unknown) { return { id: 'stub' } }
