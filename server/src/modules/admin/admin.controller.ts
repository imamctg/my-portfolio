// import { Request, Response } from 'express'
// import User, { IUser } from '../user/user.model'
// import Course from '../course/course.model'
// import { Order } from '../order/order.model'

// export const getAdminStats = async (req: Request, res: Response) => {
//   try {
//     const totalUsers = await User.countDocuments()
//     const totalCourses = await Course.countDocuments()
//     const totalRevenue = await Order.aggregate([
//       { $group: { _id: null, total: { $sum: '$price' } } },
//     ])
//     const monthlyRevenue = totalRevenue[0]?.total || 0

//     const pendingApprovals = await Course.countDocuments({ status: 'pending' })

//     res.json({
//       totalUsers,
//       totalCourses,
//       monthlyRevenue,
//       pendingApprovals,
//     })
//   } catch (error) {
//     console.error('❌ Admin stats error:', error)
//     res.status(500).json({ message: 'Failed to fetch admin stats' })
//   }
// }

// modules/admin/admin.controller.ts
import { Request, Response } from 'express'
import { getAdminStatsService } from './admin.service'
// import { getAdminStatsService } from './admin.service'

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const stats = await getAdminStatsService()
    res.json(stats)
  } catch (error) {
    console.error('❌ Admin stats error:', error)
    res.status(500).json({ message: 'Failed to fetch admin stats' })
  }
}
