'use client'

import { use, useEffect, useState } from 'react'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import { Button } from 'components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import { toast } from 'react-hot-toast'
import { Trash, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { RootState } from 'features/redux/store'
import { useSelector } from 'react-redux'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface Testimonial {
  _id: string
  name: string
  comment: string
  profileImage?: string
  createdAt: string
}

export default function AdminTestimonialsPage() {
  const token = useSelector((state: RootState) => state.auth.token)
  const t = useTranslations('testimonials')
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  // Fetch
  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(`${baseURL}/testimonials`)
      setTestimonials(res.data)
    } catch (error) {
      console.error(error)
      toast.error(t('fetchError'))
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  // Delete
  const handleDelete = async (id: string) => {
    console.log(id)
    if (!confirm(t('confirmDelete'))) return
    try {
      await axios.delete(`${baseURL}/testimonials/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTestimonials(testimonials.filter((t) => t._id !== id))
      toast.success(t('deleted'))
    } catch (error) {
      console.error(error)
      toast.error(t('deleteError'))
    }
  }

  return (
    <main className='p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold'>{t('title')}</h1>
        <Link href='testimonials/create'>
          <Button>
            <PlusCircle className='w-4 h-4 mr-2' />
            {t('add')}
          </Button>
        </Link>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {testimonials.map((item) => (
          <Card
            key={item._id}
            className='shadow-md rounded-2xl hover:shadow-lg transition'
          >
            <img
              src={item.profileImage || 'https://via.placeholder.com/200'}
              alt={item.name}
              className='w-full h-40 object-cover rounded-t-2xl'
            />
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <p className='text-xs text-gray-500'>
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-gray-600 mb-3 line-clamp-3'>
                {item.comment}
              </p>
              <Button
                size='sm'
                variant='destructive'
                onClick={() => handleDelete(item._id)}
              >
                <Trash className='w-4 h-4 mr-1' /> {t('delete')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {testimonials.length === 0 && (
        <p className='text-center text-gray-500 mt-8'>{t('noTestimonials')}</p>
      )}
    </main>
  )
}
