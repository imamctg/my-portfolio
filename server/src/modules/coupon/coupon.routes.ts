import express from 'express'
import {
  createCoupon,
  getCoupons,
  deleteCoupon,
  applyCouponController,
} from './coupon.controller'
import { requireRole } from '../../middlewares/roleMiddleware'
import authMiddleware from '../../middlewares/authMiddleware'

const router = express.Router()

// ✅ First authenticate the user and decode token
router.use(authMiddleware)
router.post('/apply', applyCouponController)
// All routes below are protected for instructors
router.use(requireRole(['instructor']))
router.post('/', createCoupon) // POST /api/coupon
router.get('/', getCoupons) // GET  /api/coupon

router.delete('/:id', deleteCoupon) // DELETE /api/coupon/:id

export default router
