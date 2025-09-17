import express from 'express'
import { createOrder, getOrdersByUser } from './order.controller'

const router = express.Router()

router.post('/', createOrder)
router.get('/:userId', getOrdersByUser)

export default router
