'use client'

import { getCoursesByStatus } from 'app/[locale]/services/courseService'
import ReviewCourseModal from 'components/admin/ReviewCourseModal'
import { RootState } from 'features/redux/store'
import { useState, useEffect, use } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'

export default function AdminReviewQueuePage() {
  const token = useSelector((state: RootState) => state.auth.token)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const response = await getCoursesByStatus('under_review', token) // কমা রিমুভ করুন
        setCourses(response.data.data || []) // ডাটা স্ট্রাকচার ম্যাচ করানো
      } catch (error) {
        console.error('Failed to fetch courses', error)
        toast.error('Failed to fetch courses')
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchCourses()
    }
  }, [token]) // token কে dependency হিসেবে যোগ করুন
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>Courses Pending Review</h1>

      {selectedCourse && (
        <ReviewCourseModal
          courseId={selectedCourse._id}
          onClose={() => setSelectedCourse(null)}
        />
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white'>
            <thead>
              <tr>
                <th className='py-2 px-4 border'>Title</th>
                <th className='py-2 px-4 border'>Instructor</th>
                <th className='py-2 px-4 border'>Submitted At</th>
                <th className='py-2 px-4 border'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id}>
                  <td className='py-2 px-4 border'>{course.title}</td>
                  <td className='py-2 px-4 border'>
                    {course.instructor?.name || 'Unknown'}
                  </td>
                  <td className='py-2 px-4 border'>
                    {new Date(course.updatedAt).toLocaleDateString()}
                  </td>
                  <td className='py-2 px-4 border'>
                    <button
                      onClick={() => setSelectedCourse(course)}
                      className='bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700'
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
