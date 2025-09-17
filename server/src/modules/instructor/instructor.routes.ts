import express from 'express'
import authMiddleware from '../../middlewares/authMiddleware'
import * as instructorController from './instructor.controller'

const router = express.Router()

// সব instructor রাউটের জন্য authentication লাগবে
router.use(authMiddleware)

// GET instructor withdraw stats
router.get('/stats', instructorController.getWithdrawStats)

// GET instructor earnings + withdraw history
router.get('/earnings', instructorController.getEarnings)

// POST instructor withdraw request
router.post('/withdraw', instructorController.requestWithdraw)

export default router
