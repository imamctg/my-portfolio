import express from 'express'
import { send } from 'process'
import { getAdminStats } from './admin.controller'

const router = express.Router()

// GET /api/admin/stats
router.get('/stats', getAdminStats)

export default router
