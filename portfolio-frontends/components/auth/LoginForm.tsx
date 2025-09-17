'use client'

import React, { use, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { loginSuccess } from 'features/auth/redux/authSlice'
import { useTranslations } from 'next-intl'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

const LoginForm = () => {
  const t = useTranslations('login')
  const router = useRouter()
  const dispatch = useDispatch()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const redirectPath = searchParams.get('redirect') || '/en/dashboard/admin'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await axios.post(`${baseURL}/auth/login`, {
        email,
        password,
      })

      if (response.data.success) {
        const { token, ...user } = response.data.data
        localStorage.setItem('user', JSON.stringify({ user, token }))
        dispatch(loginSuccess({ user, token }))
        toast.success(t('success'))
        setTimeout(() => {
          router.push(redirectPath)
        }, 1000)
      }
    } catch (error: any) {
      toast.error(t('error'))
    }
  }

  return (
    <form onSubmit={handleLogin} className='flex flex-col gap-4'>
      <input
        type='email'
        placeholder={t('emailPlaceholder')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className='border p-2 rounded'
        required
      />
      <input
        type='password'
        placeholder={t('passwordPlaceholder')}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className='border p-2 rounded'
        required
      />
      <button
        type='submit'
        className='bg-blue-600 text-white py-2 rounded hover:bg-blue-700'
      >
        {t('login')}
      </button>
    </form>
  )
}

export default LoginForm
