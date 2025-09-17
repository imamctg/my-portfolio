// src/middlewares/validateRequest.ts

import { Request, Response, NextFunction, RequestHandler } from 'express'
import { validationResult } from 'express-validator'

const validateRequest = (validations: any[]): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    await Promise.all(validations.map((validation) => validation.run(req)))

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    next()
  }
}

export default validateRequest
