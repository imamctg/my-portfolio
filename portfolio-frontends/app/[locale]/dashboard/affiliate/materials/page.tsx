'use client'

import React from 'react'

export default function AffiliateMaterialsPage() {
  const banners = [
    { title: 'Banner 1', url: '/images/banner1.jpg' },
    { title: 'Banner 2', url: '/images/banner2.jpg' },
  ]

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Marketing Materials</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {banners.map((b, i) => (
          <div key={i} className='bg-white shadow rounded-lg p-4'>
            <h2 className='font-semibold mb-2'>{b.title}</h2>
            <img src={b.url} alt={b.title} className='rounded-lg' />
          </div>
        ))}
      </div>
    </div>
  )
}
