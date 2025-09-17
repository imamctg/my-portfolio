'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import {
  getCourseDetails,
  resubmitCourse,
} from 'app/[locale]/services/courseService'
import { RootState } from 'features/redux/store'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import AdminNotes from 'components/Course/AdminNotes'
import Link from 'next/link'

export default function AddressChangesPage() {
  const params = useParams()
  const courseId = Array.isArray(params.courseId)
    ? params.courseId[0]
    : params.courseId

  const router = useRouter()
  const searchParams = useSearchParams()
  const token = useSelector((state: RootState) => state.auth.token)
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [responseNote, setResponseNote] = useState('')

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true)
        const response = await getCourseDetails(courseId, token)
        setCourse(response.data)
      } catch (error) {
        toast.error('Failed to load course details')
        router.push('/dashboard/instructor/courses')
      } finally {
        setLoading(false)
      }
    }

    if (token && courseId) {
      fetchCourse()
    }
  }, [courseId, token, router])

  const handleResubmit = async () => {
    if (!responseNote.trim()) {
      toast.error('Please describe the changes you made')
      return
    }
    console.log('Submitting with:', { courseId, responseNote, token }) // Add this line

    try {
      await resubmitCourse(courseId, responseNote, token)
      toast.success('Course resubmitted for review!')
      router.push('/dashboard/instructor/courses')
    } catch (error) {
      toast.error('Failed to resubmit course')
    }
  }

  if (loading) return <div className='p-6'>Loading course details...</div>
  if (!course) return <div className='p-6'>Course not found</div>

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>
        Address Change Requests: {course.title}
      </h1>

      <div className='bg-white rounded-lg shadow p-6'>
        <AdminNotes courseId={courseId} />

        <div className='my-6'>
          <h3 className='font-semibold mb-2'>What changes did you make?</h3>
          <textarea
            value={responseNote}
            onChange={(e) => setResponseNote(e.target.value)}
            className='w-full p-2 border rounded'
            rows={4}
            placeholder="Describe how you've addressed the admin's feedback..."
          />
        </div>

        <div className='flex justify-between items-center'>
          <Link
            href='/dashboard/instructor/courses'
            className='text-blue-600 hover:underline'
          >
            Back to My Courses
          </Link>

          <div className='flex gap-2'>
            <Link
              href={`/dashboard/instructor/courses/${courseId}`}
              className='px-4 py-2 border rounded hover:bg-gray-100'
            >
              Edit Course Content
            </Link>
            <button
              onClick={handleResubmit}
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
            >
              Submit for Review
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
