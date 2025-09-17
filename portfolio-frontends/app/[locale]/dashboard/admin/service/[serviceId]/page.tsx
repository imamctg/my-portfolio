'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import { Button } from 'components/ui/button'
import { FiArrowLeft, FiEdit, FiTrash2, FiEye } from 'react-icons/fi'
import { Service } from 'types/service'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.serviceId) {
      fetchService()
    }
  }, [params.serviceId])

  const fetchService = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${baseURL}/services/${params.serviceId}`)
      if (response.ok) {
        const data = await response.json()
        setService(data)
      } else {
        setError('Failed to fetch service')
      }
    } catch (err) {
      setError('Failed to fetch service')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const response = await fetch(`${baseURL}/services/${params.serviceId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/dashboard/admin/service')
        router.refresh()
      } else {
        setError('Failed to delete service')
      }
    } catch (err) {
      setError('Failed to delete service')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className='container mx-auto p-6'>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'></div>
        </div>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className='container mx-auto p-6'>
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6'>
          {error || 'Service not found'}
        </div>
        <Link href='/dashboard/admin/service'>
          <Button variant='outline'>
            <FiArrowLeft className='mr-2' />
            Back to Services
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className='container mx-auto p-6'>
      <div className='mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <Link
            href='/dashboard/admin/service'
            className='inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-2'
          >
            <FiArrowLeft className='mr-2' />
            Back to Services
          </Link>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            {service.title}
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-2'>
            {service.description}
          </p>
        </div>
        <div className='flex gap-2'>
          <Link href={`/services/${service.slug}`} target='_blank'>
            <Button variant='outline'>
              <FiEye className='mr-2' />
              View Live
            </Button>
          </Link>
          <Link href={`/dashboard/admin/service/${service?._id}/edit`}>
            <Button>
              <FiEdit className='mr-2' />
              Edit
            </Button>
          </Link>
          <Button variant='destructive' onClick={handleDelete}>
            <FiTrash2 className='mr-2' />
            Delete
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-gray-700 dark:text-gray-300'>
                {service.overview}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technologies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-2'>
                {service.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className='bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm'
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='space-y-2'>
                {service.features.map((feature, index) => (
                  <li key={index} className='flex items-start'>
                    <span className='text-green-500 mr-2'>•</span>
                    <span className='text-gray-700 dark:text-gray-300'>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Process</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {service.process.map((step, index) => (
                <div
                  key={index}
                  className='border-l-4 border-indigo-500 pl-4 py-2'
                >
                  <h3 className='font-semibold text-gray-900 dark:text-white'>
                    {step.title}
                  </h3>
                  <p className='text-gray-600 dark:text-gray-400 text-sm mt-1'>
                    {step.description}
                  </p>
                  {step.duration && (
                    <p className='text-gray-500 dark:text-gray-500 text-xs mt-2'>
                      Duration: {step.duration}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>FAQs</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {service.faqs.map((faq, index) => (
                <div key={index}>
                  <h3 className='font-semibold text-gray-900 dark:text-white'>
                    {faq.q}
                  </h3>
                  <p className='text-gray-600 dark:text-gray-400 mt-1'>
                    {faq.a}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Service Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between'>
                <span className='text-gray-700 dark:text-gray-300'>Status</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    service.published
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  {service.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className='mt-4 flex items-center justify-between'>
                <span className='text-gray-700 dark:text-gray-300'>Slug</span>
                <span className='text-gray-600 dark:text-gray-400 text-sm'>
                  {service.slug}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deliverables</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='space-y-2'>
                {service.deliverables.map((deliverable, index) => (
                  <li key={index} className='flex items-start'>
                    <span className='text-indigo-500 mr-2'>•</span>
                    <span className='text-gray-700 dark:text-gray-300'>
                      {deliverable}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
