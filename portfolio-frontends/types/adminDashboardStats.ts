export interface Stats {
  totalUsers: number
  totalCourses: number
  monthlyRevenue: number
  pendingApprovals: number
  todayOrders: number
  totalOrders: number
  todayEarnings: number
  newUsersToday: number
  refundRequests: number
  soldCourses: {
    title: string
    totalSold: number
  }[]
}
