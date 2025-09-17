// 'use client'

// import React, { useState } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import axios from 'axios'
// import toast from 'react-hot-toast'
// import { useTranslations } from 'next-intl'

// const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

// const ResetPasswordPage = () => {
//   const { token } = useParams()
//   const router = useRouter()
//   const t = useTranslations('resetPassword')

//   const [password, setPassword] = useState('')
//   const [confirmPassword, setConfirmPassword] = useState('')
//   const [loading, setLoading] = useState(false)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (password !== confirmPassword) {
//       toast.error(t('mismatch'))
//       return
//     }
//     setLoading(true)
//     try {
//       await axios.post(`${baseURL}/auth/reset-password/${token}`, {
//         password,
//       })
//       toast.success(t('success'))
//       router.push('/auth/login')
//     } catch (err) {
//       toast.error(t('error'))
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className='max-w-md mx-auto p-6 mt-10 border rounded shadow'>
//       <h1 className='text-2xl font-bold mb-6 text-center'>{t('title')}</h1>
//       <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
//         <input
//           type='password'
//           placeholder={t('newPassword')}
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className='border p-2 rounded'
//           required
//         />
//         <input
//           type='password'
//           placeholder={t('confirmPassword')}
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           className='border p-2 rounded'
//           required
//         />
//         <button
//           type='submit'
//           disabled={loading}
//           className='bg-green-600 text-white py-2 rounded hover:bg-green-700'
//         >
//           {loading ? t('updating') : t('update')}
//         </button>
//       </form>
//     </div>
//   )
// }

// export default ResetPasswordPage
