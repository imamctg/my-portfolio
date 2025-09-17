// 'use client'

// import React, { useState } from 'react'
// import axios from 'axios'
// import toast from 'react-hot-toast'
// import { useTranslations } from 'next-intl'

// const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

// const ForgotPasswordPage = () => {
//   const [email, setEmail] = useState('')
//   const [loading, setLoading] = useState(false)
//   const t = useTranslations('forgotPassword')

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     try {
//       await axios.post(`${baseURL}/auth/forgot-password`, { email })
//       toast.success(t('emailSent'))
//     } catch (error: any) {
//       toast.error(t('error') || 'Failed to send reset link')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className='max-w-md mx-auto p-6 mt-10 border rounded shadow'>
//       <h1 className='text-2xl font-bold mb-6 text-center'>{t('title')}</h1>
//       <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
//         <input
//           type='email'
//           placeholder={t('emailPlaceholder')}
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className='border p-2 rounded'
//           required
//         />
//         <button
//           type='submit'
//           disabled={loading}
//           className='bg-blue-600 text-white py-2 rounded hover:bg-blue-700'
//         >
//           {loading ? t('sending') : t('sendLink')}
//         </button>
//       </form>
//     </div>
//   )
// }

// export default ForgotPasswordPage
