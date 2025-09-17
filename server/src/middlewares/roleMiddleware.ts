// import { Request, Response, NextFunction } from 'express'

// export const requireRole = (roles: string[]) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     const user = (req as any).user

//     if (!user || !user.role) {
//       res.status(401).json({ message: 'Unauthorized: Role missing' })
//       return
//     }

//     if (!roles.includes(user.role)) {
//       res.status(403).json({ message: 'Forbidden: Insufficient role' })
//       return
//     }

//     next()
//   }
// }

import { Request, Response, NextFunction } from 'express'
import { AuthRequest } from './authMiddleware'

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthRequest).user

    if (!user) {
      res.status(401).json({ message: 'Unauthorized: No user in request' })
      return
    }

    if (!roles.includes(user.role)) {
      res.status(403).json({ message: 'Forbidden: Insufficient role' })
      return
    }

    next()
  }
}
