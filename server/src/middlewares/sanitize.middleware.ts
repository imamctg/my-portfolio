// src/middlewares/sanitize.middleware.ts
import { Request, Response, NextFunction } from 'express'

const sanitizeObject = (obj: any) => {
  for (const key in obj) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key]
    }
  }
}

export const sanitizeInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body) sanitizeObject(req.body)
  if (req.params) sanitizeObject(req.params)
  // req.query বাদ দিয়েছি, কারণ এটা readonly হতে পারে
  next()
}
