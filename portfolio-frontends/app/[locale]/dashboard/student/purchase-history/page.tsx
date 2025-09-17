'use client'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { RootState } from 'features/redux/store'
import { Purchase } from 'types/purchase-history'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
export default function PurchaseHistoryPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const user = useSelector((state: RootState) => state.auth.user)

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!user?.id) return
      try {
        const res = await axios.get(`${baseURL}/orders/${user.id}`)
        setPurchases(res.data)
      } catch (err) {
        console.error('Failed to fetch purchases', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPurchases()
  }, [user?._id])

  return (
    <div className='p-4 md:p-8'>
      <h1 className='text-2xl font-bold mb-6 text-center'>Purchase History</h1>

      {loading ? (
        <p className='text-center text-gray-500'>Loading...</p>
      ) : purchases.length === 0 ? (
        <p className='text-center text-gray-500'>No purchase history found.</p>
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full border border-gray-200 shadow rounded-lg overflow-hidden'>
            <thead className='bg-gray-100 text-gray-700'>
              <tr className='text-sm md:text-base text-left'>
                <th className='p-3'>Course</th>
                <th className='p-3'>Payment Method</th>
                <th className='p-3'>Amount</th>
                <th className='p-3'>Status</th>
                <th className='p-3'>Transaction ID</th>
                <th className='p-3'>Date</th>
              </tr>
            </thead>
            <tbody className='text-sm md:text-base text-gray-800 divide-y'>
              {purchases.map((item) => (
                <tr key={item._id} className='hover:bg-gray-50'>
                  <td className='p-3'>
                    {item.courseId?.title || 'Course not available'}
                  </td>
                  <td className='p-3 capitalize'>{item.paymentType}</td>
                  <td className='p-3 font-semibold'>${item.amount}</td>
                  <td className='p-3'>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'success'
                          ? 'bg-green-100 text-green-700'
                          : item.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className='p-3'>{item.transactionId}</td>
                  <td className='p-3'>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
