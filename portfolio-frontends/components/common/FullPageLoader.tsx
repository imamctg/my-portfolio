import React from 'react'

const FullPageLoader = () => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50'>
      <div className='flex flex-col items-center'>
        <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500'></div>
        <p className='mt-4 text-lg font-medium text-gray-700'>Loading...</p>
      </div>
    </div>
  )
}

export default FullPageLoader
