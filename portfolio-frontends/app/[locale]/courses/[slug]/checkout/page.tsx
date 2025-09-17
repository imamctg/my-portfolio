// 'use client'

// import React, { useEffect, useState } from 'react'
// import { useParams, useRouter, useSearchParams } from 'next/navigation'
// import axios from 'axios'
// import { useSelector } from 'react-redux'
// import { RootState } from 'features/redux/store'

// const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
// const CheckoutPage = () => {
//   const params = useParams()
//   const router = useRouter()
//   const slug = params?.slug as string
//   // const courseId = params?.courseId as string
//   const token = useSelector((state: RootState) => state.auth.token)
//   const user = useSelector((state: RootState) => state.auth.user)
//   const [course, setCourse] = useState<any>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [couponCode, setCouponCode] = useState('')
//   const [discount, setDiscount] = useState(0)
//   const [couponError, setCouponError] = useState('')
//   const [finalPrice, setFinalPrice] = useState<number | null>(null)
//   const searchParams = useSearchParams()

//   useEffect(() => {
//     const refFromQuery = searchParams.get('ref')
//     if (refFromQuery) {
//       localStorage.setItem(
//         'referrer',
//         JSON.stringify({
//           id: refFromQuery,
//           expires: Date.now() + 30 * 24 * 60 * 60 * 1000, // ৩০ দিন
//         })
//       )
//     }
//   }, [searchParams])
//   const handleApplyCoupon = async () => {
//     if (!couponCode || !course) return

//     try {
//       const response = await axios.post(
//         `${baseURL}/coupon/apply`,
//         {
//           code: couponCode,
//           courseId: course._id,
//           userId: user.id,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             // 'Content-Type': 'application/json',
//           },
//         }
//       )

//       const { discountAmount } = response.data
//       const newPrice = course.price - discountAmount

//       setDiscount(discountAmount)
//       setFinalPrice(newPrice)
//       setCouponError('')
//     } catch (err: any) {
//       console.error('Coupon error:', err)
//       setCouponError(
//         err?.response?.data?.message || 'Invalid or expired coupon.'
//       )
//       setDiscount(0)
//       setFinalPrice(null)
//     }
//   }

//   useEffect(() => {
//     if (!user && slug) {
//       const refData = localStorage.getItem('referrer')
//       const ref = refData ? JSON.parse(refData)?.id : null

//       const redirectURL = ref
//         ? `/auth/login?redirect=/courses/${slug}/checkout?ref=${ref}`
//         : `/auth/login?redirect=/courses/${slug}/checkout`

//       router.push(redirectURL)
//     }
//   }, [user, router, slug])

//   // কোর্স ডেটা লোড করো
//   useEffect(() => {
//     if (slug) {
//       axios
//         .get(`${baseURL}/courses/${slug}`)
//         .then((res) => {
//           setCourse(res.data.data)
//           setLoading(false)
//         })
//         .catch(() => {
//           setError('Course not found.')
//           setLoading(false)
//         })
//     }
//   }, [slug])
//   console.log(course, 'course in checkout page')

//   // ✅ Step 1: tran_id তৈরি করে অর্ডার বানাও, এরপর initiate-payment API কল করো
//   const handleEnroll = async (paymentType: 'sslcommerz' | 'bkash') => {
//     if (!course || !user) return

//     setLoading(true)
//     setError(null)

//     try {
//       const tran_id = `tran_${Date.now()}`
//       const amountToPay = finalPrice ?? course.price

//       const referrerData = localStorage.getItem('referrer')
//       let referrerId = null

//       if (referrerData) {
//         const parsed = JSON.parse(referrerData)
//         if (parsed.expires > Date.now()) {
//           referrerId = parsed.id
//         } else {
//           localStorage.removeItem('referrer') // expired
//         }
//       }
//       const discountPercent = discount > 0 ? (discount / course.price) * 100 : 0

