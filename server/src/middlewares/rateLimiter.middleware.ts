import rateLimit from 'express-rate-limit'

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Max 5 requests per minute per IP
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
})
