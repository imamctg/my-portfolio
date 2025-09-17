import { Types } from 'mongoose'
import { ReferralTracking } from './referral-tracking.model'

export class ReferralService {
  static async trackSignup(
    referrerId: Types.ObjectId,
    referredUserId: Types.ObjectId
  ) {
    return ReferralTracking.create({
      referrerId,
      referredUserId,
      action: 'signup',
    })
  }

  static async trackPurchase(order: {
    referrerId?: Types.ObjectId
    userId: Types.ObjectId
    courseId: Types.ObjectId
    transactionId: string
  }) {
    if (!order.referrerId) return
    return ReferralTracking.create({
      referrerId: order.referrerId,
      referredUserId: order.userId,
      courseId: order.courseId,
      transactionId: order.transactionId,
      action: 'purchase',
    })
  }
}
