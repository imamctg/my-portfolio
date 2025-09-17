import express from 'express'
import { EarningsService } from './earnings.service'
// import { auth } from '../../middlewares/auth'
// import { UserRole } from '../user/user.model'
import authMiddleware from '../../middlewares/authMiddleware'
import { requireRole } from '../../middlewares/roleMiddleware'
import { Earnings } from './earnings.model'

const router = express.Router()

router.get(
  '/instructor',
  authMiddleware,
  requireRole(['instructor']),
  async (req, res) => {
    console.log('req.user._id', req.user._id)
    try {
      const result = await EarningsService.getInstructorEarnings(req.user._id)
      res.json(
        result[0] || {
          totalEarnings: 0,
          pendingEarnings: 0,
          paidEarnings: 0,
        }
      )
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
)

router.get(
  '/instructor-bonus',
  authMiddleware,
  requireRole(['instructor']),
  async (req, res) => {
    try {
      const earnings = await Earnings.find({ instructorId: req.user._id })
      const totalWeeklyBonus = earnings.reduce(
        (sum, e) => sum + (e.weeklyCampaignBonus || 0),
        0
      )
      const monthlyBonusApplied = earnings.some((e) => e.bonusApplied)

      res.json({
        totalWeeklyBonus,
        monthlyBonusApplied,
      })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
)

router.get(
  '/admin',
  authMiddleware,
  requireRole(['admin']),
  async (req, res) => {
    try {
      const result = await EarningsService.getAdminRevenue()
      res.json(
        result[0] || {
          totalRevenue: 0,
          platformEarnings: 0,
          pendingRevenue: 0,
          chartData: [], // Add chart data structure
          paymentHistory: [], // Add payment history
        }
      )
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
)

export const EarningsRoutes = router
