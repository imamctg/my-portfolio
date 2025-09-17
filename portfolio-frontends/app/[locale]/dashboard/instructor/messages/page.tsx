'use client'

import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import axios from 'axios'
import ChatWindow from 'components/messages/ChatWindow'
import UserList from 'components/messages/UserList'
import { RootState } from 'features/redux/store'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
export default function MessagesPage() {
  const user = useSelector((state: RootState) => state.auth.user)
  const token = useSelector((state: RootState) => state.auth.token)
  const [receiverId, setReceiverId] = useState<string | null>(null)
  const [availableUsers, setAvailableUsers] = useState<any[]>([])

  useEffect(() => {
    if (!user?.id) return

    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${baseURL}/messages/available-users/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        // console.log(res.data.users, 'res.data.users')
        setAvailableUsers(res.data.users || [])
      } catch (err) {
        console.error('Failed to load available users', err)
      }
    }

    fetchUsers()
  }, [user?.id, token])

  if (!user?.id) return <p className='text-red-500'>Please login</p>

  return (
    <div className='flex h-[80vh] border rounded shadow bg-white'>
      <UserList
        users={availableUsers}
        onSelect={setReceiverId}
        selectedId={receiverId}
        currentUser={user}
      />
      <div className='w-2/3 p-4'>
        {receiverId ? (
          <ChatWindow currentUserId={user.id} receiverId={receiverId} />
        ) : (
          <p className='text-gray-500'>Select a user to start chatting</p>
        )}
      </div>
    </div>
  )
}
