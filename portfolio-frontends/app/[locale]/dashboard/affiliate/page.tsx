'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'
import {
  FaMousePointer,
  FaUserCheck,
  FaMoneyBillWave,
  FaHourglassHalf,
} from 'react-icons/fa'
import ReferralLinkBox from 'components/Dashboard/ReferralLinkBox'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
const frontendURL = process.env.NEXT_PUBLIC_FRONTEND_URL

export default function AffiliateDashboardPage() {
  const user = useSelector((state: RootState) => state.auth.user)
  const token = useSelector((state: RootState) => state.auth.token)

  const [stats, setStats] = useState({
    totalClicks: 0,
    conversions: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
  })

  const [history, setHistory] = useState([])

  //   useEffect(() => {
  //     const fetchStats = async () => {
  //       if (!user?.id || !token) return

  //       try {
  //         const res = await axios.get(`${baseURL}/affiliate/stats`, {
  //           headers: { Authorization: `Bearer ${token}` },
  //         })

  //         setStats({
  //           totalClicks: res.data.totalClicks || 0,
  //           conversions: res.data.conversions || 0,
  //           totalEarnings: res.data.totalEarnings || 0,
  //           pendingEarnings: res.data.pendingEarnings || 0,
  //         })
  //       } catch (error) {
  //         console.error('❌ Error loading affiliate stats', error)
  //       }
  //     }

  //     fetchStats()
  //   }, [user?.id, token])
  useEffect(() => {
    if (!user?.id || !token) return

    const fetchData = async () => {
      const statsRes = await axios.get(`${baseURL}/affiliate/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setStats(statsRes.data)

      const earningsRes = await axios.get(`${baseURL}/affiliate/earnings`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log(earningsRes.data, 'earningsRes.data')
      setHistory(earningsRes.data.history)
    }

    fetchData()
  }, [user?.id, token])

  const statCards = [
    {
      title: 'Total Clicks',
      value: stats.totalClicks,
      icon: <FaMousePointer className='text-blue-500 text-3xl' />,
      bg: 'bg-blue-50',
    },
    {
      title: 'Conversions',
      value: stats.conversions,
      icon: <FaUserCheck className='text-green-500 text-3xl' />,
      bg: 'bg-green-50',
    },
    {
      title: 'Total Earnings (BDT)',
      value: `৳${stats.totalEarnings}`,
      icon: <FaMoneyBillWave className='text-yellow-500 text-3xl' />,
      bg: 'bg-yellow-50',
    },
    {
      title: 'Pending Earnings (BDT)',
      value: `৳${stats.pendingEarnings}`,
      icon: <FaHourglassHalf className='text-purple-500 text-3xl' />,
      bg: 'bg-purple-50',
    },
  ]

  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-2 text-gray-800'>
        👋 Welcome, {user?.name}
      </h1>
      <p className='text-gray-500 mb-8'>
        Here’s how your affiliate performance is going this month.
      </p>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`${card.bg} rounded-xl p-5 shadow hover:shadow-lg transition`}
          >
            <div className='flex items-center gap-4'>
              {card.icon}
              <div>
                <h3 className='text-sm text-gray-500'>{card.title}</h3>
                <p className='text-2xl font-bold text-gray-800'>{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Referral Links */}
      <div className='mt-10'>
        <h2 className='text-2xl font-bold mb-4 text-gray-800'>
          📢 Your Affiliate Links
        </h2>
        <div className='space-y-6'>
          <ReferralLinkBox
            label='🛍 Promote All Courses'
            url={`${frontendURL}/courses?ref=${user?.id}`}
          />
          <ReferralLinkBox
            label='👤 Refer a Student to Sign Up'
            url={`${frontendURL}/auth/register?ref=${user?.id}`}
          />
        </div>
      </div>
    </div>
  )
}
