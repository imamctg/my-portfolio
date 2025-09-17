// order.controller.ts

import { Request, Response } from 'express'
import { OrderService } from './order.service'
// import { createNewOrder, getOrdersByUserId } from './order.service'

export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      courseId,
      amount,
      discountAmount,
      finalPrice,
      paymentType,
      receiptUrl,
      transactionId,
      referrerId,
      discountPercent,
    } = req.body
    console.log('createOrder:', req.body)

    const savedOrder = await OrderService.createNewOrder({
      userId,
      courseId,
      amount,
      discountAmount,
      finalPrice,
      paymentType,
      receiptUrl,
      transactionId,
      referrerId,
      discountPercent,
    })

    res.status(201).json(savedOrder)
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error })
  }
}

export const getOrdersByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId
    const orders = await OrderService.getOrdersByUserId(userId)
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error })
  }
}
