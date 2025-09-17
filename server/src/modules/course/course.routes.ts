import express from 'express'
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  getCourseById,
  getInstructorCourses,
  getInstructorCourseSections,
  getMyCourseStudents,
  getCoursesByStatus,
  getAdminNotes,
  submitCourseForReview,
  reviewCourse,
  publishCourse,
  archiveCourse,
  resubmitCourse,
  addSectionToCourse,
  updateSectionByIdController,
  deleteSection,
  addLectureToSection,
  getLectureById,
  updateLectureById,
  deleteLecture,
  markLectureAsCompleted,
} from './course.controller'

import { requireRole } from '../../middlewares/roleMiddleware'
import authMiddleware from '../../middlewares/authMiddleware'
import upload from '../../middlewares/upload'

const router = express.Router()

// 🔹 Course CRUD
router.post(
  '/',
  authMiddleware,
  requireRole(['admin', 'instructor']),
  upload.any(),
  createCourse
)

router.get('/', getAllCourses)
router.get('/:slug', getSingleCourse)
router.put(
  '/:courseId',
  authMiddleware,
  requireRole(['admin', 'instructor']),
  upload.single('thumbnail'),
  updateCourse
)
router.delete(
  '/:id',
  authMiddleware,
  requireRole(['admin', 'instructor']),
  deleteCourse
)

// 🔹 Instructor Specific Courses
router.get('/:instructorId/courses', authMiddleware, getInstructorCourses)
router.get(
  '/:courseId/students',
  authMiddleware,
  requireRole(['instructor']),
  getMyCourseStudents
)

// 🔹 Nested Course Details
router.get('/:slug/details', authMiddleware, getCourseById)

// 🔹 Section Management
router.post(
  '/:courseId/section',
  authMiddleware,
  requireRole(['admin', 'instructor']),
  addSectionToCourse
)

router.put(
  '/:courseId/sections/:sectionId',
  authMiddleware,
  requireRole(['admin', 'instructor']),
  upload.fields([{ name: 'resourceFile', maxCount: 1 }]),
  updateSectionByIdController
)

router.delete(
  '/sections/:sectionId',
  authMiddleware,
  requireRole(['admin', 'instructor']),
  deleteSection
)

router.get('/:courseId/sections', authMiddleware, getInstructorCourseSections)

// 🔹 Lecture Management
router.post(
  '/:courseId/sections/:sectionId/lectures',
  authMiddleware,
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'resourceFiles', maxCount: 10 },
  ]),
  addLectureToSection
)

router.get(
  '/:courseId/sections/:sectionId/lectures/:lectureId',
  authMiddleware,
  requireRole(['admin', 'instructor']),
  getLectureById
)

router.put(
  '/:courseId/sections/:sectionId/lectures/:lectureId',
  authMiddleware,
  requireRole(['admin', 'instructor']),
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'resourceFiles', maxCount: 10 },
  ]),
  updateLectureById
)

router.delete(
  '/lectures/:lectureId',
  authMiddleware,
  requireRole(['admin', 'instructor']),
  deleteLecture
)

router.put(
  '/lectures/:lectureId/complete',
  authMiddleware,
  markLectureAsCompleted
)

// 🔹 Status Management
router.post(
  '/:courseId/submit',
  authMiddleware,
  requireRole(['instructor']),
  submitCourseForReview
)

router.post(
  '/:courseId/review',
  authMiddleware,
  requireRole(['admin']),
  reviewCourse
)

router.post(
  '/:courseId/publish',
  authMiddleware,
  requireRole(['instructor']),
  publishCourse
)

router.post(
  '/:courseId/archive',
  authMiddleware,
  requireRole(['admin', 'instructor']),
  archiveCourse
)

router.post(
  '/:courseId/resubmit',
  authMiddleware,
  requireRole(['instructor']),
  resubmitCourse
)

router.get(
  '/status/:status',
  authMiddleware,
  requireRole(['admin']),
  getCoursesByStatus
)

// 🔹 Admin Notes
router.get(
  '/:courseId/admin-notes',
  authMiddleware,
  requireRole(['admin', 'instructor']),
  getAdminNotes
)

export default router
