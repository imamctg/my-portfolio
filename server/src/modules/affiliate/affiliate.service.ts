// server/src/services/affiliate.service.ts

import mongoose from 'mongoose'
import AffiliateClickModel from './affiliateClick.model'
import { Earnings, IEarnings } from '../earnings/earnings.model'
import AffiliateLinkModel from './affiliateLink.model'
import {
  UserType,
  Withdrawal,
  WithdrawalMethod,
  WithdrawalStatus,
} from '../withdrawals/withdrawal.model'

/**
 * getStats(userId)
 * returns: { totalClicks, conversions, totalEarnings, pendingEarnings }
 */
// export const getStats = async (userId: string) => {
//   // aggregate clicks
//   const totalClicks = await AffiliateClickModel.countDocuments({
//     affiliateId: userId,
//   })

//   // conversions = count of earnings documents (or track conversion events separately)
//   const conversions = await Earnings.countDocuments({
//     affiliateId: userId,
//     type: 'conversion',
//   })

//   // earnings sums
//   const earningsAgg = await Earnings.aggregate([
//     { $match: { affiliateId: new mongoose.Types.ObjectId(userId) } },
//     {
//       $group: {
//         _id: null,
//         total: { $sum: '$affiliateFee' },
//         pending: {
//           $sum: {
//             $cond: [{ $eq: ['$status', 'pending'] }, '$affiliateFee', 0],
//           },
//         },
//       },
//     },
//   ])

//   const totalEarnings = earningsAgg[0]?.total || 0
//   const pendingEarnings = earningsAgg[0]?.pending || 0

//   return { totalClicks, conversions, totalEarnings, pendingEarnings }
// }

// export const getStats = async (userId: string) => {
//   // aggregate clicks
//   const totalClicks = await AffiliateClickModel.countDocuments({
//     affiliateId: userId,
//   })

//   // conversions = count of earnings documents
//   const conversions = await Earnings.countDocuments({
//     referrerId: userId,
//     type: 'conversion',
//   })

//   // earnings sums
//   const earningsAgg = await Earnings.aggregate([
//     { $match: { referrerId: new mongoose.Types.ObjectId(userId) } },
//     {
//       $group: {
//         _id: null,
//         total: { $sum: '$affiliateFee' },
//         pending: {
//           $sum: {
//             $cond: [{ $eq: ['$status', 'pending'] }, '$affiliateFee', 0],
//           },
//         },
//       },
//     },
//   ])

//   const totalEarnings = earningsAgg[0]?.total || 0
//   const pendingEarnings = earningsAgg[0]?.pending || 0

//   return { totalClicks, conversions, totalEarnings, pendingEarnings }
// }

export const getStats = async (userId: string) => {
  // Total clicks
  const totalClicks = await AffiliateClickModel.countDocuments({
    referrerId: userId,
  })

  // Conversions
  const conversions = await Earnings.countDocuments({
    referrerId: userId,
    type: 'conversion',
  })

  // Earnings aggregation
  const earningsAgg = await Earnings.aggregate([
    { $match: { referrerId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: '$affiliateFee' },
        pendingEarnings: {
          $sum: {
            $cond: [{ $eq: ['$status', 'pending'] }, '$affiliateFee', 0],
          },
        },
        totalWithdrawn: {
          $sum: {
            $cond: [{ $eq: ['$type', 'withdrawal'] }, '$amount', 0],
          },
        },
      },
    },
  ])

  // Time-based earnings
  const now = new Date()
  const todayStart = new Date(now.setHours(0, 0, 0, 0))
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const [todayEarnings, monthlyEarnings] = await Promise.all([
    Earnings.aggregate([
      {
        $match: {
          referrerId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: todayStart },
        },
      },
      { $group: { _id: null, amount: { $sum: '$affiliateFee' } } },
    ]),
    Earnings.aggregate([
      {
        $match: {
          referrerId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: monthStart },
        },
      },
      { $group: { _id: null, amount: { $sum: '$affiliateFee' } } },
    ]),
  ])

  return {
    totalClicks,
    conversions,
    totalEarnings: earningsAgg[0]?.totalEarnings || 0,
    pendingEarnings: earningsAgg[0]?.pendingEarnings || 0,
    totalWithdrawn: earningsAgg[0]?.totalWithdrawn || 0,
    todayEarnings: todayEarnings[0]?.amount || 0,
    monthlyEarnings: monthlyEarnings[0]?.amount || 0,
    availableBalance:
      (earningsAgg[0]?.totalEarnings || 0) -
      (earningsAgg[0]?.totalWithdrawn || 0),
  }
}

