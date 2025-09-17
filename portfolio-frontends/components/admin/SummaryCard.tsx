import React from 'react'

const SummaryCard = ({
  title,
  value,
}: {
  title: string
  value: string | number
}) => (
  <div className='bg-white shadow-md rounded-xl p-4'>
    <p className='text-gray-500 text-sm'>{title}</p>
    <h2 className='text-2xl font-bold mt-1'>{value}</h2>
  </div>
)

export default SummaryCard
