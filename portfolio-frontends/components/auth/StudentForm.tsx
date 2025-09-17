'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import PasswordHints from './PasswordHints'
import ReCAPTCHA from 'react-google-recaptcha'
import { useTranslations } from 'next-intl'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
export default function StudentForm() {
  const t = useTranslations('studentForm')
  const router = useRouter()
  const searchParams = useSearchParams()
  const [agreePolicy, setAgreePolicy] = useState(false)
  const redirectParam = searchParams.get('redirect')
  const refParam = searchParams.get('ref')

  let redirectPath = '/'
  if (redirectParam) {
    const url = new URL(redirectParam, 'http://dummy-base')
    if (refParam) {
      url.searchParams.set('ref', refParam)
    }
    redirectPath = url.pathname + url.search
  }

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [recaptchaToken, setRecaptchaToken] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const queryReferrerId = searchParams.get('ref')

    if (queryReferrerId) {
      localStorage.setItem(
        'referrer',
        JSON.stringify({
          id: queryReferrerId,
          expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
        })
      )
    } else {
      // 🛠️ No ref in URL → remove referrer from localStorage
      localStorage.removeItem('referrer')
    }
  }, [searchParams])

  const validatePassword = (password: string) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: string[] = []

    if (!name) errs.push('Name is required.')
    if (!email) errs.push('Email is required.')
    if (!validatePassword(password)) errs.push('Password is too weak.')
    if (password !== confirmPassword) errs.push('Passwords do not match.')
    if (!recaptchaToken) errs.push('Please verify that you are not a robot.')
    if (!agreePolicy)
      errs.push('You must agree to the terms and privacy policy.')

    if (errs.length) {
      setErrors(errs)
      return
    }

    try {
      setSubmitting(true)

      // Optional referrerId logic
      let referrerId = null
      const referrerData = localStorage.getItem('referrer')
      if (referrerData) {
        const parsed = JSON.parse(referrerData)
        if (parsed.expires > Date.now()) {
          referrerId = parsed.id
        } else {
          localStorage.removeItem('referrer')
        }
      }

      await axios.post(`${baseURL}/auth/register`, {
        name,
        email,
        password,
        confirmPassword,
        role: 'student',
        token: recaptchaToken,
        referrerId, // ✅ Send referrerId if exists
      })

      toast.success('Student registration successful!')
      router.push(`/auth/login?redirect=${redirectPath}`)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12'>
      <div className='max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-xl'>
        <div className='text-center'>
          <h2 className='text-3xl font-bold text-blue-600'>{t('title')}</h2>
          <p className='text-gray-500 text-sm mt-1'>{t('subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <input
            type='text'
            placeholder='Full Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />

          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />

          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />

          {password && <PasswordHints password={password} />}

          <input
            type='password'
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className='w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />

          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={(token) => setRecaptchaToken(token || '')}
          />

          {errors.length > 0 && (
            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded'>
              <ul className='list-disc list-inside'>
                {errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <div className='flex items-start gap-2 text-sm text-gray-700'>
            <input
              type='checkbox'
              id='agree'
              checked={agreePolicy}
              onChange={() => setAgreePolicy(!agreePolicy)}
              className='mt-1'
            />
            <label htmlFor='agree' className='leading-5'>
              {t('terms')}{' '}
              <a
                href='/terms-conditions?role=student'
                target='_blank'
                className='text-blue-600 hover:underline'
              >
                {t('termsLink')}
              </a>{' '}
              {t('and')}{' '}
              <a
                href='/privacy-policy'
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 hover:underline'
              >
                {t('privacyLink')}
              </a>
              .
            </label>
          </div>

          <button
            type='submit'
            disabled={submitting || !recaptchaToken}
            className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50'
          >
            {submitting ? t('registering') : t('register')}
          </button>
        </form>
      </div>
    </div>
  )
}
