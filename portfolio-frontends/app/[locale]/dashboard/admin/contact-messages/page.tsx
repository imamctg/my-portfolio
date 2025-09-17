'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Input } from 'components/ui/input'
import { Button } from 'components/ui/button'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'components/ui/table'
import { Pagination } from 'components/shared/Pagination'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'
import { ContactMessage } from 'types/contactMessage'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
const AdminContactMessagesPage = () => {
  const token = useSelector((state: RootState) => state.auth.token)
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${baseURL}/contact`, {
        params: { search, page, limit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setMessages(res.data.data)
      setTotal(res.data.total)
    } catch (error) {
      toast.error('Failed to fetch contact messages')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return
    try {
      await axios.delete(`${baseURL}/contact/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      toast.success('Message deleted')
      fetchMessages()
    } catch (error) {
      toast.error('Failed to delete message')
    }
  }
  useEffect(() => {
    if (!token) return
    fetchMessages()
  }, [search, page, token])

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>📩 Contact Messages</h1>

      <div className='mb-4 flex items-center gap-4'>
        <Input
          placeholder='Search by name, email or message'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='max-w-sm'
        />
      </div>

      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((msg) => (
              <TableRow key={msg._id}>
                <TableCell>{msg.name}</TableCell>
                <TableCell>{msg.email}</TableCell>
                <TableCell className='max-w-xs truncate'>
                  {msg.message}
                </TableCell>
                <TableCell>
                  {new Date(msg.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => handleDelete(msg._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {messages.length === 0 && !loading && (
          <p className='mt-4 text-gray-500'>No messages found.</p>
        )}
      </div>

      <div className='mt-6'>
        <Pagination
          currentPage={page}
          totalItems={total}
          itemsPerPage={limit}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>
    </div>
  )
}

export default AdminContactMessagesPage
