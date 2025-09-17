'use client'

import { useEffect, useState } from 'react'
import { api } from 'utils/api'

interface CVDownload {
  id: string
  name: string
  email: string
  date: string
}

export default function CVDownloadsPage() {
  const [downloads, setDownloads] = useState<CVDownload[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get('/cv-downloads')
      setDownloads(res.data)
    }
    fetchData()
  }, [])

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>CV Downloads</h1>
      <table className='w-full border-collapse border'>
        <thead>
          <tr className='bg-gray-200'>
            <th className='border p-2'>Name</th>
            <th className='border p-2'>Email</th>
            <th className='border p-2'>Date</th>
          </tr>
        </thead>
        <tbody>
          {downloads.map((d) => (
            <tr key={d.id} className='hover:bg-gray-100'>
              <td className='border p-2'>{d.name}</td>
              <td className='border p-2'>{d.email}</td>
              <td className='border p-2'>
                {new Date(d.date).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
