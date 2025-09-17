// components/shared/MessageForm.tsx
'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

interface MessageFormProps {
  senderId: string
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
export default function MessageForm({ senderId }: MessageFormProps) {
  const [users, setUsers] = useState([])
  const [receiverId, setReceiverId] = useState('')
  const [text, setText] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get(`${baseURL}/users`)
      setUsers(res.data.users)
    }
    fetchUsers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post(`${baseURL}/message/send`, {
        senderId,
        receiverId,
        text,
      })
      setStatus('✅ Message sent successfully!')
      setReceiverId('')
      setText('')
    } catch (err) {
      console.error(err)
      setStatus('❌ Failed to send message.')
    }
  }

  return (
    <div className='max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded'>
      <h1 className='text-2xl font-bold mb-4'>Send Message</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block mb-1 font-medium'>Select Receiver</label>
          <select
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            className='w-full border border-gray-300 rounded px-3 py-2'
            required
          >
            <option value=''>-- Select a user --</option>
            {users
              .filter((user: any) => user._id !== senderId) // don't send to self
              .map((user: any) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.role}) - {user.email}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className='block mb-1 font-medium'>Message</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className='w-full border border-gray-300 rounded px-3 py-2'
            placeholder='Enter message'
            required
          />
        </div>

        <button
          type='submit'
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
        >
          Send Message
        </button>
      </form>

      {status && <p className='mt-4 text-green-600'>{status}</p>}
    </div>
  )
}
