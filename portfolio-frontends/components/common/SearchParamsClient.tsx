'use client'

import { useSearchParams } from 'next/navigation'

const SearchParamsClient = () => {
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref')
  const error = searchParams.get('error')
  const success = searchParams.get('success')

  return (
    <div className='mb-4 text-center'>
      {ref && <p className='text-sm text-gray-600'>Referral: {ref}</p>}
      {error && (
        <p className='text-sm text-red-600 bg-red-100 p-2 rounded'>{error}</p>
      )}
      {success && (
        <p className='text-sm text-green-600 bg-green-100 p-2 rounded'>
          {success}
        </p>
      )}
    </div>
  )
}

export default SearchParamsClient
