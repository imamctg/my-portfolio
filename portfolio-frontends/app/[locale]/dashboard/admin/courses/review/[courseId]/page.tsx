'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  getCourseDetails,
  reviewCourse,
} from 'app/[locale]/services/courseService'
import { RootState } from 'features/redux/store'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import AdminNotes from 'components/Course/AdminNotes'

export default function CourseReviewPage() {
  const params = useParams()
  const courseId = Array.isArray(params.courseId)
    ? params.courseId[0]
    : params.courseId
  const token = useSelector((state: RootState) => state.auth.token)
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [decision, setDecision] = useState('approved')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId || !token) return
      try {
        setLoading(true)
        const response = await getCourseDetails(courseId, token)
        console.log(response.data.data, 'response.data in review page')
        setCourse(response.data.data)
      } catch (error) {
        toast.error('Failed to load course details')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchCourse()
    }
  }, [courseId, token])

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      console.log('Submitting review with:', {
        courseId,
        decision,
        notes,
        token: token ? 'exists' : 'missing',
      })

      const response = await reviewCourse(courseId, decision, token, notes)
      if (response.data.success) {
        toast.success('Review submitted successfully!')
        window.history.back()
      } else {
        toast.error(response.data.message || 'Review submission failed')
      }
    } catch (error) {
      console.error('Full error object:', error)
      if (error.response) {
        console.error('Error response data:', error.response.data)
        toast.error(
          `Review failed: ${error.response.data.message || 'Server error'}`
        )
      } else {
        toast.error('Failed to submit review')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className='p-6'>Loading course details...</div>
  }

  if (!course) {
    return <div className='p-6'>Course not found</div>
  }

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>Review Course: {course.title}</h1>

      <div className='space-y-6'>
        {/* Add AdminNotes component at the top */}
        <AdminNotes courseId={courseId} />
        <div className='bg-white rounded-lg shadow p-6'>
          <div className='mb-6'>
            <h2 className='text-lg font-semibold mb-2'>Course Information</h2>
            <p>
              <strong>Instructor:</strong>{' '}
              {course.instructor?.name || 'Unknown'}
            </p>
            <p>
              <strong>Price:</strong> ${course.price}
            </p>
            <p>
              <strong>Status:</strong> {course.status}
            </p>
          </div>

          <div className='mb-6'>
            <label className='block mb-2 font-semibold'>Decision:</label>
            <select
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              className='w-full p-2 border rounded'
            >
              <option value='approved'>Approve</option>
              <option value='changes_requested'>Request Changes</option>
              <option value='rejected'>Reject</option>
            </select>
          </div>

          <div className='mb-6'>
            <label className='block mb-2 font-semibold'>Notes:</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className='w-full p-2 border rounded'
              rows={4}
              placeholder='Add review notes...'
            />
          </div>

          <div className='flex justify-end gap-2'>
            <button
              onClick={() => window.history.back()}
              className='px-4 py-2 border rounded hover:bg-gray-100'
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                submitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
