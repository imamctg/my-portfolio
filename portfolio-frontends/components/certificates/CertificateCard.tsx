'use client'

import React from 'react'

type Props = {
  studentName: string
  courseName: string
  completionDate: string
}

const CertificateCard: React.FC<Props> = ({
  studentName,
  courseName,
  completionDate,
}) => {
  return (
    <div className='w-full max-w-4xl mx-auto border-4 border-yellow-500 rounded-2xl p-8 bg-white shadow-xl font-serif text-gray-800 relative overflow-hidden'>
      <div className='text-center mb-6'>
        <h1 className='text-3xl font-bold uppercase tracking-wide text-yellow-600'>
          Certificate of Completion
        </h1>
      </div>

      <p className='text-lg text-center my-4'>This is to certify that</p>

      <h2 className='text-2xl font-bold text-center text-gray-900 my-2 underline decoration-yellow-500'>
        {studentName}
      </h2>

      <p className='text-lg text-center mt-4'>
        has successfully completed the course
      </p>

      <h3 className='text-xl font-semibold text-center text-blue-700 mt-2 italic'>
        "{courseName}"
      </h3>

      <p className='text-md text-center text-gray-600 mt-8'>
        Date of Completion:{' '}
        <span className='font-medium'>{completionDate}</span>
      </p>

      {/* Optional Signature / Logo */}
      <div className='flex justify-between items-end mt-10'>
        <div className='text-left'>
          <p className='text-sm'>Instructor</p>
          <div className='w-32 h-0.5 bg-gray-400 mt-1 mb-2'></div>
        </div>
        <div className='text-right'>
          <p className='text-sm'>Authorized By</p>
          <div className='w-32 h-0.5 bg-gray-400 mt-1 mb-2'></div>
        </div>
      </div>
    </div>
  )
}

export default CertificateCard
