'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import CertificateDownloadButton from 'components/certificates/CertificateDownloadButton'
import { RootState } from 'features/redux/store'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
export default function CertificatePage() {
  const user = useSelector((state: any) => state.auth.user)
  const token = useSelector((state: RootState) => state.auth.token)
  const [courses, setCourses] = useState<any[]>([])
  console.log(courses, 'courses')
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await axios.get(`${baseURL}/users/${user?.id}/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setCourses(res.data.courses || [])
      } catch (error) {
        console.error('Error fetching courses for certificates:', error)
      }
    }

    if (user?.id) {
      fetchCertificates()
    }
  }, [user])

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Your Certificates</h1>

      {Array.isArray(courses) && courses.length === 0 ? (
        <p>No certificates available yet.</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {courses.map((course: any) => (
            <div
              key={course._id}
              className='border p-4 rounded shadow hover:shadow-md transition'
            >
              <h2 className='font-semibold text-lg'>{course.title}</h2>
              <p className='text-sm text-gray-500 mb-3'>
                {course.instructor?.name || course.instructor}
              </p>

              <CertificateDownloadButton
                userId={user?.id}
                courseId={course._id}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
