// src/routes/reviews.routes.ts

import express from 'express'
import authMiddleware from '../../middlewares/authMiddleware'
import {
  fetchHomepageReviews,
  fetchInstructorReviews,
  getReviewsByCourse,
  submitReview,
} from './review.controller'
import { rateLimiter } from '../../middlewares/rateLimiter.middleware'

const router = express.Router()

// POST /api/reviews
router.post('/submit', authMiddleware, submitReview)

router.get('/homepage-reviews', fetchHomepageReviews)
router.get('/instructor', authMiddleware, fetchInstructorReviews)
// GET /api/reviews/:courseId
router.get('/:courseId', getReviewsByCourse)

export default router