//       const orderResponse = await axios.post(`${baseURL}/orders`, {
//         userId: user.id,
//         courseId: course._id,
//         originalPrice: course.price,
//         discountAmount: discount, // 👈 কুপনের মাধ্যমে কত ছাড় হয়েছে
//         finalPrice: amountToPay,
//         status: 'pending',
//         transactionId: tran_id,
//         paymentType: paymentType,
//         couponCode: discount > 0 ? couponCode : null, // optional: store it
//         referrerId: referrerId || null,
//         discountPercent: discountPercent,
//       })

//       const order = orderResponse.data

//       if (paymentType === 'sslcommerz') {
//         const response = await axios.post(
//           `${baseURL}/payment/initiate-payment`,
//           {
//             // amount: course.price,
//             amount: amountToPay, // after applying discount

//             courseTitle: course.title,
//             userEmail: user.email,
//             userId: user.id,
//             courseId: course._id,
//             orderId: order._id,
//             transactionId: tran_id,
//           }
//         )

//         if (response.data?.url) {
//           window.location.href = response.data.url
//         } else {
//           setError('Could not get payment URL.')
//         }
//       } else if (paymentType === 'bkash') {
//         const response = await axios.post(`${baseURL}/payment/initiate-bkash`, {
//           amount: course.price,
//           courseTitle: course.title,
//           userEmail: user.email,
//           userId: user.id,
//           courseId: course._id,
//           orderId: order._id,
//           transactionId: tran_id,
//         })

//         if (response.data?.bkashURL) {
//           window.location.href = response.data.bkashURL
//         } else {
//           setError('Could not get bKash payment URL.')
//         }
//       }
//     } catch (err: any) {
//       console.error('❌ Payment error:', err)
//       setError('Something went wrong.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (!user) {
//     return (
//       <div className='min-h-screen flex justify-center items-center'>
//         <p>Redirecting to login...</p>
//       </div>
//     )
//   }

//   if (loading) {
//     return (
//       <div className='min-h-screen flex items-center justify-center'>
//         <p className='text-lg'>Loading...</p>
//       </div>
//     )
//   }

//   if (error || !course) {
//     return (
//       <div className='min-h-screen flex items-center justify-center'>
//         <h1 className='text-xl text-red-600'>{error || 'Course not found.'}</h1>
//       </div>
//     )
//   }

//   return (
//     <div className='min-h-screen flex items-center justify-center p-8'>
//       <div className='max-w-xl w-full bg-white rounded-lg shadow-lg p-8'>
//         <h1 className='text-3xl font-bold mb-6'>Checkout</h1>

//         <h2 className='text-2xl font-semibold mb-4'>{course.title}</h2>
//         <p className='text-gray-600 mb-6'>{course.description}</p>
//         <div className='text-2xl font-bold text-blue-600 mb-6'>
//           ${course.price}
//         </div>

//         {/* যদি discount থাকে, তাহলে Final Price দেখাও */}
//         {discount > 0 && finalPrice !== null && (
//           <div className='mb-4'>
//             <p className='text-gray-500 line-through'>
//               Original: ${course.price}
//             </p>
//             <p className='text-xl font-semibold text-green-600'>
//               Discounted Price: ${finalPrice}
//             </p>
//           </div>
//         )}
//         {/* Coupon input */}
//         <div className='mb-6'>
//           <label
//             htmlFor='coupon'
//             className='block text-sm font-medium text-gray-700'
//           >
//             Have a coupon?
//           </label>
//           <div className='mt-1 flex'>
//             <input
//               type='text'
//               id='coupon'
//               value={couponCode}
//               onChange={(e) => setCouponCode(e.target.value)}
//               className='flex-1 border border-gray-300 rounded-l px-4 py-2'
//               placeholder='Enter coupon code'
//             />
//             <button
//               onClick={handleApplyCoupon}
//               className='bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700'
//             >
//               Apply
//             </button>
//           </div>
//           {couponError && (
//             <p className='text-red-500 text-sm mt-1'>{couponError}</p>
//           )}
//           {discount > 0 && (
//             <p className='text-green-600 text-sm mt-1'>
//               Coupon applied! You saved ${discount}
//             </p>
//           )}
//         </div>

