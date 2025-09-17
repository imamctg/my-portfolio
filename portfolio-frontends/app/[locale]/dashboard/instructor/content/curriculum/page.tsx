'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'

interface Course {
  _id: string
  title: string
  thumbnail: string
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
const CurriculumCourseListPage = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const token = useSelector((state: RootState) => state.auth.token)
  const [courses, setCourses] = useState<Course[]>([])
  console.log(courses, 'courses')
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${baseURL}/courses/${user.id}/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setCourses(res.data.courses || [])
      } catch (err) {
        console.error('Failed to load courses')
      }
    }

    if (token) fetchCourses()
  }, [token])

  return (
    <div className='p-6 max-w-5xl mx-auto'>
      <h2 className='text-2xl font-bold mb-6'>
        📚 Select a course to manage curriculum
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {courses.map((course) => (
          <Link
            href={`/dashboard/instructor/content/curriculum/${course._id}`}
            key={course._id}
          >
            <div className='border rounded-lg shadow hover:shadow-md p-4 cursor-pointer transition'>
              <img
                src={course.thumbnail}
                alt={course.title}
                className='h-40 w-full object-cover rounded mb-2'
              />
              <h3 className='text-lg font-semibold'>{course.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CurriculumCourseListPage
