import { Router } from 'express'
import { TestimonialController } from './testimonial.controller'
import authMiddleware from '../../middlewares/authMiddleware'
import { requireRole } from '../../middlewares/roleMiddleware'
import upload from '../../middlewares/upload'

const router = Router()

// Public (anyone can see testimonials)
router.get('/', TestimonialController.getAll)

// Protected (only admin can create/delete testimonial)
router.post(
  '/',
  authMiddleware,
  requireRole(['admin']),
  upload.single('profileImage'), // ✅ ফাইল আপলোডের জন্য
  TestimonialController.create
)

router.delete(
  '/:id',
  authMiddleware,
  requireRole(['admin']),
  TestimonialController.remove
)

export default router
