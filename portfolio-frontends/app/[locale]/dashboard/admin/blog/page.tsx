'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from 'components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Edit, Trash, Plus } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface Blog {
  _id: string
  title: string
  slug: string
  category?: string | { _id: string; name: string } // <-- এখানে object allow করা হলো
  createdAt: string
}

export default function AdminBlogListPage() {
  const token = useSelector((state: RootState) => state.auth.token)
  const t = useTranslations('blog')
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${baseURL}/blogs`)
      console.log(res.data, 'res.data')
      setBlogs(res.data)
    } catch (error) {
      console.error(error)
      toast.error(t('fetchError'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return
    try {
      await axios.delete(`${baseURL}/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setBlogs(blogs.filter((b) => b._id !== id))
      toast.success(t('deleted'))
    } catch (error) {
      console.error(error)
      toast.error(t('deleteError'))
    }
  }
  console.log(blogs, 'blogs')

  return (
    <main className='p-6 bg-gray-50 dark:bg-gray-900 min-h-screen'>
      {/* Header */}
      <div className='flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4'>
        <h1 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white'>
          {t('allBlogs')}
        </h1>
        <Link href='/dashboard/admin/blog/new'>
          <Button className='flex items-center gap-2'>
            <Plus className='w-4 h-4' /> {t('addBlog')}
          </Button>
        </Link>
      </div>

      {/* Blogs Grid */}
      {loading ? (
        <p className='text-gray-500 dark:text-gray-400'>{t('loading')}</p>
      ) : blogs.length === 0 ? (
        <p className='text-gray-500 dark:text-gray-400'>{t('noBlogs')}</p>
      ) : (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {blogs.map((blog) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className='shadow-md hover:shadow-lg transition hover:scale-[1.02]'>
                <CardHeader>
                  <CardTitle className='truncate'>{blog.title}</CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    {t('category')}:{' '}
                    {typeof blog.category === 'string'
                      ? blog.category
                      : blog.category?.name || t('general')}
                  </p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>

                  {/* Actions */}
                  <div className='flex gap-3 pt-2'>
                    <Link href={`/dashboard/admin/blog/${blog.slug}/edit`}>
                      <Button
                        size='sm'
                        variant='outline'
                        className='flex items-center gap-1'
                      >
                        <Edit className='w-4 h-4' /> {t('edit')}
                      </Button>
                    </Link>
                    <Button
                      size='sm'
                      variant='destructive'
                      className='flex items-center gap-1'
                      onClick={() => handleDelete(blog._id)}
                    >
                      <Trash className='w-4 h-4' /> {t('delete')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  )
}
