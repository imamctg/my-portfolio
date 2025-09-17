'use client'

import { useEffect, useState } from 'react'
import { api } from 'utils/api'
import Link from 'next/link'

interface Message {
  id: string
  sender: string
  email: string
  subject: string
  read: boolean
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await api.get('/messages')
      setMessages(res.data)
    }
    fetchMessages()
  }, [])

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Client Messages</h1>
      <div className='space-y-3'>
        {messages.map((msg) => (
          <Link
            key={msg.id}
            href={`/dashboard/admin/messages/${msg.id}`}
            className={`block p-4 rounded-lg shadow hover:bg-gray-100 ${
              msg.read ? '' : 'bg-yellow-100'
            }`}
          >
            <p className='font-semibold'>{msg.subject}</p>
            <p className='text-sm text-gray-500'>
              {msg.sender} - {msg.email}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
