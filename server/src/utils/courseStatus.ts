import { CourseStatus } from '../modules/course/course.model'

// utils/courseStatus.ts
export const canChangeStatus = (
  currentStatus: CourseStatus,
  newStatus: CourseStatus,
  userRole: 'instructor' | 'admin'
): boolean => {
  const transitions: Record<CourseStatus, CourseStatus[]> = {
    draft: ['under_review', 'archived'],
    under_review: ['approved', 'rejected', 'changes_requested', 'draft'], // admin only
    approved: ['published', 'draft'],
    published: ['archived', 'draft'],
    changes_requested: ['under_review', 'draft'],
    rejected: ['draft', 'under_review'],
    archived: ['draft'],
  }

  return userRole === 'admin'
    ? transitions[currentStatus].includes(newStatus)
    : transitions[currentStatus].includes(newStatus) &&
        ['draft', 'under_review'].includes(newStatus)
}
