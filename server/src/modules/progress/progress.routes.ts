import express from 'express'
import { getCourseProgress } from './progress.controller'
import authMiddleware from '../../middlewares/authMiddleware'

const router = express.Router()

// ⛳️ Cleaner route without userId in the URL
router.get('/courses/progress', authMiddleware, getCourseProgress)

export default router
