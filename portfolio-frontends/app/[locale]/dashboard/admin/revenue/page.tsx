// 'use client'
// import { useAdminRevenue } from 'hooks/useAdminRevenue'
// import { Download } from 'lucide-react'
// import { Button } from 'components/ui/button'
// import { Card, CardContent } from 'components/ui/card'
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts'

// // Dummy data for chart and history (if not available from API)
// const dummyChartData = [
//   { month: 'Jan', revenue: 5000 },
//   { month: 'Feb', revenue: 8000 },
//   { month: 'Mar', revenue: 12000 },
//   { month: 'Apr', revenue: 9000 },
//   { month: 'May', revenue: 15000 },
//   { month: 'Jun', revenue: 18000 },
// ]

// const dummyHistoryData = [
//   {
//     date: '2025-05-01',
//     amount: 5000,
//     status: 'Processed',
//     method: 'Bank Transfer',
//   },
//   {
//     date: '2025-04-15',
//     amount: 3000,
//     status: 'Pending',
//     method: 'Stripe',
//   },
// ]

// export default function RevenuePage() {
//   const { data, isLoading, error } = useAdminRevenue()

//   if (isLoading) return <p className='p-6'>Loading revenue data...</p>
//   if (error) return <p className='p-6 text-red-500'>{error}</p>

//   // Combine API data with dummy data
//   const revenueData = {
//     total: data?.totalRevenue || 0,
//     platform: data?.platformEarnings || 0,
//     pending: data?.pendingRevenue || 0,
//     chart: data?.chartData || dummyChartData,
//     history: data?.paymentHistory || dummyHistoryData,
//   }

//   return (
//     <div className='p-6 space-y-6'>
//       <div className='flex items-center justify-between'>
//         <h1 className='text-2xl font-bold'>Revenue Dashboard</h1>
//         <Button variant='outline'>
//           <Download className='w-4 h-4 mr-2' />
//           Download Report
//         </Button>
//       </div>

//       <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
//         <Card>
//           <CardContent className='p-4'>
//             <p className='text-sm text-gray-500'>Total Revenue</p>
//             <p className='text-2xl font-semibold text-green-600'>
//               ${revenueData.total.toFixed(2)}
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className='p-4'>
//             <p className='text-sm text-gray-500'>Platform Earnings</p>
//             <p className='text-2xl font-semibold text-blue-600'>
//               ${revenueData.platform.toFixed(2)}
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className='p-4'>
//             <p className='text-sm text-gray-500'>Pending Revenue</p>
//             <p className='text-2xl font-semibold text-yellow-600'>
//               ${revenueData.pending.toFixed(2)}
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       <div className='bg-white p-6 rounded-2xl shadow border'>
//         <h2 className='text-lg font-semibold mb-4'>Monthly Revenue</h2>
//         <ResponsiveContainer width='100%' height={300}>
//           <BarChart data={revenueData.chart}>
//             <XAxis dataKey='month' />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey='revenue' fill='#6366f1' radius={[4, 4, 0, 0]} />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       <div className='bg-white p-6 rounded-2xl shadow border'>
//         <h2 className='text-lg font-semibold mb-4'>Payment History</h2>
//         <div className='overflow-x-auto'>
//           <table className='min-w-full text-sm text-left'>
//             <thead>
//               <tr className='border-b bg-gray-50'>
//                 <th className='py-2 px-4'>Date</th>
//                 <th className='py-2 px-4'>Amount</th>
//                 <th className='py-2 px-4'>Status</th>
//                 <th className='py-2 px-4'>Method</th>
//               </tr>
//             </thead>
//             <tbody>
//               {revenueData.history.map((item: any, index: number) => (
//                 <tr key={index} className='border-b hover:bg-gray-50'>
//                   <td className='py-2 px-4'>{item.date}</td>
//                   <td className='py-2 px-4'>${item.amount.toFixed(2)}</td>
//                   <td className='py-2 px-4'>
//                     <span
//                       className={`px-2 py-1 rounded ${
//                         item.status === 'Processed'
//                           ? 'bg-green-100 text-green-800'
//                           : 'bg-yellow-100 text-yellow-800'
//                       }`}
//                     >
//                       {item.status}
//                     </span>
//                   </td>
//                   <td className='py-2 px-4'>{item.method}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   )
// }

'use client'

import { Download, TrendingUp, Users, BookOpen, RefreshCcw } from 'lucide-react'
import { Button } from 'components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts'
import { useAdminRevenue } from 'hooks/useAdminRevenue'
import ExportReportButtons from 'components/ui/ExportReportButtons'

