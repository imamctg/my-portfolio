import { Request, Response } from 'express'
import * as couponService from './coupon.service'

export const createCoupon = async (req: Request, res: Response) => {
  try {
    const instructorId = req.user._id
    const { code, discount, expiresAt, discountType, applicableCourses } =
      req.body

    const coupon = await couponService.createCoupon({
      code,
      discount,
      expiresAt,
      instructorId,
      discountType,
      applicableCourses,
    })

    res.status(201).json(coupon)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
}

export const getCoupons = async (req: Request, res: Response) => {
  try {
    const instructorId = req.user._id
    const coupons = await couponService.getAllCouponsByInstructor(instructorId)
    res.json(coupons)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}

export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const instructorId = req.user._id
    const couponId = req.params.id

    await couponService.deleteCoupon(couponId, instructorId)
    res.json({ message: 'Coupon deleted' })
  } catch (err: any) {
    res.status(404).json({ error: err.message })
  }
}

export const applyCouponController = async (req: Request, res: Response) => {
  try {
    const { code, courseId, userId } = req.body
    const result = await couponService.applyCouponService(
      code,
      courseId,
      userId
    )
    res.json(result)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
