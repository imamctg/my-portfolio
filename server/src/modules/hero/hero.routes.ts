import { Router } from 'express'
import { HeroController } from './hero.controller'
import authMiddleware from '../../middlewares/authMiddleware'
import { requireRole } from '../../middlewares/roleMiddleware'

const router = Router()

// Public
router.get('/', HeroController.getByLocale) // ?locale=en
router.get('/all', HeroController.getAll)

// Admin protected
router.post(
  '/',
  authMiddleware,
  requireRole(['admin']),
  HeroController.createOrUpdate
)
router.delete(
  '/',
  authMiddleware,
  requireRole(['admin']),
  HeroController.removeByLocale
) // ?locale=en

export default router
