import { Router } from 'express'
import { CtaController } from './cta.controller'
import authMiddleware from '../../middlewares/authMiddleware'
import { requireRole } from '../../middlewares/roleMiddleware'

const router = Router()

// Public
router.get('/', CtaController.getByLocale) // ?locale=en
router.get('/all', CtaController.getAll)

// Admin protected
router.post(
  '/',
  authMiddleware,
  requireRole(['admin']),
  CtaController.createOrUpdate
)
router.delete(
  '/',
  authMiddleware,
  requireRole(['admin']),
  CtaController.removeByLocale
) // ?locale=en

export default router