//         {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
//         <button
//           onClick={() => handleEnroll('sslcommerz')}
//           disabled={loading}
//           className='w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded text-lg disabled:opacity-50 disabled:cursor-not-allowed mb-4'
//         >
//           {loading ? 'Redirecting...' : 'Pay with SSLCommerz'}
//         </button>

//         <button
//           onClick={() => handleEnroll('bkash')}
//           disabled={loading}
//           className='w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded text-lg disabled:opacity-50 disabled:cursor-not-allowed'
//         >
//           {loading ? 'Redirecting...' : 'Pay with bKash'}
//         </button>
//       </div>
//     </div>
//   )
// }

// export default CheckoutPage

'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'
import { toast } from 'react-hot-toast'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

// ✅ Utility: Valid Referrer Getter
const getValidReferrerId = () => {
  const referrerData = localStorage.getItem('referrer')
  if (referrerData) {
    const parsed = JSON.parse(referrerData)
    if (parsed.expires > Date.now()) {
      return parsed.id
    } else {
      localStorage.removeItem('referrer')
    }
  }
  return null
}

const CheckoutPage = () => {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string
  const token = useSelector((state: RootState) => state.auth.token)
  const user = useSelector((state: RootState) => state.auth.user)
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')
  const [finalPrice, setFinalPrice] = useState<number | null>(null)
  const [applyingCoupon, setApplyingCoupon] = useState(false)

  const searchParams = useSearchParams()

  useEffect(() => {
    const refFromQuery = searchParams.get('ref')
    if (refFromQuery) {
      localStorage.setItem(
        'referrer',
        JSON.stringify({
          id: refFromQuery,
          expires: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
        })
      )
    }
  }, [searchParams])

  const handleApplyCoupon = async () => {
    if (!couponCode || !course || !user) return

    setApplyingCoupon(true)
    try {
      const response = await axios.post(
        `${baseURL}/coupon/apply`,
        {
          code: couponCode,
          courseId: course._id,
          userId: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const { discountAmount } = response.data
      const newPrice = course.price - discountAmount

      setDiscount(discountAmount)
      setFinalPrice(newPrice)
      setCouponError('')
      toast.success(`Coupon applied! You saved $${discountAmount}`)
    } catch (err: any) {
      console.error('Coupon error:', err)
      const message =
        err?.response?.data?.message || 'Invalid or expired coupon.'
      setCouponError(message)
      setDiscount(0)
      setFinalPrice(null)
      toast.error(message)
    } finally {
      setApplyingCoupon(false)
    }
  }

  useEffect(() => {
    if (!user && slug) {
      const ref = getValidReferrerId()
      const redirectURL = ref
        ? `/auth/login?redirect=/courses/${slug}/checkout?ref=${ref}`
        : `/auth/login?redirect=/courses/${slug}/checkout`

      router.push(redirectURL)
    }
  }, [user, router, slug])

  useEffect(() => {
    if (slug) {
      axios
        .get(`${baseURL}/courses/${slug}`)
        .then((res) => {
          setCourse(res.data.data)
        })
        .catch(() => {
          setError('Course not found.')
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [slug])

  const handleEnroll = async (paymentType: 'sslcommerz' | 'bkash') => {
    if (!course || !user) return

    setLoading(true)
    setError(null)

    try {
      const tran_id = `tran_${Date.now()}`
      const amountToPay = finalPrice ?? course.price
      const referrerId = getValidReferrerId()
      const discountPercent = discount > 0 ? (discount / course.price) * 100 : 0

      const orderResponse = await axios.post(`${baseURL}/orders`, {
        userId: user.id,
        courseId: course._id,
        amount: amountToPay,
        discountAmount: discount,
        finalPrice: amountToPay,
        status: 'pending',
        transactionId: tran_id,
        paymentType,
        couponCode: discount > 0 ? couponCode : null,
        referrerId,
        discountPercent,
      })

      const order = orderResponse.data

      if (paymentType === 'sslcommerz') {
        const response = await axios.post(
          `${baseURL}/payment/initiate-payment`,
          {
            amount: amountToPay,
            courseTitle: course.title,
            userEmail: user.email,
            userId: user.id,
            courseId: course._id,
            orderId: order._id,
            transactionId: tran_id,
            referrerId: referrerId || null,
          }
        )

        if (response.data?.url) {
          window.location.href = response.data.url
        } else {
          setError('Could not get payment URL.')
        }
      } else if (paymentType === 'bkash') {
        const response = await axios.post(`${baseURL}/payment/initiate-bkash`, {
          amount: amountToPay,
          courseTitle: course.title,
          userEmail: user.email,
          userId: user.id,
          courseId: course._id,
          orderId: order._id,
          transactionId: tran_id,
        })

        if (response.data?.bkashURL) {
          window.location.href = response.data.bkashURL
        } else {
          setError('Could not get bKash payment URL.')
        }
      }
    } catch (err: any) {
      console.error('❌ Payment error:', err)
      setError('Something went wrong. Please try again later.')
      toast.error('Payment failed. Try again.')
      router.push('/payment/fail')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className='min-h-screen flex justify-center items-center'>
        <p>Redirecting to login...</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-lg animate-pulse'>Loading course info...</p>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <h1 className='text-xl text-red-600'>{error || 'Course not found.'}</h1>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-8'>
      <div className='max-w-xl w-full bg-white rounded-lg shadow-lg p-8'>
        <h1 className='text-3xl font-bold mb-6'>Checkout</h1>

        <h2 className='text-2xl font-semibold mb-4'>{course.title}</h2>
        <p className='text-gray-600 mb-6'>{course.description}</p>
        <div className='text-2xl font-bold text-blue-600 mb-6'>
          ${course.price}
        </div>

        {discount > 0 && finalPrice !== null && (
          <div className='mb-4'>
            <p className='text-gray-500 line-through'>
              Original: ${course.price}
            </p>
            <p className='text-xl font-semibold text-green-600'>
              Discounted Price: ${finalPrice}
            </p>
          </div>
        )}

        <div className='mb-6'>
          <label
            htmlFor='coupon'
            className='block text-sm font-medium text-gray-700'
          >
            Have a coupon?
          </label>
          <div className='mt-1 flex'>
            <input
              type='text'
              id='coupon'
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className='flex-1 border border-gray-300 rounded-l px-4 py-2'
              placeholder='Enter coupon code'
            />
            <button
              onClick={handleApplyCoupon}
              disabled={applyingCoupon}
              className='bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 disabled:opacity-50'
            >
              {applyingCoupon ? 'Applying...' : 'Apply'}
            </button>
          </div>
          {couponError && (
            <p className='text-red-500 text-sm mt-1'>{couponError}</p>
          )}
          {discount > 0 && (
            <p className='text-green-600 text-sm mt-1'>
              Coupon applied! You saved ${discount}
            </p>
          )}
        </div>

        {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
        <button
          onClick={() => handleEnroll('sslcommerz')}
          disabled={loading}
          className='w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded text-lg disabled:opacity-50 disabled:cursor-not-allowed mb-4'
        >
          {loading ? 'Redirecting...' : 'Pay with SSLCommerz'}
        </button>

        <button
          onClick={() => handleEnroll('bkash')}
          disabled={loading}
          className='w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded text-lg disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? 'Redirecting...' : 'Pay with bKash'}
        </button>
      </div>
    </div>
  )
}

export default CheckoutPage
