import { Request, Response } from 'express'
import { Withdrawal } from './withdrawal.model'
import { UserType, WithdrawalStatus } from './withdrawal.model'
import { WithdrawalService } from './withdrawal.service'
import * as withdrawalService from './withdrawal.service'

export const requestWithdrawal = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { amount, method, accountDetails } = req.body

    // user validation
    const userId = req.user._id
    const role = req.user.role // 'instructor' | 'affiliate' etc.

    const userType =
      role === 'instructor'
        ? 'instructor'
        : role === 'affiliate'
        ? 'affiliate'
        : 'platform'

    const withdrawal = await WithdrawalService.requestWithdrawal(
      userId,
      userType,
      amount,
      method,
      accountDetails
    )

    return res.status(201).json({ success: true, data: withdrawal })
  } catch (error: any) {
    console.error('Withdrawal request error:', error)
    return res.status(400).json({
      success: false,
      message: error?.message || 'Withdrawal request failed',
    })
  }
}

// ✅ Admin updates withdraw status
export const updateWithdrawStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { withdrawId } = req.params
    const { status } = req.body

    if (!['approved', 'processing', 'completed', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const withdraw = await Withdrawal.findByIdAndUpdate(
      withdrawId,
      { status },
      { new: true }
    )

    if (!withdraw) {
      return res.status(404).json({ message: 'Withdrawal not found' })
    }

    res.status(200).json({ message: 'Status updated successfully', withdraw })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

// GET /api/withdrawals?status=pending
export const getWithdrawals = async (req: Request, res: Response) => {
  try {
    const { status } = req.query
    const withdrawals = await withdrawalService.getWithdrawals(status as string)
    res.status(200).json(withdrawals)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// PUT /api/withdrawals/:id/status
export const updateStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params
    const { status } = req.body
    if (
      !['pending', 'approved', 'processing', 'completed', 'rejected'].includes(
        status
      )
    ) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const updated = await withdrawalService.updateWithdrawalStatus(
      id,
      status as any
    )
    if (!updated)
      return res.status(404).json({ message: 'Withdrawal not found' })

    res.status(200).json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}
