// server/src/modules/skill/skill.routes.ts
import { Router } from 'express'
import { SkillController } from './skill.controller'
import authMiddleware from '../../middlewares/authMiddleware'
import { requireRole } from '../../middlewares/roleMiddleware'

const router = Router()

router.get('/', SkillController.getByLocale)
router.post('/', authMiddleware, requireRole(['admin']), SkillController.create)

router.get('/:id', SkillController.getOne)

router.put(
  '/:id',
  authMiddleware,
  requireRole(['admin']),
  SkillController.update
)
router.delete(
  '/:id',
  authMiddleware,
  requireRole(['admin']),
  SkillController.remove
)

export default router
