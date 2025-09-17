// components/admin/finance/RevenueBreakdownTable.tsx
import { useState } from 'react'

interface RevenueByCategory {
  id: string
  category: string
  revenue: number
  percentage: number
  courseCount: number
}

const initialData: RevenueByCategory[] = [
  {
    id: '1',
    category: 'Web Development',
    revenue: 45000,
    percentage: 32,
    courseCount: 45,
  },
  {
    id: '2',
    category: 'Mobile Development',
    revenue: 38000,
    percentage: 27,
    courseCount: 32,
  },
  {
    id: '3',
    category: 'Data Science',
    revenue: 29000,
    percentage: 21,
    courseCount: 28,
  },
  {
    id: '4',
    category: 'Design',
    revenue: 15000,
    percentage: 11,
    courseCount: 18,
  },
  {
    id: '5',
    category: 'Business',
    revenue: 8000,
    percentage: 6,
    courseCount: 12,
  },
  {
    id: '6',
    category: 'Others',
    revenue: 5000,
    percentage: 3,
    courseCount: 10,
  },
]

export function RevenueBreakdownTable() {
  const [data] = useState<RevenueByCategory[]>(initialData)

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
            >
              Category
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
            >
              Revenue
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
            >
              Percentage
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
            >
              Courses
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {data.map((item) => (
            <tr key={item.id}>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                {item.category}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                ${item.revenue.toLocaleString()}
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                <div className='flex items-center'>
                  <div className='w-full bg-gray-200 rounded-full h-2.5'>
                    <div
                      className='bg-blue-600 h-2.5 rounded-full'
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className='ml-2 text-sm text-gray-500'>
                    {item.percentage}%
                  </span>
                </div>
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {item.courseCount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
