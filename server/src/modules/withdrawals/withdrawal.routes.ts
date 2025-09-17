import express from 'express'
import {
  requestWithdrawal,
  updateWithdrawStatus,
} from './withdrawal.controller'
import * as withdrawalController from './withdrawal.controller'
// import { authMiddleware } from '../../middlewares/authMiddleware'

import authMiddleware from '../../middlewares/authMiddleware'
import { requireRole } from '../../middlewares/roleMiddleware'

const router = express.Router()

router.use(authMiddleware)

// কমন রাউটস
// router.get('/', getWithdrawals)
// router.get('/stats', getWithdrawalStats)

// ইউজার রাউটস
router.post('/request', requestWithdrawal)

// এডমিন রাউটস
// router.put('/:id/process', processWithdrawal)

// GET all withdrawals, optional filter by ?status=
router.get('/', withdrawalController.getWithdrawals)

// PUT update withdrawal status
router.put('/:id/status', withdrawalController.updateStatus)

// ✅ Admin updates withdrawal status
router.get('/', authMiddleware, requestWithdrawal)
router.put(
  '/:withdrawId/status',
  authMiddleware,
  requireRole(['admin']),
  updateWithdrawStatus
)

export default router
