'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
export default function SuccessPage() {
  const token = useSelector((state: RootState) => state.auth.token)
  const [message, setMessage] = useState('Processing payment...')
  const router = useRouter()

  useEffect(() => {
    const confirmAndAssignCourse = async () => {
      if (typeof window === 'undefined') return

      // const baseUrl =
      //   process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || 'http://localhost:5000'

      const queryString = window.location.search
      const params = new URLSearchParams(queryString)
      const tran_id = params.get('tran_id')
      const val_id = params.get('val_id') || 'dummy-validation-id'
      const userId = params.get('userId')
      const courseId = params.get('courseId')

      if (!tran_id || !userId || !courseId) {
        const hasReloaded = sessionStorage.getItem('reloaded')
        if (!hasReloaded) {
          sessionStorage.setItem('reloaded', 'true')
          setTimeout(() => window.location.reload(), 100)
        } else {
          setMessage('⚠️ Invalid or missing URL parameters.')
        }
        return
      }

      // ✅ Wait for token before proceeding
      if (!token) {
        console.warn('⛔ Token not available yet. Retrying shortly...')
        setTimeout(confirmAndAssignCourse, 100) // Retry after delay
        return
      }

      try {
        setMessage(`✅ Payment successful! Confirming with server...`)

        await axios.post(
          `${baseURL}/users/add-course`,
          {
            userId,
            courseId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        setMessage('✅ Payment confirmed and course added! Redirecting...')
        setTimeout(() => {
          router.push('/dashboard/student/my-courses')
        }, 3000)
      } catch (error: any) {
        console.error('❌ Error:', error.message)
        setMessage('❌ Payment failed to confirm. Please contact support.')
      }
    }

    confirmAndAssignCourse()
  }, [token]) // ✅ still depend on token

  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-green-50 text-green-800 p-10'>
      <h1 className='text-3xl font-bold'>🎉 Payment Successful!</h1>
      <p className='mt-4 text-lg'>{message}</p>
      <p className='mt-2 text-sm text-gray-600'>
        Redirecting to your dashboard...
      </p>
    </div>
  )
}
