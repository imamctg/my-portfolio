'use client'
import React, { Suspense } from 'react'
import LoginForm from 'components/auth/LoginForm'
import Link from 'next/link'
import SearchParamsClient from 'components/common/SearchParamsClient'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'

export const dynamic = 'force-dynamic'

const LoginPage = () => {
  const t = useTranslations('login')
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || ''
  const ref = searchParams.get('ref') || ''

  // const registerUrl = `/auth/register?${
  //   redirect ? `redirect=${redirect}&` : ''
  // }${ref ? `ref=${ref}` : ''}`
  return (
    <div className='max-w-md mx-auto p-6 mt-10 border rounded shadow'>
      <h1 className='text-2xl font-bold mb-6 text-center'>{t('title')}</h1>

      <Suspense fallback={<p className='text-center'>{t('loading')}</p>}>
        <SearchParamsClient />
      </Suspense>

      <LoginForm />

      {/* <p className='text-center mt-2'>
        <Link
          href='/auth/forgot-password'
          className='text-sm text-blue-600 hover:underline'
        >
          {t('forgotPassword')}
        </Link>
      </p> */}

      {/* <p className='text-center mt-4'>
        {t('noAccount')}{' '}
        <Link href={registerUrl} className='text-blue-600 hover:underline'>
          {t('register')}
        </Link>
      </p> */}
    </div>
  )
}

export default LoginPage
