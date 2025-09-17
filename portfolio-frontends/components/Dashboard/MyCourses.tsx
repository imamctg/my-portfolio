'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { RootState } from 'features/redux/store'
import ReviewModal from 'components/common/ReviewModal'
import { CourseWithProgress } from 'types/courseProgress'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
const MyCourses = () => {
  const [courses, setCourses] = useState<CourseWithProgress[]>([])
  const user = useSelector((state: RootState) => state.auth.user)
  const token = useSelector((state: RootState) => state.auth.token)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedCourse, setSelectedCourse] =
    useState<CourseWithProgress | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      const userId = user?._id || user?.id
      if (!userId || !token) return

      try {
        const response = await axios.get(`${baseURL}/user/courses/progress`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setCourses(response.data.courses)
      } catch (error) {
        console.error('❌ Error fetching user courses with progress:', error)
        // fallback
        try {
          const fallbackResponse = await axios.get(
            `${baseURL}/user/${userId}/courses`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          setCourses(
            fallbackResponse.data.courses.map((course: any) => ({
              ...course,
              progress: course.progress || 0,
              totalLectures: 0,
              completedLectures: 0,
            }))
          )
        } catch (fallbackError) {
          console.error('❌ Error fetching fallback courses:', fallbackError)
        }
      }
    }

    fetchCourses()
  }, [user?._id, token])

  if (!user || !user.id || !token) return <div>Loading your courses...</div>

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-bold mb-6'>🎓 আমার কোর্সসমূহ</h2>

      {courses.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {courses.map((course) => (
            <div
              key={course._id}
              className='bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition'
            >
              <Link href={`/learn/${course.slug}`} className='block'>
                <div className='h-40 bg-gray-200'>
                  <img
                    src={course.thumbnail || '/default-thumbnail.jpg'}
                    alt={course.title}
                    className='w-full h-full object-cover'
                  />
                </div>

                <div className='p-4'>
                  <h3 className='text-lg font-semibold mb-1'>{course.title}</h3>
                  <p className='text-sm text-gray-600 mb-2'>
                    By{' '}
                    {typeof course.instructor === 'object'
                      ? course.instructor.name
                      : course.instructor}
                  </p>

                  {/* Progress */}
                  <div className='mb-2'>
                    <div className='w-full bg-gray-200 rounded-full h-2.5'>
                      <div
                        className='bg-green-500 h-2.5 rounded-full'
                        style={{ width: `${course.progress || 0}%` }}
                      ></div>
                    </div>
                    <p className='text-xs text-gray-500 mt-1'>
                      {course.completedLectures || 0} of{' '}
                      {course.totalLectures || 0} lectures completed (
                      {course.progress || 0}%)
                    </p>
                  </div>

                  <p className='text-blue-600 text-sm font-medium'>
                    {course.progress === 100
                      ? '🎉 Course Completed'
                      : '▶️ Continue Course'}
                  </p>
                </div>
              </Link>

              {/* ⭐ Review Button */}
              {course.progress === 100 && (
                <div className='p-4 pt-0'>
                  <button
                    onClick={() => {
                      setSelectedCourse(course)
                      setShowReviewModal(true)
                    }}
                    className='mt-2 text-sm text-yellow-600 hover:underline'
                  >
                    ⭐ Review This Course
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>আপনি এখনো কোনো কোর্স এনরোল করেননি।</p>
      )}

      {/* ⭐ Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        courseId={selectedCourse?._id || ''}
      />
    </div>
  )
}

export default MyCourses
