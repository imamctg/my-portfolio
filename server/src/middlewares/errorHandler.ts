import { NextFunction, Request, Response } from 'express'

// middlewares/errorHandler.ts
export const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong!',
  })
}
