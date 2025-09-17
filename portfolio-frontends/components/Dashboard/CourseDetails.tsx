// components/Dashboard/CourseDetails.tsx
'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'next/navigation'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
const CourseDetails = () => {
  const { id } = useParams()
  const [course, setCourse] = useState<any>(null)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${baseURL}/courses/${id}`)
        setCourse(res.data)
      } catch (err) {
        console.error(err)
      }
    }

    if (id) fetchCourse()
  }, [id])

  if (!course) return <p className='p-6'>Loading...</p>

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>{course.title}</h1>
      <p className='mb-6'>{course.description}</p>

      <h2 className='text-xl font-semibold mb-2'>Video Lectures</h2>
      <ul className='list-disc pl-6 mb-6'>
        {course.videos?.map((video: any, idx: number) => (
          <li key={idx}>
            <a
              href={video.url}
              className='text-blue-600 hover:underline'
              target='_blank'
              rel='noreferrer'
            >
              {video.title}
            </a>
          </li>
        ))}
      </ul>

      <h2 className='text-xl font-semibold mb-2'>Resources</h2>
      <ul className='list-disc pl-6 mb-6'>
        {course.resources?.map((res: any, idx: number) => (
          <li key={idx}>{res}</li>
        ))}
      </ul>

      <h2 className='text-xl font-semibold mb-2'>Exams</h2>
      <ul className='list-decimal pl-6'>
        {course.exam?.map((q: any, idx: number) => (
          <li key={idx}>{q.question}</li>
        ))}
      </ul>
    </div>
  )
}

export default CourseDetails
