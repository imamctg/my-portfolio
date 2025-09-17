import { Router } from 'express'
import { BlogController } from './blog.controller'
import authMiddleware from '../../middlewares/authMiddleware'
import { requireRole } from '../../middlewares/roleMiddleware'
import upload from '../../middlewares/upload'

const router = Router()

// ---------------- BLOG ROUTES ----------------

// Public
router.get('/', BlogController.getAll) // সব ব্লগ
router.get('/:slug', BlogController.getBySlug) // slug দিয়ে single blog

// Admin (protected)
router.post(
  '/',
  authMiddleware,
  requireRole(['admin']),
  upload.single('image'), // ✅ এখানে যুক্ত করতে হবে
  BlogController.create
)

router.put(
  '/:id',
  authMiddleware,
  requireRole(['admin']),
  upload.single('image'), // ✅ update এও ফাইল লাগতে পারে
  BlogController.update
)

router.delete(
  '/:id',
  authMiddleware,
  requireRole(['admin']),
  BlogController.remove
)

// ---------------- CATEGORY ROUTES ----------------

// Public
router.get('/categories/all', BlogController.getCategories) // সব ক্যাটাগরি

// Admin (protected)
router.post(
  '/categories',
  authMiddleware,
  requireRole(['admin']),
  BlogController.createCategory
)
router.delete(
  '/categories/:id',
  authMiddleware,
  requireRole(['admin']),
  BlogController.deleteCategory
)

export default router
