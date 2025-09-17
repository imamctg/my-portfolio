'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

interface ErrorPageProps {
  message?: string
  statusCode?: number
  showRetry?: boolean
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  message = 'An unexpected error occurred',
  statusCode,
  showRetry = true,
}) => {
  const router = useRouter()

  const handleRetry = () => {
    router.refresh() // app router uses refresh instead of reload
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4'>
      <div className='max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center'>
        {/* ...rest of the JSX unchanged */}
      </div>
    </div>
  )
}

export default ErrorPage
