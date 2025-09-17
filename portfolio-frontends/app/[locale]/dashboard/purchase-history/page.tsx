'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Order } from 'types/purchase-history'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
const PurchaseHistoryPage = () => {
  const [orders, setOrders] = useState<Order[]>([])

  const userId =
    typeof window !== 'undefined' ? localStorage.getItem('userId') : null

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${baseURL}/orders/${userId}`)
        setOrders(res.data)
      } catch (err) {
        console.error('Failed to fetch orders', err)
      }
    }

    if (userId) fetchOrders()
  }, [userId])

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-semibold mb-4'>My Purchase History</h2>
      <div className='grid grid-cols-1 gap-4'>
        {orders.map((order) => (
          <div key={order._id} className='bg-white rounded-xl shadow p-4'>
            <p>
              <strong>Course:</strong> {order.courseId?.title}
            </p>
            <p>
              <strong>Amount:</strong> ${order.amount}
            </p>
            <p>
              <strong>Payment Type:</strong> {order.paymentType}
            </p>
            <p>
              <strong>Date:</strong>{' '}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
            {order.receiptUrl && (
              <p>
                <a
                  href={order.receiptUrl}
                  target='_blank'
                  className='text-blue-500 underline'
                >
                  View Receipt
                </a>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PurchaseHistoryPage
