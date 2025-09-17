import mongoose, { Types } from 'mongoose'
import { IWithdrawal, Withdrawal } from './withdrawal.model'
import { UserType, WithdrawalStatus } from './withdrawal.model'
import { Earnings } from '../earnings/earnings.model'

export class WithdrawalService {
  // আপনার বর্তমান মেথডগুলি
  static async createWithdrawal(data: {
    user: string
    userType: UserType
    amount: number
    method: string
    accountDetails: string
  }) {
    return await Withdrawal.create({
      ...data,
      status: WithdrawalStatus.PENDING,
    })
  }

  static async getUserWithdrawals(userId: string, userType: UserType) {
    return await Withdrawal.find({ user: userId, userType })
  }

  // নতুন requestWithdrawal মেথড যোগ করুন
  static async requestWithdrawal(
    userId: Types.ObjectId,
    userType: 'instructor' | 'affiliate' | 'platform',
    amount: number,
    method: string,
    accountDetails: string
  ) {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      // কোন ফিল্ডে match করবেন (instructor -> instructorId, affiliate -> referrerId)
      const matchField =
        userType === 'instructor' ? 'instructorId' : 'referrerId'

      // pending earnings (oldest first) — session সাথে
      const pendingEarnings = await Earnings.find({
        [matchField]: userId,
        status: 'pending',
      })
        .sort({ createdAt: 1 })
        .session(session)
        .exec()

      // calculate available
      let available = 0
      for (const e of pendingEarnings) {
        const val =
          userType === 'instructor'
            ? (e as any).instructorEarnings
            : (e as any).affiliateFee
        const withdrawn = (e as any).withdrawnAmount || 0
        available += Math.max(0, val - withdrawn)
      }

      if (available < amount) {
        throw new Error('Insufficient balance for withdrawal')
      }

      // Deduct FIFO
      let remaining = amount
      for (const e of pendingEarnings) {
        if (remaining <= 0) break

        const key =
          userType === 'instructor' ? 'instructorEarnings' : 'affiliateFee'
        const currentVal =
          ((e as any)[key] || 0) - ((e as any).withdrawnAmount || 0)
        if (currentVal <= 0) continue

        if (remaining >= currentVal) {
          // consume fully
          await Earnings.updateOne(
            { _id: e._id },
            {
              $inc: { withdrawnAmount: currentVal },
              $set: { [key]: 0, status: 'paid' },
            },
            { session }
          )
          remaining -= currentVal
        } else {
          // partial consume
          await Earnings.updateOne(
            { _id: e._id },
            {
              $inc: { withdrawnAmount: remaining, [key]: -remaining },
              // keep status as pending (partial still pending)
            },
            { session }
          )
          remaining = 0
        }
      }

      // Create withdrawal record (inside session)
      const [withdrawal] = await Withdrawal.create(
        [
          {
            user: userId,
            userType,
            amount,
            method,
            accountDetails,
            status: WithdrawalStatus.PENDING,
          },
        ],
        { session }
      )

      await session.commitTransaction()
      session.endSession()
      return withdrawal
    } catch (err) {
      await session.abortTransaction()
      session.endSession()
      throw err
    }
  }

  // অন্যান্য সার্ভিস মেথড...
  static async processMonthlyPayouts() {
    // মাসিক পেমেন্ট প্রসেসিং লজিক
  }

  static async getWithdrawalStats(userId: Types.ObjectId, userType: UserType) {
    // উত্তোলন স্ট্যাটিস্টিক্স লজিক
  }
}

// Get withdrawals (optionally filter by status)
export const getWithdrawals = async (
  status?: string
): Promise<IWithdrawal[]> => {
  const filter: any = {}
  if (status && status !== 'all') filter.status = status
  return Withdrawal.find(filter)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
}

// Update withdrawal status
export const updateWithdrawalStatus = async (
  withdrawalId: string,
  status: IWithdrawal['status']
): Promise<IWithdrawal | null> => {
  return Withdrawal.findByIdAndUpdate(
    withdrawalId,
    { status },
    { new: true }
  ).populate('user', 'name email')
}
