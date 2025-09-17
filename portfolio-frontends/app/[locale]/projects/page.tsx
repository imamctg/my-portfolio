'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Card, CardContent } from 'components/ui/card'
import { ExternalLink, ArrowRight } from 'lucide-react'

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

export default function ProjectsPage() {
  const t = useTranslations('projects')
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${baseURL}/projects`)
      setProjects(res.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  // Skeleton loader card
  const SkeletonCard = () => (
    <div className='animate-pulse flex flex-col gap-3'>
      <div className='h-56 w-full bg-gray-300 dark:bg-gray-700 rounded-2xl' />
      <div className='h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4' />
      <div className='h-4 bg-gray-300 dark:bg-gray-700 rounded w-full' />
      <div className='h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6' />
      <div className='h-10 bg-gray-300 dark:bg-gray-700 rounded w-full' />
    </div>
  )

  if (loading) {
    return (
      <div className='max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
        {Array.from({ length: 6 }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    )
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-12'>
      {/* Section Heading */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='text-center mb-12'
      >
        <h1 className='text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100'>
          {t('heading')}
        </h1>
        <p className='text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
          {t('subheading')}
        </p>
      </motion.div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className='flex items-center justify-center min-h-[40vh]'>
          <p className='text-gray-500 dark:text-gray-400'>{t('noProjects')}</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className='group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 dark:bg-gray-800'>
                {/* Thumbnail */}
                <div className='relative w-full h-56 overflow-hidden rounded-t-2xl'>
                  <img
                    src={
                      project.thumbnail || 'https://via.placeholder.com/400x250'
                    }
                    alt={project.title}
                    className='object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-105'
                  />

                  {/* Overlay */}
                  <div className='absolute inset-0 bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3'>
                    {project.slug && (
                      <Link
                        href={`/projects/${project.slug}`}
                        className='flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium shadow-lg transition'
                      >
                        {t('viewDetails')} <ArrowRight className='w-4 h-4' />
                      </Link>
                    )}
                    {project.link && (
                      <a
                        href={project.link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-full text-sm font-medium shadow-lg transition'
                      >
                        {t('visitLink')} <ExternalLink className='w-4 h-4' />
                      </a>
                    )}
                  </div>

                  {/* Featured Badge */}
                  {project.featured && (
                    <span className='absolute top-3 left-3 bg-pink-600 text-white text-xs px-3 py-1 rounded-full shadow-md'>
                      {t('featured')}
                    </span>
                  )}

                  {/* Category Label */}
                  {project.category && (
                    <span className='absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs px-3 py-1 rounded-full shadow-md'>
                      {project.category}
                    </span>
                  )}
                </div>

                {/* Card Content */}
                <CardContent className='p-5 flex flex-col justify-between h-[220px]'>
                  <div>
                    <h3 className='text-xl font-semibold mb-2 line-clamp-1 text-gray-900 dark:text-gray-100'>
                      {project.title}
                    </h3>
                    <p className='text-gray-600 dark:text-gray-300 text-sm line-clamp-3'>
                      {project.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
