'use client'

import Link from 'next/link'
import { useEffect } from 'react'

interface Message {
  _id: string
  senderId: string
  receiverId: string
  senderName: string
  receiverName: string
  text: string
  createdAt: string
  read: boolean
}

interface Props {
  title: string
  messages: Message[]
  currentUserId: string
  type: 'inbox' | 'sent'
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
export default function MessageList({
  title,
  messages,
  currentUserId,
  type,
}: Props) {
  useEffect(() => {
    const markAsRead = async () => {
      if (type !== 'inbox') return

      const unreadMessages = messages.filter((m) => !m.read)
      if (unreadMessages.length === 0) return

      try {
        await Promise.all(
          unreadMessages.map((msg) =>
            fetch(`${baseURL}/message/read/${msg._id}`, {
              method: 'PUT',
            })
          )
        )
      } catch (error) {
        console.error('❌ Failed to mark messages as read:', error)
      }
    }

    markAsRead()
  }, [messages, type])

  return (
    <div className='my-6'>
      <h2 className='text-xl font-semibold mb-4'>{title}</h2>

      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <ul className='space-y-4'>
          {messages.map((msg) => (
            <li
              key={msg._id}
              className={`border p-4 rounded-md shadow-sm ${
                !msg.read && type === 'inbox' ? 'bg-yellow-50' : ''
              }`}
            >
              <p>
                ✅ Message{' '}
                {type === 'inbox' ? (
                  <>
                    from{' '}
                    <Link
                      href={`/profile/${msg.senderId}`}
                      className='text-blue-600 underline'
                    >
                      {msg.senderName}
                    </Link>
                  </>
                ) : (
                  <>
                    to{' '}
                    <Link
                      href={`/profile/${msg.receiverId}`}
                      className='text-green-600 underline'
                    >
                      {msg.receiverName}
                    </Link>
                  </>
                )}
              </p>
              <p className='mt-2'>{msg.text}</p>
              <p className='text-sm text-gray-500 mt-1'>
                Sent at: {new Date(msg.createdAt).toLocaleString()}
              </p>
              {!msg.read && type === 'inbox' && (
                <span className='inline-block bg-red-500 text-white text-xs px-2 py-1 rounded ml-2'>
                  Unread
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
