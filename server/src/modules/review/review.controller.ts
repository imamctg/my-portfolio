import { Request, Response } from 'express'
import * as reviewService from './review.service'
import { PopulatedReview } from './review.model'
import Course from '../course/course.model'

export const submitReview = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { courseId, rating, comment } = req.body
    const studentId = req.user._id

    if (!courseId || !rating || !comment) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // ✅ কোর্স থেকে instructor বের করি
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }

    const existing = await reviewService.getCourseReviews(courseId)
    const alreadySubmitted = existing.some(
      (r: any) => r.student._id.toString() === studentId.toString()
    )
    if (alreadySubmitted) {
      return res
        .status(400)
        .json({ message: 'You already submitted a review for this course' })
    }

    const review = await reviewService.createReview({
      student: studentId,
      instructor: course.instructor, // ✅ instructor যোগ করা হয়েছে
      course: courseId,
      rating,
      comment,
    })

    res.status(201).json({ success: true, review })
  } catch (err) {
    console.error('Review submit error:', err)
    res.status(500).json({ message: 'Failed to submit review' })
  }
}

export const getReviewsByCourse = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId
    const reviews = await reviewService.getCourseReviews(courseId)
    res.json({ reviews })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch reviews' })
  }
}

export const fetchInstructorReviews = async (req: Request, res: Response) => {
  try {
    const reviews = (await reviewService.getInstructorReviews(
      req.user._id
    )) as unknown as PopulatedReview[]

    const formatted = reviews.map((r) => ({
      _id: r._id.toString(),
      studentName: r.student.name,
      rating: r.rating,
      comment: r.comment,
      courseTitle: r.course.title,
      createdAt: r.createdAt,
    }))

    res.json(formatted)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch reviews' })
  }
}

export const fetchHomepageReviews = async (req: Request, res: Response) => {
  try {
    const reviews =
      (await reviewService.getHomepageReviews()) as unknown as PopulatedReview[]

    const formatted = reviews.map((r) => ({
      _id: r._id.toString(),
      studentName: r.student.name,
      rating: r.rating,
      comment: r.comment,
      profileImage: r.student.profileImage || '/users/default.jpg', // ✅ add real image
    }))

    res.json(formatted)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch homepage reviews' })
  }
}
