import { Request, Response } from 'express'
import { WithdrawalService } from '../withdrawals/withdrawal.service'
import { Earnings } from '../earnings/earnings.model'
import { Withdrawal } from '../withdrawals/withdrawal.model'
import { UserType } from '../withdrawals/withdrawal.model'

/**
 * Instructor Withdraw Stats
 * GET /api/instructor/stats
 */
export const getWithdrawStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id

    // total earned (pending + paid)
    const totalEarnings = await Earnings.aggregate([
      { $match: { instructorId: userId } },
      { $group: { _id: null, sum: { $sum: '$instructorEarnings' } } },
    ])

    const totalWithdrawn = await Withdrawal.aggregate([
      {
        $match: {
          user: userId,
          userType: UserType.INSTRUCTOR,
          status: { $in: ['completed', 'approved', 'processing'] },
        },
      },
      { $group: { _id: null, sum: { $sum: '$amount' } } },
    ])

    const pendingRequests = await Withdrawal.countDocuments({
      user: userId,
      userType: UserType.INSTRUCTOR,
      status: 'pending',
    })

    res.json({
      totalEarnings: totalEarnings[0]?.sum || 0,
      totalWithdrawn: totalWithdrawn[0]?.sum || 0,
      pendingRequests,
    })
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch stats' })
  }
}

/**
 * Instructor Earnings Summary + History
 * GET /api/instructor/earnings
 */
export const getEarnings = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id

    // summary (today, monthly, total)
    const now = new Date()
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    )
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const today = await Earnings.aggregate([
      { $match: { instructorId: userId, createdAt: { $gte: startOfToday } } },
      { $group: { _id: null, sum: { $sum: '$instructorEarnings' } } },
    ])

    const monthly = await Earnings.aggregate([
      { $match: { instructorId: userId, createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, sum: { $sum: '$instructorEarnings' } } },
    ])

    const total = await Earnings.aggregate([
      { $match: { instructorId: userId } },
      { $group: { _id: null, sum: { $sum: '$instructorEarnings' } } },
    ])

    // withdrawal history
    const history = await Withdrawal.find({
      user: userId,
      userType: UserType.INSTRUCTOR,
    })
      .sort({ createdAt: -1 })
      .limit(20)

    res.json({
      summary: {
        today: today[0]?.sum || 0,
        monthly: monthly[0]?.sum || 0,
        total: total[0]?.sum || 0,
      },
      history,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch earnings' })
  }
}

/**
 * Request Withdrawal
 * POST /api/instructor/withdraw
 */
export const requestWithdraw = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user._id
    const { amount, method, accountDetails } = req.body

    if (!amount || !method || !accountDetails) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const withdrawal = await WithdrawalService.requestWithdrawal(
      userId,
      UserType.INSTRUCTOR,
      amount,
      method,
      accountDetails
    )

    res.status(201).json({ success: true, data: withdrawal })
  } catch (err: any) {
    console.error(err)
    res.status(400).json({ success: false, message: err.message })
  }
}
