// src/components/Dashboard/InstructorCourses.tsx
'use client'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'
import { useSearchParams } from 'next/navigation'
import { Loader2, Search } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import {
  getInstructorCourses,
  publishCourse,
  submitForReview,
} from 'app/[locale]/services/courseService'
import StatusBadge from 'components/Course/StatusBadge'

const InstructorCourses = () => {
  const [courses, setCourses] = useState<any[]>([])
  const [filteredCourses, setFilteredCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const user = useSelector((state: RootState) => state.auth.user)
  const token = useSelector((state: RootState) => state.auth.token)
  const searchParams = useSearchParams()
  const statusFilter = searchParams.get('status') || ''

  console.log(courses, 'courses')
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.id || !token) return
      setLoading(true)
      try {
        const response = await getInstructorCourses(user.id, token)
        console.log(response.data.courses, 'response.data.courses')
        setCourses(response.data.courses || [])
      } catch (error) {
        toast.error('Failed to load courses.')
        console.error('Error fetching courses:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [user?._id, token])

  useEffect(() => {
    let filtered = [...courses]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((c) =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((c) => c.status === statusFilter)
    }

    setFilteredCourses(filtered)
    setCurrentPage(1)
  }, [searchTerm, statusFilter, courses])

  const handleSubmitForReview = async (courseId: string) => {
    try {
      await submitForReview(courseId, token)
      toast.success('Course submitted for review!')
      // Refresh courses
      const response = await getInstructorCourses(user._id, token)
      setCourses(response.data.courses || [])
    } catch (error) {
      toast.error('Failed to submit course for review')
    }
  }

  const handlePublish = async (courseId: string) => {
    console.log(courseId, token, user.id, 'user._id')
    try {
      await publishCourse(courseId, token)
      toast.success('Course published successfully!')
      // Refresh courses

      const response = await getInstructorCourses(user.id, token)
      setCourses(response.data.courses || [])
    } catch (error) {
      toast.error('Failed to publish course')
    }
  }

  if (!user || user.role !== 'instructor') {
    return <div className='text-red-500 p-6'>Unauthorized Access</div>
  }

  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage)

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <h2 className='text-3xl font-bold text-indigo-700 mb-6'>
        {statusFilter
          ? `${statusFilter.replace('_', ' ')} Courses`
          : 'My Courses'}
      </h2>

      {/* Search & Filter */}
      <div className='flex flex-col sm:flex-row justify-between gap-4 mb-6'>
        <div className='flex items-center gap-2'>
          <Search className='w-5 h-5 text-gray-500' />
          <input
            type='text'
            placeholder='Search by title...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='border rounded px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-400'
          />
        </div>

        <div className='flex gap-2'>
          <Link
            href='/dashboard/instructor/courses'
            className={`px-3 py-2 rounded ${
              !statusFilter ? 'bg-indigo-600 text-white' : 'bg-gray-200'
            }`}
          >
            All
          </Link>
          <Link
            href='/dashboard/instructor/courses?status=draft'
            className={`px-3 py-2 rounded ${
              statusFilter === 'draft'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200'
            }`}
          >
            Draft
          </Link>
          <Link
            href='/dashboard/instructor/courses?status=under_review'
            className={`px-3 py-2 rounded ${
              statusFilter === 'under_review'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200'
            }`}
          >
            Under Review
          </Link>
          <Link
            href='/dashboard/instructor/courses?status=published'
            className={`px-3 py-2 rounded ${
              statusFilter === 'published'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200'
            }`}
          >
            Published
          </Link>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className='flex justify-center items-center h-48'>
          <Loader2 className='animate-spin w-8 h-8 text-indigo-500' />
        </div>
      ) : paginatedCourses.length === 0 ? (
        <div className='text-center text-gray-500 mt-10'>No courses found</div>
      ) : (
        <>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {paginatedCourses.map((course) => (
              <div
                key={course._id}
                className='bg-white rounded-2xl shadow hover:shadow-xl hover:scale-[1.01] transition-all duration-300 overflow-hidden border border-gray-200'
              >
                <div className='h-44 bg-gray-100 relative'>
                  <img
                    src={course.thumbnail || '/default-thumbnail.jpg'}
                    alt='Course thumbnail'
                    className='w-full h-full object-cover'
                  />
                  <div className='absolute top-2 left-2'>
                    <StatusBadge status={course.status} />
                  </div>
                </div>
                <div className='p-4'>
                  <h4 className='text-lg font-semibold text-gray-800 line-clamp-2'>
                    {course.title}
                  </h4>
                  <p className='text-sm text-gray-500 mt-1 line-clamp-2'>
                    {course.description}
                  </p>

                  <div className='flex justify-between text-sm text-gray-600 mt-3'>
                    <span>👥 {course.students?.length || 0} Students</span>
                    <span>⭐ {course.rating || 0}</span>
                  </div>

                  <div className='flex justify-end gap-2 mt-4'>
                    <Link href={`/dashboard/instructor/courses/${course._id}`}>
                      <button className='bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-indigo-700 transition'>
                        ✏️ Edit
                      </button>
                    </Link>
                    {/* 👀 Preview button */}
                    <Link href={`/learn/${course._id}`} target='_blank'>
                      <button className='bg-gray-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-gray-600 transition'>
                        👀 Preview
                      </button>
                    </Link>
                    {course.status === 'draft' && (
                      <button
                        onClick={() => handleSubmitForReview(course._id)}
                        className='bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition'
                      >
                        Submit Review
                      </button>
                    )}

                    {course.status === 'approved' && (
                      <button
                        onClick={() => handlePublish(course._id)}
                        className='bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-green-700 transition'
                      >
                        Publish
                      </button>
                    )}

                    {course.status === 'changes_requested' && (
                      <Link
                        href={{
                          pathname: `/dashboard/instructor/courses/${course._id}/changes`,
                          query: { changeRequest: true },
                        }}
                        className='bg-yellow-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-yellow-700 transition'
                      >
                        Address Changes
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='flex justify-center items-center gap-2 mt-8'>
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className='px-3 py-1 bg-indigo-100 hover:bg-indigo-200 rounded disabled:opacity-50'
              >
                Prev
              </button>
              <span className='text-gray-700'>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className='px-3 py-1 bg-indigo-100 hover:bg-indigo-200 rounded disabled:opacity-50'
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default InstructorCourses
