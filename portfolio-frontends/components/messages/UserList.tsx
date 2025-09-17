'use client'

import React from 'react'

export interface User {
  _id: string
  name: string
  role: 'student' | 'instructor' | 'admin'
}

export interface UserListProps {
  users: User[]
  selectedId: string | null
  currentUser: User
  onSelect: (id: string) => void
}

const UserList: React.FC<UserListProps> = ({
  users,
  selectedId,
  currentUser,
  onSelect,
}) => {
  console.log(users, 'users')
  return (
    <div className='border rounded-lg p-4 h-full overflow-y-auto space-y-2 w-1/3'>
      <h2 className='text-lg font-semibold mb-2'>Available Users</h2>
      {users.map((user) =>
        user?._id ? (
          <div
            key={user._id}
            onClick={() => {
              console.log('User clicked:', user._id)
              onSelect(user._id)
            }}
            className={`cursor-pointer p-2 rounded ${
              selectedId === user._id
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-200'
            }`}
          >
            <div className='font-medium'>{user.name}</div>
            <div className='text-sm opacity-70 capitalize'>{user.role}</div>
          </div>
        ) : null
      )}
    </div>
  )
}

export default UserList
