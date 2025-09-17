// src/modules/payment/bkashSuccess.controller.ts

import { Request, Response } from 'express'
import { OrderService } from '../order/order.service'
import Course from '../course/course.model'
import User from '../user/user.model'
import { Types } from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const CLIENT_URL = process.env.CLIENT_URL

export const bkashSuccess = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { tran_id, userId, courseId, orderId } = req.query

    console.log('📦 bKash success:', { tran_id, userId, courseId, orderId })

    if (!tran_id || !userId || !courseId || !orderId) {
      return res.status(400).json({ message: 'Missing parameters' })
    }

    // Step 1: Order Update & Receipt Save
    const updatedOrder = await OrderService.handleSuccessfulPayment(
      new Types.ObjectId(orderId as string),
      `https://example.com/receipts/${tran_id}` // বিকাশ রশিদ ইউআরএল পরে ইন্টিগ্রেট করা যাবে
    )

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Step 2: Add student to course
    await Course.findByIdAndUpdate(
      courseId,
      {
        $addToSet: { students: userId },
        $push: { studentsEnrolledAt: new Date() },
      },
      { new: true }
    )

    // Step 3: Add course to user
    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { purchasedCourses: courseId },
      },
      { new: true }
    )

    // Step 4: Redirect to success page
    res.redirect(
      `${CLIENT_URL}/payment/success?tran_id=${tran_id}&userId=${userId}&courseId=${courseId}`
    )
  } catch (error) {
    console.error('bKash success error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
