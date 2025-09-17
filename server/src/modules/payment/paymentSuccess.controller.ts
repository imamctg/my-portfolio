// paymentSuccess.controller.ts
import { Order } from '../order/order.model'
import User from '../user/user.model'
import { Request, Response } from 'express'
import { OrderService } from '../order/order.service'
import { Types } from 'mongoose'

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

    // ✅ 2.5: Track referral if referrerId exists
    const order = await Order.findById(orderId)

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
