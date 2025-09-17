// client/hooks/useAdminRevenue.ts
import axios from 'axios'
import { RootState } from 'features/redux/store'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

interface AdminRevenueData {
  totalRevenue: number
  platformEarnings: number
  pendingRevenue: number
  chartData?: any[]
  paymentHistory?: any[]
  monthlyRevenue?: { month: string; revenue: number }[]
  yearlyRevenue?: { year: string; revenue: number }[]
  revenueByCourse?: { courseName: string; revenue: number }[]
  revenueByInstructor?: { instructorName: string; revenue: number }[]
  commissionSplit?: {
    platform: number
    instructor: number
    affiliate: number
  }[]
  refunds?: { date: string; amount: number; reason?: string }[]
  activeInstructors?: number // 👈 এখানে যোগ করুন
  activeCourses?: number // (future use, চাইলে রাখুন)
  totalStudents?: number // (dashboard summary এর জন্য কাজে আসবে)
}
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
export function useAdminRevenue() {
  const token = useSelector((state: RootState) => state.auth.token)
  const [data, setData] = useState<AdminRevenueData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setIsLoading(false)
      return
    }

    const fetchRevenue = async () => {
      try {
        const res = await axios.get(`${baseURL}/earnings/admin`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setData(res.data)
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Failed to load revenue data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRevenue()
  }, [token])

  return { data, isLoading, error }
}
