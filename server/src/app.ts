import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import authRoutes from './modules/auth/auth.routes'

import userRoutes from './modules/user/user.routes'
import paymentRoutes from './modules/payment/payment.route'
import adminRoutes from './modules/admin/adminRoutes'
import messageRoutes from './modules/message/message.routes'
import orderRoutes from './modules/order/order.routes'

import contactRoutes from './modules/contact/contact.routes'

import affiliateRoutes from './modules/affiliate/affiliate.routes'
import withdrawalRoutes from './modules/withdrawals/withdrawal.routes'
import blogRoutes from './modules/blog/blog.routes'
import projectRoutes from './modules/project/project.routes'
import testimonialRoutes from './modules/testimonial/testimonial.routes'
import heroRoutes from './modules/hero/hero.routes'
import skillRoutes from './modules/skill/skill.routes'
import ctaRoutes from './modules/cta/cta.routes'
import serviceRoutes from './modules/service/service.routes'

import dotenv from 'dotenv'
import { EarningsRoutes } from './modules/earnings/earnings.routes'
import helmet from 'helmet'

import { globalErrorHandler } from './middlewares/errorHandler'
import { sanitizeInput } from './middlewares/sanitize.middleware'
// import { scheduleBonuses } from './schedulers/monthlyBonusJob'

dotenv.config()
const app = express()

// 2. Security Headers
app.use(helmet())

app.use(cors())
app.use(express.json())
app.use(sanitizeInput)

// Routes
// Auth
app.use('/api/auth', authRoutes)

// Users

app.use('/api/users', userRoutes)

app.use('/api/messages', messageRoutes)

app.use('/api/contact', contactRoutes)
app.use('/api/earnings', EarningsRoutes)

app.use('/api/orders', orderRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/admin', adminRoutes)

app.use('/api/affiliate', affiliateRoutes)
app.use('/api/withdraw', withdrawalRoutes)

app.use('/api/blogs', blogRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/testimonials', testimonialRoutes)
app.use('/api/hero', heroRoutes)
app.use('/api/skills', skillRoutes)
app.use('/api/cta', ctaRoutes)
app.use('/api/services', serviceRoutes)

// 🏠 Default Route
app.get('/', (req, res) => {
  res.send('API is running...! Hello vai')
})

// scheduleBonuses()
// 🧯 Global Error Handler
app.use(globalErrorHandler)

export default app
