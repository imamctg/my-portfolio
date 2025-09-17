'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import axios from 'axios'
import { motion, Variants } from 'framer-motion'
import { Card, CardContent } from 'components/ui/card'
import {
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Star,
  Tag,
  Share2,
} from 'lucide-react'
import Link from 'next/link'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface Project {
  _id: string
  title: string
  description: string
  thumbnail?: string
  category?: string
  slug?: string
  link?: string
  featured?: boolean
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = useMemo(() => {
    const raw = (params?.slug ?? '') as string | string[]
    return Array.isArray(raw) ? raw[0] : raw
  }, [params])

  const t = useTranslations('projects')
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  // Motion variants
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`${baseURL}/projects/${slug}`)
        setProject(res.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    if (slug) fetchProject()
  }, [slug])

  const SkeletonDetail = () => (
    <div className='max-w-6xl mx-auto px-4 py-12'>
      <div className='mb-6'>
        <div className='inline-flex items-center gap-2 rounded-full px-4 py-2 bg-gray-100 dark:bg-gray-800 animate-pulse'>
          <div className='w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-700' />
          <div className='w-24 h-4 rounded bg-gray-300 dark:bg-gray-700' />
        </div>
      </div>

      <div className='relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-slate-200 to-slate-100 dark:from-gray-800 dark:to-gray-900'>
        <div className='h-72 sm:h-96 w-full animate-pulse bg-gray-300/60 dark:bg-gray-700/60' />
      </div>

      <div className='mt-8 space-y-4'>
        <div className='h-9 w-3/4 rounded bg-gray-300 dark:bg-gray-700 animate-pulse' />
        <div className='h-4 w-full rounded bg-gray-300 dark:bg-gray-700 animate-pulse' />
        <div className='h-4 w-5/6 rounded bg-gray-300 dark:bg-gray-700 animate-pulse' />
        <div className='h-11 w-56 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse' />
      </div>
    </div>
  )

  if (loading) return <SkeletonDetail />

  if (!project)
    return (
      <div className='flex items-center justify-center min-h-[60vh] px-4'>
        <Card className='max-w-xl w-full shadow-xl dark:bg-gray-900'>
          <CardContent className='p-8 text-center'>
            <h2 className='text-xl font-semibold mb-2'>{t('notFound')}</h2>
            <p className='text-gray-600 dark:text-gray-300 mb-6'>
              {t('notFoundHelp') ?? 'Try going back to the projects list.'}
            </p>
            <button
              onClick={() => router.back()}
              className='inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:opacity-90 transition'
            >
              <ArrowLeft className='w-4 h-4' />
              {t('back') ?? 'Go Back'}
            </button>
          </CardContent>
        </Card>
      </div>
    )

  return (
    <main className='max-w-6xl mx-auto px-4 py-10'>
      {/* Top actions / Breadcrumb-ish */}
      <div className='mb-6 flex items-center justify-between gap-3'>
        <Link
          href='/projects'
          className='inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium
          bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 transition'
        >
          <ArrowLeft className='w-4 h-4' />
          {t('backToList') ?? 'Back to projects'}
        </Link>

        <div className='flex items-center gap-2'>
          {project.category && (
            <span
              className='inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full
              bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-sm'
              title={t('category') ?? 'Category'}
            >
              <Tag className='w-3.5 h-3.5' />
              {project.category}
            </span>
          )}
          {project.featured && (
            <span
              className='inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full
              bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-sm'
            >
              <Star className='w-3.5 h-3.5' />
              {t('featured')}
            </span>
          )}
        </div>
      </div>

      {/* Cover with gradient ring + overlay */}
      <motion.div
        initial='hidden'
        animate='visible'
        variants={fadeUp}
        className='relative rounded-[1.6rem] p-[2px] bg-gradient-to-r from-cyan-400 via-indigo-500 to-rose-500 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.4)]'
      >
        <div className='relative rounded-[1.5rem] overflow-hidden bg-white dark:bg-gray-900'>
          <div className='relative w-full h-72 sm:h-[26rem]'>
            <img
              src={project.thumbnail || 'https://via.placeholder.com/1200x630'}
              alt={project.title}
              className='object-cover w-full h-full transition-transform duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] hover:scale-105'
            />

            {/* Soft gradient overlay */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none' />

            {/* Floating CTA on image (shows on hover) */}
            {project.link && (
              <div className='absolute inset-x-0 bottom-5 flex justify-center opacity-0 hover:opacity-100 transition-opacity duration-500'>
                <a
                  href={project.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold
                    bg-white/90 text-gray-900 backdrop-blur hover:bg-white
                    dark:bg-gray-900/80 dark:text-white dark:hover:bg-gray-900 shadow-lg'
                >
                  {t('visitLink')} <ExternalLink className='w-4 h-4' />
                </a>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Content card */}
      <motion.section
        initial='hidden'
        animate='visible'
        variants={fadeUp}
        transition={{ delay: 0.05 }}
        className='mt-8'
      >
        <Card className='shadow-2xl border-0 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-gray-900/60'>
          <CardContent className='p-7 md:p-9'>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='text-3xl md:text-4xl font-extrabold tracking-tight
              text-gray-900 dark:text-white'
            >
              {project.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className='mt-4 text-lg leading-relaxed text-gray-700 dark:text-gray-300'
            >
              {project.description}
            </motion.p>

            <div className='mt-7 flex flex-wrap items-center gap-3'>
              {project.link && (
                <a
                  href={project.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 rounded-full px-5 py-2.5 
                  bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium
                  shadow-lg hover:from-indigo-600 hover:to-purple-600 transition'
                >
                  {t('visitLink')} <ArrowRight className='w-5 h-5' />
                </a>
              )}

              {/* Share (placeholder – optional) */}
              <button
                onClick={() => {
                  try {
                    const url =
                      typeof window !== 'undefined' ? window.location.href : ''
                    if (navigator?.share) {
                      navigator.share({ title: project.title, url })
                    } else if (navigator?.clipboard) {
                      navigator.clipboard.writeText(url)
                      // simple feedback – replace with toast if you use one
                      alert(t('copied') ?? 'Link copied!')
                    }
                  } catch (e) {
                    console.error(e)
                  }
                }}
                className='inline-flex items-center gap-2 rounded-full px-5 py-2.5 
                bg-gray-100 text-gray-900 hover:bg-gray-200 
                dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 transition'
              >
                <Share2 className='w-4 h-4' />
                {t('share') ?? 'Share'}
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Bottom nav (previous/back) */}
      <div className='mt-8 flex flex-wrap items-center justify-between gap-3'>
        <button
          onClick={() => router.back()}
          className='inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium
          bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 transition'
        >
          <ArrowLeft className='w-4 h-4' />
          {t('back') ?? 'Back'}
        </button>

        <Link
          href='/projects'
          className='inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium
          bg-gray-900 text-white hover:opacity-90 dark:bg-white dark:text-gray-900 transition'
        >
          {t('allProjects') ?? 'All Projects'}
          <ArrowRight className='w-4 h-4' />
        </Link>
      </div>
    </main>
  )
}
