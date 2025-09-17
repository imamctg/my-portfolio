// server/src/controllers/affiliate.controller.ts
import { Response } from 'express'
import * as AffiliateService from './affiliate.service'
import { AuthRequest } from '../../middlewares/authMiddleware'
import { Earnings, IEarnings } from '../earnings/earnings.model'
import { Withdrawal } from '../withdrawals/withdrawal.model'
import mongoose from 'mongoose'

export const getAffiliateStats = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user!._id.toString()
    const stats = await AffiliateService.getStats(userId)

    return res.json(stats)
  } catch (err) {
    console.error('getAffiliateStats error', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const getAffiliateLinks = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user!._id.toString()
    const links = await AffiliateService.getLinks(userId)
    return res.json({ links })
  } catch (err) {
    console.error('getAffiliateLinks error', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const createAffiliateLink = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user!._id.toString()
    const { label, targetUrl, slug } = req.body

    if (!targetUrl)
      return res.status(400).json({ message: 'targetUrl is required' })

    const link = await AffiliateService.createLink({
      userId,
      label,
      targetUrl,
      slug,
    })

    return res.status(201).json({ link })
  } catch (err: any) {
    console.error('createAffiliateLink error', err)
    return res
      .status(500)
      .json({ message: err.message || 'Internal server error' })
  }
}

export const getLinkClicks = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user!._id.toString()
    const { linkId } = req.params
    const { page = '1', limit = '25' } = req.query

    const clicks = await AffiliateService.getLinkClicks(userId, linkId, {
      page: Number(page),
      limit: Number(limit),
    })
    return res.json({ clicks })
  } catch (err) {
    console.error('getLinkClicks error', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// export const getEarnings = async (
//   req: AuthRequest,
//   res: Response
// ): Promise<any> => {
//   try {
//     const userId = req.user!._id.toString()

//     // const earnings = await AffiliateService.getEarnings(userId)
//     const withdrawals = await Withdrawal.find({
//       user: userId,
//       userType: 'affiliate',
//     }).lean()

//     const history = [
//       // ...earnings.map((e) => ({
//       //   date: e.createdAt,
//       //   amount: e.affiliateFee ?? 0,
//       //   type: 'earning',
//       //   description: `Earning from order ${e.orderId?.toString()}`,
//       //   status: e.status,
//       //   method: e.meta?.method ?? 'Affiliate',
//       // })),
//       ...withdrawals.map((w) => ({
//         date: w.createdAt,
//         amount: w.amount,
//         type: 'withdraw',
//         description: `Withdrawal via ${w.method}`,
//         status: w.status,
//         method: w.method,
//       })),
//     ]

//     return res.json({ history })
//   } catch (err) {
//     console.error('getEarnings error', err)
//     return res.status(500).json({ message: 'Internal server error' })
//   }
// }

export const getEarnings = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user!._id.toString()
    const stats = await AffiliateService.getStats(userId)

    // Generate chart data (last 30 days)
    const chartData = await Earnings.aggregate([
      {
        $match: {
          referrerId: mongoose.Types.ObjectId.createFromHexString(userId), // Updated approach
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          amount: { $sum: '$affiliateFee' },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: '$_id',
          amount: 1,
          _id: 0,
        },
      },
    ])

    const withdrawals = await Withdrawal.find({
      user: userId,
      userType: 'affiliate',
    }).lean()

    const history = [
      ...withdrawals.map((w) => ({
        date: w.createdAt,
        amount: w.amount,
        type: 'withdrawal',
        description: `Withdrawal via ${w.method}`,
        status: w.status,
        method: w.method,
      })),
    ]

    return res.json({
      summary: {
        today: stats.todayEarnings,
        monthly: stats.monthlyEarnings,
        weeklyBonus: 0,
        monthlyBonus: 0,
        total: stats.totalEarnings,
        totalWithdrawn: stats.totalWithdrawn,
        availableBalance: stats.availableBalance,
      },
      chartData,
      history,
    })
  } catch (err) {
    console.error('getEarnings error', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const requestPayout = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user!._id.toString()
    const { amount, method, accountDetails } = req.body
    console.log(req.body, 'req.body of requestPayout')
    if (!amount || !method)
      return res.status(400).json({ message: 'amount and method required' })

    const payout = await AffiliateService.requestPayout(userId, {
      amount,
      method,
      accountDetails,
    })
    return res.status(201).json({ payout })
  } catch (err) {
    console.error('requestPayout error', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const getReports = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user!._id.toString()
    const { from, to, groupBy } = req.query
    const report = await AffiliateService.getReport(userId, {
      from: typeof from === 'string' ? from : undefined,
      to: typeof to === 'string' ? to : undefined,
      groupBy: typeof groupBy === 'string' ? groupBy : undefined,
    })
    return res.json(report)
  } catch (err) {
    console.error('getReports error', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
