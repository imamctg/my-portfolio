'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import axios from 'axios'
import WithdrawalsTable from 'components/Dashboard/WithdrawalsTable'
import { Loader2 } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from 'components/ui/tabs'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'

// Withdrawal টাইপ
interface Withdrawal {
  _id: string
  user: { name: string; email: string }
  amount: number
  method: string
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected'
  accountDetails: string
  createdAt: string
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function WithdrawalsPage() {
  const token = useSelector((state: RootState) => state.auth.token)
  const searchParams = useSearchParams()
  const router = useRouter()

  const statusParam = searchParams.get('status') || 'all'

  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)

  // 🟢 Withdrawals ফেচ করা
  useEffect(() => {
    const fetchWithdrawals = async () => {
      if (!token) return
      try {
        setLoading(true)
        const res = await axios.get(`${baseURL}/withdraw`, {
          headers: { Authorization: `Bearer ${token}` },
          params: statusParam !== 'all' ? { status: statusParam } : {},
        })
        setWithdrawals(res.data)
      } catch (err) {
        console.error('Failed to fetch withdrawals:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchWithdrawals()
  }, [token, statusParam])

  // 🟢 Tab পরিবর্তন করলে query param update
  const handleTabChange = (value: string) => {
    router.push(
      `/dashboard/admin/withdrawals${value === 'all' ? '' : `?status=${value}`}`
    )
  }

  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-2xl font-semibold tracking-tight'>Withdrawals</h1>

      {/* Filter Tabs */}
      <Tabs
        defaultValue={statusParam}
        value={statusParam}
        onValueChange={handleTabChange}
        className='w-full'
      >
        <TabsList className='grid grid-cols-6 gap-2 max-w-4xl'>
          <TabsTrigger value='all'>All</TabsTrigger>
          <TabsTrigger value='pending'>Pending</TabsTrigger>
          <TabsTrigger value='approved'>Approved</TabsTrigger>
          <TabsTrigger value='processing'>Processing</TabsTrigger>
          <TabsTrigger value='completed'>Completed</TabsTrigger>
          <TabsTrigger value='rejected'>Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Loader or Table */}
      {loading ? (
        <div className='flex justify-center items-center h-40'>
          <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
        </div>
      ) : (
        <WithdrawalsTable withdrawals={withdrawals} token={token} />
      )}
    </div>
  )
}
