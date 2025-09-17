// import { Router } from 'express'
// import * as quizCtrl from './quiz.controller'
// import authMiddleware from '../../middlewares/authMiddleware'
// import { rateLimiter } from '../../middlewares/rateLimiter.middleware'

// const router = Router({ mergeParams: true })

// router.use(authMiddleware)

// router.get('/course/:courseId', quizCtrl.getCourseQuizzes)
// router.get('/:quizId', quizCtrl.getQuizDetails)

// // Lecture Quiz Routes
// router.put('/:quizId', quizCtrl.updateQuiz)
// router.delete('/:quizId', quizCtrl.deleteQuiz)

// router.post('/lectures/:lectureId', quizCtrl.createQuiz)
// router.get('/lectures/:lectureId', quizCtrl.getQuiz)
// // router.put('/lectures/:lectureId', quizCtrl.updateQuiz)
// // router.delete('/lectures/:lectureId', quizCtrl.deleteQuiz)

// // Section Quiz Routes
// router.post('/sections/:sectionId', quizCtrl.createQuiz)
// router.get('/sections/:sectionId', quizCtrl.getQuiz)
// // router.put('/sections/:sectionId', quizCtrl.updateQuiz)
// // router.delete('/sections/:sectionId', quizCtrl.deleteQuiz)

// router.get('/student/:quizId', authMiddleware, quizCtrl.getStudentQuiz)

// router.post('/submit/:quizId', rateLimiter, authMiddleware, quizCtrl.submitQuiz)

// router.get('/results/:courseId', authMiddleware, quizCtrl.getQuizResults)

// export default router

// src/modules/quiz/quiz.routes.ts

import { Router } from 'express'
import * as quizCtrl from './quiz.controller'
import authMiddleware from '../../middlewares/authMiddleware'
import { rateLimiter } from '../../middlewares/rateLimiter.middleware'

const router = Router({ mergeParams: true })

// ✅ All routes require authentication
router.use(authMiddleware)

/**
 * ────────────── QUIZ FETCH ──────────────
 */

// Get all quizzes for a course
router.get('/course/:courseId', quizCtrl.getCourseQuizzes)

// Get quiz details (by quizId)
router.get('/:quizId', quizCtrl.getQuizDetails)

// Get student-specific quiz (with answers)
router.get('/student/:quizId', quizCtrl.getStudentQuiz)

/**
 * ────────────── QUIZ CRUD ──────────────
 */

// Create quiz for a lecture
router.post('/lectures/:lectureId', quizCtrl.createQuiz)
router.get('/lectures/:lectureId', quizCtrl.getQuiz) // Fetch lecture quiz

// Create quiz for a section
router.post('/sections/:sectionId', quizCtrl.createQuiz)
router.get('/sections/:sectionId', quizCtrl.getQuiz) // Fetch section quiz

// Update/Delete quiz (by quizId)
router.put('/:quizId', quizCtrl.updateQuiz)
router.delete('/:quizId', quizCtrl.deleteQuiz)

/**
 * ────────────── QUIZ SUBMISSION ──────────────
 */

// Submit quiz by student
router.post('/submit/:quizId', rateLimiter, authMiddleware, quizCtrl.submitQuiz)

/**
 * ────────────── QUIZ RESULT ──────────────
 */

// Get all quiz results for a course
router.get('/results/:courseId', quizCtrl.getQuizResults)

export default router
