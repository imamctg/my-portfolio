// import { Request, Response, NextFunction } from 'express'
// import jwt from 'jsonwebtoken'
// import User from '../modules/user/user.model'

// export interface AuthRequest extends Request {
//   user?: any
// }

// const authMiddleware = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   const token = req.headers.authorization?.split(' ')[1]

//   if (!token) {
//     res.status(401).json({ message: 'Unauthorized' })
//     return
//   }

//   try {
//     if (!process.env.JWT_SECRET) {
//       throw new Error('JWT_SECRET not configured')
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string }

//     req.user = await User.findById(decoded.id).select('_id role')
//     if (!req.user) {
//       res.status(401).json({ message: 'Unauthorized' })
//       return
//     }

//     next()
//   } catch (error) {
//     console.error('Auth Middleware Error:', error)
//     res.status(401).json({ message: 'Unauthorized' })
//   }
// }

// export default authMiddleware

import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import User from '../modules/user/user.model'

export interface AuthRequest extends Request {
  user?: {
    _id: string
    role: string
  }
}

interface TokenPayload extends JwtPayload {
  id: string
}

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Unauthorized: No token provided' })
      return
    }

    const token = authHeader.split(' ')[1]

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not configured')
      res.status(500).json({ message: 'Server configuration error' })
      return
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as TokenPayload

    const user = await User.findById(decoded.id).select('_id role')
    if (!user) {
      res.status(401).json({ message: 'Unauthorized: User not found' })
      return
    }

    req.user = { _id: user._id.toString(), role: user.role }

    next()
  } catch (error) {
    console.error('Auth Middleware Error:', error)
    res.status(401).json({ message: 'Unauthorized: Invalid or expired token' })
  }
}

export default authMiddleware
