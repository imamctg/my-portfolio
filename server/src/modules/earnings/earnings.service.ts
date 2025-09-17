import { Types } from 'mongoose'
import { Order } from '../order/order.model'
import { Earnings } from './earnings.model'
import User from '../user/user.model'

const PAYMENT_GATEWAY_FEE_PERCENT = 3
const BOOST_DAYS = [5, 6, 9] // Friday and Saturday

const BONUS_TIERS = [
  { threshold: 25000, bonus: 3000 },
  { threshold: 10000, bonus: 1200 },
  { threshold: 5000, bonus: 500 },
]

export class EarningsService {
  static async createEarningRecord(orderId: Types.ObjectId) {
    const order = await Order.findById(orderId).populate('courseId')
    if (!order) throw new Error('Order not found')

    const course = order.courseId
    if (course instanceof Types.ObjectId) {
      throw new Error('Course not populated')
    }

    // Determine student source
    let studentSource: 'affiliate' | 'instructor' | 'platform' = 'platform'
    if (order.referrerId) {
      const refUser = await User.findById(order.referrerId)
      if (refUser?.role === 'affiliate') studentSource = 'affiliate'
      else if (refUser?.role === 'instructor') studentSource = 'instructor'
    }

    const discountType = order.discountType ?? 'percentage'
    const discountValue = order.discountValue ?? 0

    const paymentGatewayFee = (order.amount * PAYMENT_GATEWAY_FEE_PERCENT) / 100
    const netAmount = order.amount - paymentGatewayFee
    const isBoostDay = BOOST_DAYS.includes(new Date(order.createdAt).getDay())

    const { platformFee, instructorEarnings, affiliateFee } =
      this.calculateEarnings(
        netAmount,
        studentSource,
        discountValue,
        discountType,
        isBoostDay
      )

    const earning = new Earnings({
      referrerId: order.referrerId,
      orderId: order._id,

      grossAmount: order.amount,
      paymentGatewayFee,
      platformFee,
      instructorEarnings,
      affiliateFee,
      discountType,
      discountAmount: discountValue,
      status: 'pending',
      createdAt: new Date(),
    })

    return await earning.save()
  }

  private static calculateEarnings(
    netAmount: number,
    source: 'instructor' | 'platform' | 'affiliate',
    discountValue: number,
    discountType: 'flat' | 'percentage',
    isBoostDay: boolean
  ) {
    let instructorShare = 0,
      affiliateShare = 0,
      platformShare = 0

    switch (source) {
      case 'instructor':
        instructorShare = 0.8
        platformShare = 0.2
        break
      case 'affiliate':
        instructorShare = 0.5
        affiliateShare = 0.3
        platformShare = 0.2
        break
      case 'platform':
      default:
        instructorShare = 0.7
        platformShare = 0.3
        break
    }

    // Base earnings
    let instructorEarnings = netAmount * instructorShare
    let affiliateFee = netAmount * affiliateShare
    let platformFee = netAmount * platformShare

    // Boost Day Bonus (10%)
    if (isBoostDay) {
      const boostBonus = netAmount * 0.1

      // কেবল instructor/affiliate referral হলে বোনাস
      if (source === 'instructor') {
        instructorEarnings += boostBonus
        platformFee -= boostBonus
      } else if (source === 'affiliate') {
        affiliateFee += boostBonus
        platformFee -= boostBonus
      }
    }

    // Ensure platformFee never goes negative
    if (platformFee < 0) platformFee = 0

    return {
      netAmount,
      instructorEarnings,
      affiliateFee,
      platformFee,
    }
  }
  // ভবিষ্যতে বোনাস চালু করা হতে পারে তাই নিচের কমেন্ট করা কোড রাখা হয়েছে।

  // static async applyWeeklyCampaignBonus() {
  //   const lastWeek = new Date()
  //   lastWeek.setDate(lastWeek.getDate() - 7)

  //   const earnings = await Earnings.aggregate([
  //     { $match: { createdAt: { $gte: lastWeek } } },
  //     {
  //       $group: {
  //         _id: '$instructorId',
  //         totalInstructorEarnings: { $sum: '$instructorEarnings' },
  //         totalAffiliateFees: { $sum: '$affiliateFee' },
  //       },
  //     },
  //   ])