// Dummy data fallback
const dummyMonthly = [
  { month: 'Jan', revenue: 12000 },
  { month: 'Feb', revenue: 18000 },
  { month: 'Mar', revenue: 22000 },
  { month: 'Apr', revenue: 15000 },
  { month: 'May', revenue: 25000 },
  { month: 'Jun', revenue: 30000 },
]

const dummyYearly = [
  { year: '2022', revenue: 120000 },
  { year: '2023', revenue: 200000 },
  { year: '2024', revenue: 350000 },
]

const dummyCourseSplit = [
  { course: 'React Basics', revenue: 30000 },
  { course: 'Node.js Mastery', revenue: 25000 },
  { course: 'UI/UX Design', revenue: 20000 },
]

const dummyInstructorSplit = [
  { instructor: 'John Doe', revenue: 40000 },
  { instructor: 'Jane Smith', revenue: 30000 },
  { instructor: 'Ali Khan', revenue: 25000 },
]

const dummyCommissionSplit = [
  { name: 'Platform', value: 45000 },
  { name: 'Instructors', value: 95000 },
  { name: 'Affiliates', value: 20000 },
]

const dummyRefunds = [
  { month: 'Jan', refunds: 2000 },
  { month: 'Feb', refunds: 1500 },
  { month: 'Mar', refunds: 3000 },
]

const COLORS = ['#6366f1', '#22c55e', '#f59e0b']

export default function RevenuePage() {
  const { data, isLoading, error } = useAdminRevenue()

  if (isLoading) return <p className='p-6'>Loading revenue data...</p>
  if (error) return <p className='p-6 text-red-500'>{error}</p>

  const monthly = data?.monthlyRevenue || dummyMonthly
  const yearly = data?.yearlyRevenue || dummyYearly
  const courseSplit = data?.revenueByCourse || dummyCourseSplit
  const instructorSplit = data?.revenueByInstructor || dummyInstructorSplit
  const commissionSplit = data?.commissionSplit || dummyCommissionSplit
  const refunds = data?.refunds || dummyRefunds

  return (
    <div className='p-6 space-y-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Admin Revenue Dashboard</h1>
        {/* <Button variant='outline'>
          <Download className='w-4 h-4 mr-2' />
          Export Report
        </Button> */}

        <ExportReportButtons
          data={[
            ...monthly,
            ...yearly,
            ...courseSplit,
            ...instructorSplit,
            ...commissionSplit,
            ...refunds,
          ]}
          fileName='admin-revenue'
        />
      </div>

      {/* KPI Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold text-green-600'>
              ${data?.totalRevenue?.toLocaleString() || '450,000'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold text-blue-600'>
              ${data?.platformEarnings?.toLocaleString() || '120,000'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold text-yellow-600'>
              ${data?.pendingRevenue?.toLocaleString() || '25,000'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Instructors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold text-purple-600'>
              {data?.activeInstructors || 45}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card className='p-4'>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={monthly}>
                <XAxis dataKey='month' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='revenue' fill='#6366f1' radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className='p-4'>
          <CardHeader>
            <CardTitle>Yearly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={yearly}>
                <XAxis dataKey='year' />
                <YAxis />
                <Tooltip />
                <Line
                  type='monotone'
                  dataKey='revenue'
                  stroke='#22c55e'
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <Card className='p-4'>
          <CardHeader>
            <CardTitle>Revenue by Course</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2'>
              {courseSplit.map((c: any, idx: number) => (
                <li key={idx} className='flex justify-between'>
                  <span>{c.course}</span>
                  <span className='font-semibold'>
                    ${c.revenue.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className='p-4'>
          <CardHeader>
            <CardTitle>Revenue by Instructor</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2'>
              {instructorSplit.map((i: any, idx: number) => (
                <li key={idx} className='flex justify-between'>
                  <span>{i.instructor}</span>
                  <span className='font-semibold'>
                    ${i.revenue.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className='p-4'>
          <CardHeader>
            <CardTitle>Commission Split</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={250}>
              <PieChart>
                <Pie
                  data={commissionSplit}
                  dataKey='value'
                  nameKey='name'
                  outerRadius={90}
                  label
                >
                  {commissionSplit.map((entry: any, idx: number) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={COLORS[idx % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Refunds */}
      <Card className='p-4'>
        <CardHeader>
          <CardTitle>Refunds & Discounts Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={250}>
            <LineChart data={refunds}>
              <XAxis dataKey='month' />
              <YAxis />
              <Tooltip />
              <Line
                type='monotone'
                dataKey='refunds'
                stroke='#ef4444'
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
