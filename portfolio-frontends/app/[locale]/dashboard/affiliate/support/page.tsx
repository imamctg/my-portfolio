'use client'

import React from 'react'

export default function AffiliateSupportPage() {
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Support</h1>
      <p className='text-gray-600 mb-4'>
        যেকোনো সাহায্যের জন্য নিচের ফর্ম ব্যবহার করুন।
      </p>

      <form className='bg-white shadow rounded-lg p-4 space-y-4'>
        <div>
          <label className='block font-medium'>Subject</label>
          <input type='text' className='mt-1 border rounded px-3 py-2 w-full' />
        </div>
        <div>
          <label className='block font-medium'>Message</label>
          <textarea
            className='mt-1 border rounded px-3 py-2 w-full'
            rows={4}
          ></textarea>
        </div>
        <button className='px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700'>
          Submit
        </button>
      </form>
    </div>
  )
}