  //   for (const e of earnings) {
  //     let bonus = 0
  //     if (e.totalInstructorEarnings >= 10000) bonus += 1000
  //     if (e.totalAffiliateFees >= 5000) bonus += 500

  //     if (bonus > 0) {
  //       await Earnings.updateMany(
  //         {
  //           instructorId: e._id,
  //           createdAt: { $gte: lastWeek },
  //         },
  //         { $inc: { weeklyCampaignBonus: bonus } }
  //       )
  //     }
  //   }
  // }

  // static async applyMonthlyBonus(
  //   userId: Types.ObjectId,
  //   totalSales: number,
  //   startOfMonth: Date,
  //   role: 'instructor' | 'affiliate'
  // ) {
  //   for (const tier of BONUS_TIERS) {
  //     if (totalSales >= tier.threshold) {
  //       const bonus = tier.bonus

  //       // role অনুযায়ী field name সেট করা হচ্ছে
  //       const idField = role === 'instructor' ? 'instructorId' : 'affiliateId'
  //       const earningsField =
  //         role === 'instructor' ? 'instructorEarnings' : 'affiliateFee'

  //       await Earnings.updateMany(
  //         {
  //           [idField]: userId,
  //           createdAt: { $gte: startOfMonth },
  //           status: 'pending',
  //           bonusApplied: { $ne: true },
  //         },
  //         {
  //           $inc: {
  //             [earningsField]: bonus,
  //             monthlyBonus: bonus,
  //           },
  //           $set: { bonusApplied: true },
  //         }
  //       )
  //       break
  //     }
  //   }
  // }

  // static async applyMonthlyBonusesForAll() {
  //   const startOfMonth = new Date()
  //   startOfMonth.setDate(1)
  //   startOfMonth.setHours(0, 0, 0, 0)

  //   // Instructor বোনাস হিসাব
  //   const instructors = await Earnings.aggregate([
  //     { $match: { createdAt: { $gte: startOfMonth } } },
  //     {
  //       $group: {
  //         _id: '$instructorId',
  //         totalSales: { $sum: '$instructorEarnings' },
  //       },
  //     },
  //   ])

  //   for (const instructor of instructors) {
  //     await this.applyMonthlyBonus(
  //       instructor._id,
  //       instructor.totalSales,
  //       startOfMonth,
  //       'instructor'
  //     )
  //   }

  //   // Affiliate বোনাস হিসাব
  //   const affiliates = await Earnings.aggregate([
  //     {
  //       $match: {
  //         createdAt: { $gte: startOfMonth },
  //         referrerId: { $exists: true, $ne: null },
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: '$referrerId',
  //         totalSales: { $sum: '$affiliateFee' },
  //       },
  //     },
  //   ])

  //   for (const affiliate of affiliates) {
  //     await this.applyMonthlyBonus(
  //       affiliate._id,
  //       affiliate.totalSales,
  //       startOfMonth,
  //       'affiliate'
  //     )
  //   }
  // }

  static async getInstructorEarnings(instructorId: string) {
    return Earnings.aggregate([
      { $match: { instructorId: new Types.ObjectId(instructorId) } },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$instructorEarnings' },
          pendingEarnings: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'pending'] },
                '$instructorEarnings',
                0,
              ],
            },
          },
          paidEarnings: {
            $sum: {
              $cond: [{ $eq: ['$status', 'paid'] }, '$instructorEarnings', 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalEarnings: 1,
          pendingEarnings: 1,
          paidEarnings: 1,
        },
      },
    ])
  }

  static async getAdminRevenue() {
    return Earnings.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$grossAmount' },
          platformEarnings: { $sum: '$platformFee' },
          pendingRevenue: {
            $sum: {
              $cond: [{ $eq: ['$status', 'pending'] }, '$platformFee', 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          platformEarnings: 1,
          pendingRevenue: 1,
        },
      },
    ])
  }
}
