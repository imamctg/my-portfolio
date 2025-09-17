'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from 'components/ui/card'
import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi'
import { Service } from 'types/service'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const itemsPerPage = 8
  const router = useRouter()

  useEffect(() => {
    fetchServices()
  }, [])

  useEffect(() => {
    const filtered = services.filter(
      (service) =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredServices(filtered)
    setCurrentPage(1)
  }, [searchTerm, services])

  const fetchServices = async () => {
    try {
      setLoading(true)
      // Replace with your API call
      const response = await fetch(`${baseURL}/services/all`)
      const data = await response.json()
      setServices(data)
      setFilteredServices(data)
    } catch (err) {
      setError('Failed to fetch services')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const response = await fetch(`${baseURL}services/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setServices(services.filter((service) => service?._id !== id))
      } else {
        setError('Failed to delete service')
      }
    } catch (err) {
      setError('Failed to delete service')
      console.error(err)
    }
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentServices = filteredServices.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  if (loading) {
    return (
      <div className='container mx-auto p-6'>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'></div>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto p-6'>
      <div className='mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Services Management
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-2'>
            Manage your portfolio services and offerings
          </p>
        </div>
        <Link href='/dashboard/admin/service/create'>
          <Button className='flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700'>
            <FiPlus size={18} />
            Add New Service
          </Button>
        </Link>
      </div>

      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6'>
          {error}
        </div>
      )}

      <Card className='mb-6'>
        <CardContent className='p-4'>
          <div className='flex flex-col sm:flex-row gap-4 items-center'>
            <div className='relative flex-1'>
              <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
              <Input
                type='text'
                placeholder='Search services...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>
            <div className='text-gray-600 dark:text-gray-400'>
              {filteredServices.length} services found
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredServices.length === 0 ? (
        <Card>
          <CardContent className='p-12 text-center'>
            <div className='text-gray-500 dark:text-gray-400 text-lg mb-4'>
              No services found
            </div>
            <Link href='/dashboard/admin/service/create'>
              <Button className='bg-indigo-600 hover:bg-indigo-700'>
                Create Your First Service
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8'>
            {currentServices.map((service) => (
              <Card
                key={service?._id}
                className='overflow-hidden hover:shadow-lg transition-shadow'
              >
                <CardContent className='p-0'>
                  <div className='aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
                    {service.icon ? (
                      <div className='text-4xl'>{service.icon}</div>
                    ) : (
                      <div className='text-gray-400'>No Icon</div>
                    )}
                  </div>
                  <div className='p-4'>
                    <h3 className='font-semibold text-lg mb-1 truncate'>
                      {service.title}
                    </h3>
                    <p className='text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2'>
                      {service.description}
                    </p>
                    <div className='flex justify-between items-center'>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          service.published
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {service.published ? 'Published' : 'Draft'}
                      </span>
                      <div className='flex gap-2'>
                        <Link href={`/dashboard/admin/service/${service?._id}`}>
                          <Button variant='outline' size='sm'>
                            <FiEye size={14} />
                          </Button>
                        </Link>
                        <Link
                          href={`/dashboard/admin/service/${service?._id}/edit`}
                        >
                          <Button variant='outline' size='sm'>
                            <FiEdit size={14} />
                          </Button>
                        </Link>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleDelete(service._id as string)}
                        >
                          <FiTrash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='flex justify-center items-center gap-2'>
              <Button
                variant='outline'
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <FiChevronLeft size={16} />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant='outline'
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <FiChevronRight size={16} />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
