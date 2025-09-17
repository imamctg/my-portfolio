'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function RevenueChart({ chartData }: { chartData?: any[] }) {
  const fallbackData = [
    { month: 'Jan', revenue: 5000 },
    { month: 'Feb', revenue: 8000 },
    { month: 'Mar', revenue: 12000 },
    { month: 'Apr', revenue: 9000 },
    { month: 'May', revenue: 15000 },
    { month: 'Jun', revenue: 18000 },
  ]

  return (
    <div className='bg-white p-6 rounded-lg shadow mt-10'>
      <h3 className='text-lg font-semibold mb-4 text-gray-800'>
        📊 Revenue Overview
      </h3>
      <ResponsiveContainer width='100%' height={300}>
        <BarChart data={chartData || fallbackData}>
          <XAxis dataKey='month' />
          <YAxis />
          <Tooltip />
          <Bar dataKey='revenue' fill='#6366f1' radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