/**
 * getLinks(userId)
 */
export const getLinks = async (userId: string) => {
  const links = await AffiliateLinkModel.find({ owner: userId })
    .sort({ createdAt: -1 })
    .lean()
  return links
}

/**
 * createLink
 */
export const createLink = async (payload: {
  userId: string
  label?: string
  targetUrl: string
  slug?: string
}) => {
  const { userId, label, targetUrl, slug } = payload

  // ensure unique slug if provided
  if (slug) {
    const exists = await AffiliateLinkModel.findOne({ slug })
    if (exists) throw new Error('Slug already in use')
  }

  const link = new AffiliateLinkModel({
    owner: userId,
    label: label || 'Referral link',
    targetUrl,
    slug: slug || undefined,
  })

  await link.save()
  return link.toObject()
}

/**
 * getLinkClicks
 */
export const getLinkClicks = async (
  userId: string,
  linkId: string,
  opts: { page: number; limit: number }
) => {
  const link = await AffiliateLinkModel.findById(linkId)
  if (!link) throw new Error('Link not found')
  if (link.owner.toString() !== userId) throw new Error('Unauthorized')

  const { page, limit } = opts
  const skips = (page - 1) * limit

  const clicks = await AffiliateClickModel.find({ link: linkId })
    .sort({ createdAt: -1 })
    .skip(skips)
    .limit(limit)
    .lean()

  return clicks
}

/**
 * getEarnings
 */
export const getEarnings = async (userId: string) => {
  console.log(userId, 'userId of service')
  const earnings = await Earnings.find({ referrerId: userId })
    .sort({ createdAt: -1 })
    .lean()
  console.log(earnings, 'earnings of service')
  return earnings
}

/**
 * requestPayout
 */
// export const requestPayout = async (
//   userId: string,
//   payload: { affiliateFee: number; method: string; accountDetails?: any }
// ) => {
//   // simplistic: create an earning record with status 'payout_requested'
//   const { affiliateFee, method, accountDetails } = payload
//   const payout: Partial<IEarnings> = {
//     affiliateId: userId as any,
//     affiliateFee,
//     type: 'payout',
//     status: 'requested',
//     meta: { method, accountDetails, requestStatus: 'requested' },
//   }
//   const doc = new Earnings(payout)
//   await doc.save()
//   return doc.toObject()
// }

export const requestPayout = async (
  userId: string,
  payload: { amount: number; method: WithdrawalMethod; accountDetails: string }
) => {
  const { amount, method, accountDetails } = payload

  const withdrawal = await Withdrawal.create({
    user: userId,
    userType: UserType.AFFILIATE,
    amount,
    method,
    accountDetails,
    status: WithdrawalStatus.PENDING,
  })

  return withdrawal.toObject()
}

/**
 * getReport - simple aggregation example
 */
export const getReport = async (
  userId: string,
  opts: { from?: string; to?: string; groupBy?: string }
) => {
  const match: any = { affiliateId: new mongoose.Types.ObjectId(userId) }
  if (opts.from || opts.to) {
    match.createdAt = {}
    if (opts.from) match.createdAt.$gte = new Date(opts.from)
    if (opts.to) match.createdAt.$lte = new Date(opts.to)
  }

  // example group by day
  const groupFormat =
    opts.groupBy === 'month'
      ? { $dateToString: { format: '%Y-%m', date: '$createdAt' } }
      : { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }

  const agg = await Earnings.aggregate([
    { $match: match },
    {
      $group: {
        _id: groupFormat,
        totalEarnings: { $sum: '$affiliateFee' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ])

  return agg
}
