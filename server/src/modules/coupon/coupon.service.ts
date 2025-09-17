import Course from '../course/course.model'
import { Order } from '../order/order.model'
import { CouponModel } from './coupon.model'
import mongoose from 'mongoose'

export const createCoupon = async (data: {
  code: string
  discount: number
  expiresAt: string
  instructorId: string
  discountType?: 'flat' | 'percentage'
  applicableCourses?: string[]
}) => {
  const {
    code,
    discount,
    expiresAt,
    instructorId,
    discountType,
    applicableCourses,
  } = data

  const existing = await CouponModel.findOne({ code })
  if (existing) throw new Error('Coupon code already exists')

  const coupon = new CouponModel({
    code,
    discount,
    expiresAt,
    instructor: new mongoose.Types.ObjectId(instructorId),
    discountType,
    applicableCourses,
  })

  return await coupon.save()
}

export const getAllCouponsByInstructor = async (instructorId: string) => {
  return await CouponModel.find({ instructor: instructorId }).sort({
    createdAt: -1,
  })
}

export const deleteCoupon = async (id: string, instructorId: string) => {
  const deleted = await CouponModel.findOneAndDelete({
    _id: id,
    instructor: instructorId,
  })
  if (!deleted) throw new Error('Coupon not found or unauthorized')
  return deleted
}

export const applyCouponService = async (
  code: string,
  courseId: string,
  userId: string
) => {
  const coupon = await CouponModel.findOne({ code })
  if (!coupon) {
    throw new Error('Invalid coupon code')
  }

  if (coupon.expired || coupon.expiresAt < new Date()) {
    throw new Error('Coupon expired')
  }

  if (
    coupon.applicableCourses?.length &&
    !coupon.applicableCourses.some(
      (id) => id.toString() === courseId.toString()
    )
  ) {
    throw new Error('Not valid for this course')
  }

  const alreadyUsed = await Order.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    couponCode: code,
    courseId: new mongoose.Types.ObjectId(courseId),
    status: { $in: ['paid', 'pending'] },
  })

  if (alreadyUsed) {
    throw new Error('Already used this coupon')
  }

  // ✅ Now get the course price to calculate discount
  const course = await Course.findById(courseId)
  if (!course) {
    throw new Error('Course not found')
  }

  let discountAmount = 0

  if (coupon.discountType === 'percentage') {
    discountAmount = (course.price * coupon.discount) / 100
  } else {
    discountAmount = coupon.discount
  }

  return {
    discountAmount,
    finalPrice: course.price - discountAmount,
    discountType: coupon.discountType,
    originalPrice: course.price,
  }
}
