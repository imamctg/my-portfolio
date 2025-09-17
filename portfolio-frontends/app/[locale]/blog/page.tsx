'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useTranslations } from 'next-intl'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface Blog {
  _id: string
  title: string
  slug: string
  content: string
  thumbnail?: string
  category?: { _id: string; name: string } | string
  createdAt: string
  author?: string
  tags?: string[]
  seoTitle?: string
  seoDescription?: string
}

export default function BlogPage() {
  const t = useTranslations('blog')
  const [blogs, setBlogs] = useState<Blog[]>([])

  useEffect(() => {
    axios
      .get(`${baseURL}/blogs`)
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error(err))
  }, [])

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <main className='bg-gray-50 dark:bg-gray-900 min-h-screen py-16 px-6'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-10'>
          {t('title')}
        </h1>

        {blogs.length === 0 ? (
          <p className='text-gray-500 dark:text-gray-400'>{t('noPosts')}</p>
        ) : (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {blogs.map((blog, index) => (
              <motion.div
                key={blog._id}
                ref={ref}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className='bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden flex flex-col'
              >
                {/* Thumbnail */}
                <img
                  src={blog.thumbnail || 'https://via.placeholder.com/400x200'}
                  alt={blog.title}
                  className='w-full h-48 object-cover'
                />

                {/* Card Content */}
                <div className='p-6 flex flex-col flex-grow'>
                  {/* Title */}
                  <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                    {blog.seoTitle || blog.title}
                  </h2>

                  {/* Author & Date */}
                  <p className='text-sm text-gray-500 dark:text-gray-400 mb-2'>
                    {t('by')} {blog.author || 'Admin'} •{' '}
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>

                  {/* Category */}
                  <span className='inline-block bg-teal-100 text-teal-700 dark:bg-orange-100 dark:text-orange-600 text-xs px-3 py-1 rounded-full mb-3'>
                    {typeof blog.category === 'string'
                      ? blog.category
                      : blog.category?.name || 'General'}
                  </span>

                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className='flex flex-wrap gap-2 mb-3'>
                      {blog.tags.map((tag) => (
                        <span
                          key={tag}
                          className='bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded-full'
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Content Preview */}
                  <p className='text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4'>
                    {blog.seoDescription || blog.content.slice(0, 120) + '...'}
                  </p>

                  {/* Read More */}
                  <Link
                    href={`/blog/${blog.slug}`}
                    className='mt-auto text-teal-500 dark:text-orange-400 font-medium hover:underline'
                  >
                    {t('readMore')} →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
