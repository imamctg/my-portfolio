'use client'

import { useEffect, useState } from 'react'
import { api } from 'utils/api'

interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  date: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await api.get('/notifications')
      setNotifications(res.data)
    }
    fetchNotifications()
  }, [])

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Notifications</h1>
      <div className='space-y-2'>
        {notifications.map((note) => (
          <div
            key={note.id}
            className={`p-4 rounded-lg shadow hover:bg-gray-100 ${
              note.read ? '' : 'bg-blue-100'
            }`}
          >
            <p className='font-semibold'>{note.title}</p>
            <p className='text-gray-500'>{note.message}</p>
            <p className='text-xs text-gray-400'>
              {new Date(note.date).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
