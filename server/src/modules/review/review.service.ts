import { ReviewModel } from './review.model'

export const createReview = async (reviewData: {
  student: string
  instructor: string
  course: string
  rating: number
  comment: string
}) => {
  return await ReviewModel.create(reviewData)
}

export const getCourseReviews = async (courseId: string) => {
  return await ReviewModel.find({ course: courseId })
    .populate('student', 'name') // show only student name
    .sort({ createdAt: -1 })
}

export const getInstructorReviews = async (instructorId: string) => {
  return ReviewModel.find({ instructor: instructorId })
    .populate('student', 'name')
    .populate('course', 'title')
    .sort({ createdAt: -1 })
    .lean()
}

export const getHomepageReviews = async () => {
  return ReviewModel.find()
    .limit(6)
    .sort({ createdAt: -1 })
    .populate('student', 'name profileImage') // ✅ profileImage add করা হয়েছে
    .populate('course', 'title')
    .lean()
}
