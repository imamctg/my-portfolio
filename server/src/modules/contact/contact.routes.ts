// src/modules/contact/contact.routes.ts

import express from 'express'
import {
  deleteContactMessage,
  getAllContactMessages,
  submitContactForm,
} from './contact.controller'
import authMiddleware from '../../middlewares/authMiddleware'
import { requireRole } from '../../middlewares/roleMiddleware'
import { rateLimiter } from '../../middlewares/rateLimiter.middleware'

const router = express.Router()

// ✅ Custom middleware: Check if token exists, then verify, else skip
const optionalAuth = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (token) {
    return authMiddleware(req, res, next) // ✅ সাইন ইন ইউজার
  }
  return next() // ✅ গেস্ট ইউজার
}

// ✅ এইভাবে ব্যবহার করুন
router.post('/', rateLimiter, optionalAuth, submitContactForm)

// ✅ Admin routes
router.get('/', optionalAuth, requireRole(['admin']), getAllContactMessages)
router.delete(
  '/:id',
  optionalAuth,
  requireRole(['admin']),
  deleteContactMessage
)

export default router
