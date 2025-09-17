'use client'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { Order } from 'types/purchase-history'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
export default function PaymentMethodSection() {
  const user = useSelector((state: any) => state.auth.user)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${baseURL}/orders/${user.id}`)
        setOrders(res.data)
        setLoading(false)
      } catch (err) {
        console.error(err)
      }
    }

    if (user) fetchOrders()
  }, [user])

  if (loading) return <div>Loading payment methods...</div>

  return (
    <div className='bg-white shadow rounded-lg overflow-hidden'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Payment Method
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Amount
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Status
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Transaction ID
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Date
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {orders.map((order) => (
            <tr key={order._id}>
              <td className='px-6 py-4 whitespace-nowrap'>
                {order.paymentType}
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>৳{order.amount}</td>
              <td className='px-6 py-4 whitespace-nowrap'>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.status === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                {order.transactionId}
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                {new Date(order.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {orders.length === 0 && (
        <div className='p-6 text-gray-600'>No payment records found.</div>
      )}
    </div>
  )
}
