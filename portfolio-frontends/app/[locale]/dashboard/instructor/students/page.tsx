'use client'

import { use, useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'
import { useParams } from 'next/navigation'
import { Student } from 'types/student'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
export default function MyCourseStudentsPage() {
  const token = useSelector((state: RootState) => state.auth.token)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const courseId = params?.courseId

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${baseURL}/courses/${courseId}/students`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        console.log('API Response:', res.data)

        if (res?.data?.success) {
          setStudents(res?.data?.students)
        } else {
          setStudents([]) // fallback if not successful
          console.error('API Error:', res.data.message)
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            'API Request Failed:',
            error.response?.data?.message || error.message
          )
        } else {
          console.error('Unexpected Error:', error)
        }
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchStudents()
    } else {
      console.error('No token found')
      setLoading(false)
    }
  }, [token])

  if (loading) return <p className='p-4'>Loading students...</p>
  if (!loading && students.length === 0) {
    return (
      <div className='p-6'>
        <h1 className='text-2xl font-semibold mb-4'>
          Students Enrolled in My Courses
        </h1>
        <p className='text-gray-500 text-sm'>No students enrolled yet.</p>
      </div>
    )
  }

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-semibold mb-4'>
        Students Enrolled in My Courses
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {students.map((student) => (
          <div key={student._id} className='border p-4 rounded-xl shadow'>
            <img
              src={student.profileImage || '/default-avatar.png'}
              alt={student.name}
              className='w-12 h-12 rounded-full mb-2'
            />
            <h2 className='font-semibold'>{student.name}</h2>
            <p className='text-sm text-gray-600'>{student.email}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
