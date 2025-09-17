// modules/admin/admin.service.ts
import User from '../user/user.model'
import Course from '../course/course.model'
import { Order } from '../order/order.model'

export const getAdminStatsService = async () => {
  const totalUsers = await User.countDocuments()
  const totalCourses = await Course.countDocuments()

  const totalRevenue = await Order.aggregate([
    { $group: { _id: null, total: { $sum: '$price' } } },
  ])
  const monthlyRevenue = totalRevenue[0]?.total || 0

  const pendingApprovals = await Course.countDocuments({ status: 'pending' })

  return {
    totalUsers,
    totalCourses,
    monthlyRevenue,
    pendingApprovals,
  }
}
