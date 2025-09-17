import { Router } from 'express'
import { ProjectController } from './project.controller'
import authMiddleware from '../../middlewares/authMiddleware'
import { requireRole } from '../../middlewares/roleMiddleware'
import upload from '../../middlewares/upload'

const router = Router()

// Public
router.get('/', ProjectController.getAll)
router.get('/featured', ProjectController.getFeatured)

// Protected (only admin can manage projects)
router.post(
  '/',
  authMiddleware,
  requireRole(['admin']),
  upload.single('thumbnail'), // ✅ ফাইল আপলোডের জন্য
  ProjectController.create
)

// Slug based public route
router.get('/:slug', ProjectController.getBySlug)

router.get('/:id', ProjectController.getSingle)

router.put(
  '/:id',
  authMiddleware,
  requireRole(['admin']),
  upload.single('thumbnail'), // ✅ আপডেটেও ফাইল লাগতে পারে
  ProjectController.update
)

router.delete(
  '/:id',
  authMiddleware,
  requireRole(['admin']),
  ProjectController.remove
)

export default router
