'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { format } from 'date-fns'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'
import toast, { Toaster } from 'react-hot-toast'
import User from 'types/user'

const pageSize = 10
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
const UsersPage = () => {
  const token = useSelector((state: RootState) => state.auth.token)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchUsers = async () => {
    try {
      if (!token) return
      const response = await axios.get(`${baseURL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUsers(response.data.users || [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [token])

  const handleChangeRole = async (userId: string, newRole: User['role']) => {
    try {
      await axios.patch(
        `${baseURL}/users/${userId}/role`,
        {
          role: newRole,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      )
    } catch (error) {
      console.error('Failed to change role:', error)
    }
  }

  const handleChangeStatus = async (
    userId: string,
    newStatus: 'pending' | 'approved' | 'rejected'
  ) => {
    try {
      await axios.put(
        `${baseURL}/users/admin/instructor/${userId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, status: newStatus } : user
        )
      )
      toast.success(`Instructor ${newStatus}`)
    } catch (error) {
      console.error('Failed to update status:', error)
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (userId: string) => {
    const confirm = window.confirm('Are you sure you want to delete this user?')
    if (!confirm) return
    try {
      setLoading(true)
      await axios.delete(`${baseURL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUsers((prev) => prev.filter((user) => user._id !== userId))
      toast.success('User deleted')
    } catch (error) {
      console.error('Failed to delete user:', error)
      toast.error('Failed to delete user')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === 'all' || user.status === statusFilter
    return matchSearch && matchStatus
  })

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const totalPages = Math.ceil(filteredUsers.length / pageSize)

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>All Users</h1>

      <div className='flex flex-col md:flex-row gap-3 mb-4'>
        <input
          type='text'
          placeholder='Search by name or email...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='border px-3 py-1 rounded w-full md:w-1/2'
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className='border px-3 py-1 rounded w-full md:w-1/4'
        >
          <option value='all'>All</option>
          <option value='pending'>Pending</option>
          <option value='approved'>Approved</option>
          <option value='rejected'>Rejected</option>
        </select>
      </div>

      {loading && <p className='text-red-500'>Loading...</p>}

      <div className='overflow-x-auto'>
        <table className='min-w-full text-sm border'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='border p-2'>#</th>
              <th className='border p-2'>Name</th>
              <th className='border p-2'>Email</th>
              <th className='border p-2'>Role</th>
              <th className='border p-2'>Status</th>
              <th className='border p-2'>Joined</th>
              <th className='border p-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user, index) => (
              <tr key={user._id} className='text-center'>
                <td className='border p-2'>
                  {(currentPage - 1) * pageSize + index + 1}
                </td>
                <td className='border p-2'>{user.name}</td>
                <td className='border p-2'>{user.email}</td>
                <td className='border p-2'>
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleChangeRole(user._id, e.target.value as User['role'])
                    }
                    className='border rounded px-2 py-1'
                  >
                    <option value='student'>Student</option>
                    <option value='instructor'>Instructor</option>
                    <option value='admin'>Admin</option>
                  </select>
                </td>
                <td className='border p-2'>
                  {user.role === 'instructor' && user.status === 'pending' ? (
                    <span className='text-orange-600 font-medium'>Pending</span>
                  ) : user.role === 'instructor' ? (
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-semibold ${
                        user.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {user.status}
                    </span>
                  ) : (
                    <span className='italic text-gray-400'>N/A</span>
                  )}
                </td>
                <td className='border p-2'>
                  {format(new Date(user.createdAt), 'dd MMM yyyy')}
                </td>
                <td className='border p-2'>
                  <div className='flex justify-center gap-2'>
                    <button
                      onClick={() => setSelectedUser(user)}
                      className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded'
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded'
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={7} className='text-center p-4 text-gray-500'>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className='flex justify-center items-center gap-2 mt-4'>
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === i + 1
                ? 'bg-blue-500 text-white'
                : 'bg-white text-black'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modal */}
      {selectedUser && (
        <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='bg-white p-6 rounded w-full max-w-lg shadow-xl relative'>
            <button
              onClick={() => setSelectedUser(null)}
              className='absolute top-2 right-2 text-gray-600 hover:text-black text-xl'
            >
              ✕
            </button>
            <h2 className='text-xl font-bold mb-4'>
              {selectedUser.role.charAt(0).toUpperCase() +
                selectedUser.role.slice(1)}{' '}
              Details
            </h2>

            <div className='space-y-3 max-h-[80vh] overflow-y-auto'>
              {selectedUser.profileImage && (
                <Image
                  src={selectedUser.profileImage}
                  alt='Profile'
                  width={80}
                  height={80}
                  className='rounded-full mx-auto'
                />
              )}
              <p>
                <strong>Name:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Role:</strong> {selectedUser.role}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-sm ${
                    selectedUser.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : selectedUser.status === 'rejected'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {selectedUser.status}
                </span>
              </p>
              <p>
                <strong>Bio:</strong> {selectedUser.bio}
              </p>
              <p>
                <strong>Website:</strong>{' '}
                <a
                  href={selectedUser.website}
                  className='text-blue-500 underline'
                  target='_blank'
                >
                  {selectedUser.website}
                </a>
              </p>
              <p>
                <strong>Experience:</strong> {selectedUser.experience} years
              </p>
              {selectedUser.nidFileUrl && (
                <p>
                  <strong>NID File:</strong>{' '}
                  <a
                    href={selectedUser.nidFileUrl}
                    target='_blank'
                    className='text-blue-600 underline'
                  >
                    View NID
                  </a>
                </p>
              )}
              <p>
                <strong>Notes:</strong>{' '}
                {selectedUser.notes ? selectedUser.notes : 'N/A'}
              </p>

              {/* Always show action buttons */}
              {selectedUser.role === 'instructor' && (
                <div className='flex justify-end gap-3 pt-4'>
                  <button
                    onClick={() => {
                      handleChangeStatus(selectedUser._id, 'approved')
                      setSelectedUser(null)
                    }}
                    className='bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600'
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      handleChangeStatus(selectedUser._id, 'rejected')
                      setSelectedUser(null)
                    }}
                    className='bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600'
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersPage
