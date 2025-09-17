'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'
import {
  FaCalendarDay,
  FaCalendarAlt,
  FaGift,
  FaCoins,
  FaChartLine,
} from 'react-icons/fa'
import { Card, CardContent } from 'components/ui/card'
import { Badge } from 'components/ui/badge'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface EarningHistoryItem {
  date: string
  amount: number
  type: string // 'earning', 'weeklyBonus', 'monthlyBonus' etc
  description?: string
  status?: string
  method?: string
}

export default function AffiliateEarningsPage() {
  const user = useSelector((state: RootState) => state.auth.user)
  const token = useSelector((state: RootState) => state.auth.token)

  const [summary, setSummary] = useState({
    today: 0,
    monthly: 0,
    weeklyBonus: 0,
    monthlyBonus: 0,
    total: 0,
  })

  const [history, setHistory] = useState<EarningHistoryItem[]>([])
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    if (!user?.id || !token) return

    const fetchEarnings = async () => {
      try {
        const res = await axios.get(`${baseURL}/affiliate/earnings`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        console.log(res.data, 'res.data')
        setSummary(
          res.data.summary || {
            today: 0,
            monthly: 0,
            weeklyBonus: 0,
            monthlyBonus: 0,
            total: 0,
            totalWithdrawn: 0,
          }
        )

        setChartData(res.data.chartData || [])
        setHistory(res.data.history || [])
      } catch (error) {
        console.error('Failed to load earnings data', error)
      }
    }

    fetchEarnings()
  }, [user?.id, token])

  const statCards = [
    {
      title: 'Today Earnings',
      value: `৳${(summary.today ?? 0).toFixed(2)}`,
      icon: <FaCalendarDay className='text-blue-600 text-3xl' />,
      bg: 'bg-blue-50',
    },
    {
      title: 'Monthly Earnings',
      value: `৳${summary.monthly.toFixed(2)}`,
      icon: <FaCalendarAlt className='text-green-600 text-3xl' />,
      bg: 'bg-green-50',
    },
    {
      title: 'Weekly Bonus',
      value: `৳${summary.weeklyBonus.toFixed(2)}`,
      icon: <FaGift className='text-yellow-600 text-3xl' />,
      bg: 'bg-yellow-50',
    },
    {
      title: 'Monthly Bonus',
      value: `৳${summary.monthlyBonus.toFixed(2)}`,
      icon: <FaCoins className='text-purple-600 text-3xl' />,
      bg: 'bg-purple-50',
    },
    {
      title: 'Total Earnings',
      value: `৳${summary.total.toFixed(2)}`,
      icon: <FaChartLine className='text-pink-600 text-3xl' />,
      bg: 'bg-pink-50',
    },
  ]

  return (
    <div className='p-6 space-y-8'>
      <h1 className='text-3xl font-bold'>Affiliate Earnings Overview</h1>

      {/* Stat Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6'>
        {statCards.map((card, idx) => (
          <Card key={idx}>
            <CardContent className={`flex items-center gap-4 p-6 ${card.bg}`}>
              {card.icon}
              <div>
                <p className='text-sm text-gray-600'>{card.title}</p>
                <p className='text-2xl font-bold'>{card.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Earnings Chart */}
      <Card>
        <CardContent>
          <h2 className='text-xl font-semibold mb-4'>Earnings Over Time</h2>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey='date' />
              <YAxis />
              <Tooltip formatter={(value: number) => `৳${value.toFixed(2)}`} />
              <Bar dataKey='amount' fill='#6366f1' radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Earnings History Table */}
      <Card>
        <CardContent>
          <h2 className='text-xl font-semibold mb-4'>Earnings History</h2>
          <div className='overflow-x-auto'>
            <table className='min-w-full text-left text-sm'>
              <thead>
                <tr className='border-b bg-gray-100'>
                  <th className='p-3'>Date</th>
                  <th className='p-3'>Amount (৳)</th>
                  <th className='p-3'>Type</th>
                  <th className='p-3'>Description</th>
                  <th className='p-3'>Status</th>
                  <th className='p-3'>Method</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, i) => (
                  <tr
                    key={i}
                    className='border-b hover:bg-gray-50 transition-colors'
                  >
                    <td className='p-3'>
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className='p-3 font-semibold'>
                      ৳{item.amount.toFixed(2)}
                    </td>
                    <td className='p-3 capitalize'>
                      {item.type.replace(/([A-Z])/g, ' $1')}
                    </td>
                    <td className='p-3'>{item.description || '-'}</td>
                    <td className='p-3'>
                      <Badge
                        variant={
                          item.status?.toLowerCase() === 'paid'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {item.status || '-'}
                      </Badge>
                    </td>
                    <td className='p-3'>{item.method || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
