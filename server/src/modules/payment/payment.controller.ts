import { Request, Response } from 'express'
import { initiateSSLCommerzPayment } from './payment.service'

export const initiatePayment = async (req: Request, res: Response) => {
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
    console.log(
      'payment-controller',
      amount,
      courseTitle,
      userEmail,
      userId,
      courseId,
      transactionId
    )
    const apiResponse = await initiateSSLCommerzPayment({
      amount,
      courseTitle,
      userEmail,
      userId,
      courseId,
      orderId,
      transactionId,
    })

    if (apiResponse?.GatewayPageURL) {
      res.send({ url: apiResponse?.GatewayPageURL, transactionId })
    } else {
      res.status(500).json({ error: 'Failed to get payment URL' })
    }
  } catch (error) {
    console.error('Payment initiation error:', error)
    res.status(500).json({ error: 'Payment initiation failed' })
  }
}
