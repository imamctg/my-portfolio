'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminRevenue } from 'hooks/useAdminRevenue'
import RevenueChart from 'components/admin/charts/RevenueChart'
import { Stats } from 'types/adminDashboardStats'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // Redux থেকে user + token
  const { user, token } = useSelector((state: RootState) => state.auth)

  // Client mounted check (hydration fix)
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (!user) {
      router.push('/auth/login')
      return
    }

    if (user.role !== 'admin') {
      router.push('/')
      return
    }

    const fetchStats = async () => {
      try {
        const res = await axios.get(`${baseURL}/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setStats(res.data)
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      }
    }

    fetchStats()
  }, [mounted, user, token, router])

  const {
    data: revenueData,
    isLoading: revenueLoading,
    error: revenueError,
  } = useAdminRevenue()

  if (!mounted) return null // SSR → কিছু render করবে না
  if (!user || user.role !== 'admin') {
    return <p className='p-6 text-center'>Redirecting...</p>
  }

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-bold mb-4'>📊 Dashboard Overview</h2>

      {/* Main Stat Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <StatCard title='Total Users' value={stats?.totalUsers} />
        <StatCard title='Total Courses' value={stats?.totalCourses} />
        <StatCard title='Monthly Revenue' value={`$${stats?.monthlyRevenue}`} />
        <StatCard title='Pending Approvals' value={stats?.pendingApprovals} />
        <StatCard title='Today Orders' value={stats?.todayOrders} />
        <StatCard title='Total Orders' value={stats?.totalOrders} />
        <StatCard title='Today Earnings' value={`$${stats?.todayEarnings}`} />
        <StatCard title='New Users Today' value={stats?.newUsersToday} />
        <StatCard title='Refund Requests' value={stats?.refundRequests} />

        {/* Admin Total Earning Card */}
        <StatCard
          title='Admin Total Earning'
          value={
            revenueLoading
              ? 'Loading...'
              : revenueError
              ? 'Error'
              : `$${revenueData?.platformEarnings?.toFixed(2)}`
          }
        />
      </div>

      {/* Sold Courses */}
      <div className='mt-10'>
        <h3 className='text-lg font-semibold mb-3'>🔥 Sold Courses</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {stats?.soldCourses?.map((course, idx) => (
            <div
              key={idx}
              className='bg-white border p-4 rounded-lg shadow hover:shadow-md transition'
            >
              <p className='text-sm text-gray-500'>Course</p>
              <h4 className='text-lg font-semibold'>{course.title}</h4>
              <p className='text-sm text-green-600'>Sold: {course.totalSold}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Chart */}
      <RevenueChart chartData={revenueData?.chartData} />
    </div>
  )
}

// Reusable Stat Card
const StatCard = ({ title, value }: { title: string; value: any }) => (
  <div className='bg-white p-5 rounded-lg shadow'>
    <h3 className='text-sm text-gray-500'>{title}</h3>
    <p className='text-2xl font-bold text-gray-800'>{value ?? '—'}</p>
  </div>
)
