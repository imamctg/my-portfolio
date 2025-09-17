'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'next/navigation'
import { Card, CardContent } from 'components/ui/card'
import Link from 'next/link'
import {
  FaArrowLeft,
  FaCheck,
  FaClock,
  FaRocket,
  FaTools,
  FaQuestionCircle,
  FaHandshake,
  FaCode,
} from 'react-icons/fa'
import { useEffect, useState } from 'react'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function ServiceDetailPage() {
  const { slug } = useParams()
  const [service, setService] = useState<any>(null)
  //   const service = serviceDetails[slug as string]
  const [loading, setLoading] = useState(true)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(`${baseURL}/services/slug/${slug}`)
        if (res.ok) {
          const data = await res.json()
          setService(data)
        }
      } catch (error) {
        console.error('Failed to fetch service:', error)
      } finally {
        setLoading(false)
      }
    }
    if (slug) fetchService()
  }, [slug])

  if (loading) {
    return <div className='text-center py-20'>Loading...</div>
  }

  if (!service) {
    return (
      <div className='container mx-auto px-4 py-16 text-center'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
          Service Not Found
        </h1>
        <Link
          href='/en/services'
          className='mt-6 inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors'
        >
          <FaArrowLeft className='mr-2' /> Back to Services
        </Link>
      </div>
    )
  }

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  const iconMap: Record<string, JSX.Element> = {
    FaHandshake: <FaHandshake className='text-blue-500' />,
    FaTools: <FaTools className='text-purple-500' />,
    FaRocket: <FaRocket className='text-green-500' />,
    FaCheck: <FaCheck className='text-teal-500' />,
    FaQuestionCircle: <FaQuestionCircle className='text-teal-500' />,
  }

  return (
    <div className='container mx-auto px-4 py-16 max-w-5xl'>
      {/* Breadcrumb */}
      <nav className='flex mb-8 text-sm text-gray-600 dark:text-gray-400'>
        <Link
          href='/en'
          className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'
        >
          Home
        </Link>
        <span className='mx-2'>/</span>
        <Link
          href='/en/services'
          className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'
        >
          Services
        </Link>
        <span className='mx-2'>/</span>
        <span className='text-gray-900 dark:text-gray-200'>
          {service.title}
        </span>
      </nav>

      {/* Service Title */}
      <motion.div
        className='mb-10'
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className='text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white'>
          {service.title}
        </h1>
        <div className='h-1 w-20 bg-indigo-600 rounded-full'></div>
      </motion.div>

      {/* Overview */}
      <motion.section
        className='mb-12 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-2xl'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-white'>
          Service Overview
        </h2>
        <p className='text-lg text-gray-700 dark:text-gray-300 leading-relaxed'>
          {service.overview}
        </p>
      </motion.section>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12'>
        {/* Deliverables */}
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-white'>
            What You'll Receive
          </h2>
          <ul className='space-y-3'>
            {service.deliverables.map((item: string, i: number) => (
              <li
                key={i}
                className='flex items-start bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700'
              >
                <FaCheck className='text-green-500 mt-1 mr-3 flex-shrink-0' />
                <span className='text-gray-700 dark:text-gray-300'>{item}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Technologies */}
        {service.technologies && (
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-white'>
              Technologies & Tools
            </h2>
            <div className='flex flex-wrap gap-2'>
              {service.technologies.map((tech: string, i: number) => (
                <span
                  key={i}
                  className='bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-sm font-medium'
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Process */}
      <motion.section
        className='mb-12'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className='text-2xl font-semibold mb-6 text-gray-900 dark:text-white'>
          My Process
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {service.process.map((step: any, i: number) => (
            <Card
              key={i}
              className='bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow'
            >
              <CardContent className='p-6'>
                <div className='flex items-start mb-4'>
                  <div className='text-2xl p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mr-4'>
                    {iconMap[step.icon] || <FaCode className='text-gray-400' />}
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900 dark:text-white'>
                      {step.title}
                    </h3>
                    {step.duration && (
                      <div className='flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1'>
                        <FaClock className='mr-1' /> {step.duration}
                      </div>
                    )}
                  </div>
                </div>
                <p className='text-gray-600 dark:text-gray-300'>
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* FAQs */}
      <motion.section
        className='mb-12'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className='text-2xl font-semibold mb-6 text-gray-900 dark:text-white'>
          Frequently Asked Questions
        </h2>
        <div className='space-y-4'>
          {service.faqs.map((faq: any, i: number) => (
            <div
              key={i}
              className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden'
            >
              <button
                className='flex justify-between items-center w-full p-4 text-left font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors'
                onClick={() => toggleFaq(i)}
              >
                <span>{faq.q}</span>
                <motion.span
                  animate={{ rotate: openFaqIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 9l-7 7-7-7'
                    />
                  </svg>
                </motion.span>
              </button>
              <AnimatePresence>
                {openFaqIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className='overflow-hidden'
                  >
                    <div className='p-4 border-t border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300'>
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        className='bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white'
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className='text-2xl md:text-3xl font-bold mb-4'>
          Ready to Get Started?
        </h2>
        <p className='text-indigo-100 max-w-2xl mx-auto mb-6'>
          Let's discuss your project requirements and how I can help bring your
          vision to life with professional web development services.
        </p>
        <div className='flex flex-col sm:flex-row justify-center gap-4'>
          <Link
            href='/en/contact'
            className='bg-white text-indigo-600 hover:bg-gray-100 px-6 py-3 rounded-full font-bold shadow-lg transition transform hover:scale-105'
          >
            Request a Quote
          </Link>
          <Link
            href='/en/projects'
            className='bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-full font-bold transition'
          >
            View My Work
          </Link>
        </div>
        <p className='mt-6 text-indigo-200 text-sm'>
          Typically responds within 24 hours
        </p>
      </motion.section>
    </div>
  )
}
