// src/modules/payment/bkash.controller.ts

import { Request, Response } from 'express'
import { initiateBkash } from './bkash.service'

export const initiateBkashPayment = async (req: Request, res: Response) => {
  try {
    const {
      amount,
      courseTitle,
      userEmail,
      userId,
      courseId,
      orderId,
      transactionId,
    } = req.body

    const response = await initiateBkash({
      amount,
      courseTitle,
      userEmail,
      userId,
      courseId,
      orderId,
      transactionId,
    })

    if (response?.bkashURL) {
      res.send({ bkashURL: response.bkashURL })
    } else {
      res.status(500).json({ error: 'Failed to initiate bKash payment' })
    }
  } catch (error) {
    console.error('bKash payment error:', error)
    res.status(500).json({ error: 'bKash payment failed' })
  }
}
