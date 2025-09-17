'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { motion, Variants } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import {
  Facebook,
  Twitter,
  Linkedin,
  User as UserIcon,
  Tag,
} from 'lucide-react'

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

export default function BlogDetailsPage() {
  const { slug } = useParams<{ slug: string }>()
  const t = useTranslations('blog')
  const [blog, setBlog] = useState<Blog | null>(null)

  useEffect(() => {
    if (slug) {
      axios
        .get(`${baseURL}/blogs/${slug}`)
        .then((res) => setBlog(res.data))
        .catch((err) => console.error(err))
    }
  }, [slug])

  const sectionVariant: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

  if (!blog) {
    return (
      <main className='flex items-center justify-center h-screen'>
        <p className='text-gray-500 dark:text-gray-400'>Loading...</p>
      </main>
    )
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <main className='bg-gray-50 dark:bg-gray-900 min-h-screen py-20 px-6'>
      <motion.article
        ref={ref}
        initial='hidden'
        animate={inView ? 'visible' : 'hidden'}
        variants={sectionVariant}
        className='max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden p-8 space-y-6'
      >
        {/* Thumbnail */}
        <img
          src={blog.thumbnail || 'https://via.placeholder.com/800x400'}
          alt={blog.title}
          className='w-full h-80 object-cover rounded-xl'
        />

        {/* Blog Header */}
        <div className='space-y-3'>
          <h1 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-snug'>
            {blog.seoTitle || blog.title}
          </h1>

          <p className='text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2'>
            <UserIcon className='w-4 h-4' />
            {blog.author || 'Admin'} •{' '}
            {new Date(blog.createdAt).toLocaleDateString()}
          </p>

          {/* Category */}
          <span className='inline-block bg-teal-100 text-teal-700 dark:bg-orange-100 dark:text-orange-600 text-xs px-3 py-1 rounded-full'>
            {typeof blog.category === 'string'
              ? blog.category
              : blog.category?.name || 'General'}
          </span>
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className='flex items-center gap-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-3 py-1 rounded-full'
              >
                <Tag className='w-3 h-3' /> {tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div
          className='prose prose-lg dark:prose-invert max-w-none leading-relaxed'
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Share Section */}
        <div className='pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            {t('shareThisPost')}
          </p>
          <div className='flex gap-4'>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                shareUrl
              )}&text=${encodeURIComponent(blog.title)}`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400 hover:text-blue-500'
            >
              <Twitter className='w-5 h-5' />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                shareUrl
              )}`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:text-blue-700'
            >
              <Facebook className='w-5 h-5' />
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                shareUrl
              )}&title=${encodeURIComponent(blog.title)}`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-700 hover:text-blue-800'
            >
              <Linkedin className='w-5 h-5' />
            </a>
          </div>
        </div>

        {/* Back button */}
        <div className='pt-4'>
          <Link
            href='/blog'
            className='text-teal-500 dark:text-orange-400 font-medium hover:underline'
          >
            ← {t('backToBlog')}
          </Link>
        </div>
      </motion.article>
    </main>
  )
}
