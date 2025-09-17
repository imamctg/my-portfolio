// paymentSuccess.controller.ts
import { Order } from '../order/order.model'
import Course from '../course/course.model'
import User from '../user/user.model'
import { Request, Response } from 'express'
import { OrderService } from '../order/order.service'
import { Types } from 'mongoose'
import { ReferralTracking } from '../referral/referral-tracking.model'
import { ReferralService } from '../referral/referral.service'

export const paymentSuccess = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { tran_id, userId, courseId, orderId } = req.query
    console.log('paymentSuccess:', { tran_id, userId, courseId, orderId })

    if (!tran_id || !userId || !courseId) {
      return res.status(400).json({ message: 'Missing parameters' })
    }

    // 1. Update order status and create earnings record
    const updatedOrder = await OrderService.handleSuccessfulPayment(
      new Types.ObjectId(orderId as string),
      `https://example.com/receipts/${tran_id}` // You should get actual receipt URL
    )

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // 2. Add student to course
    await Course.findByIdAndUpdate(
      courseId,
      {
        $addToSet: { students: userId },
        $push: { studentsEnrolledAt: new Date() },
      },
      { new: true }
    )

    // ✅ 2.5: Track referral if referrerId exists
    const order = await Order.findById(orderId)
    if (order?.referrerId) {
      await ReferralService.trackPurchase({
        referrerId: order.referrerId,
        userId: new Types.ObjectId(userId as string),
        courseId: new Types.ObjectId(courseId as string),
        transactionId: tran_id as string,
      })
    }

    // 3. Add course to user's purchasedCourses
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { purchasedCourses: courseId } },
      { new: true }
    )

    // 4. Redirect client
    res.redirect(
      `http://localhost:3000/payment/success?tran_id=${tran_id}&userId=${userId}&courseId=${courseId}`
    )
  } catch (err) {
    console.error('Payment success error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}
