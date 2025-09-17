'use client'

import QuizForm from 'components/Quiz/QuizForm'
import { useParams, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'
import { useEffect, useState } from 'react'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
export default function AddLectureQuizPage() {
  const { slug, sectionId, lectureId } = useParams() as {
    slug: string
    sectionId: string
    lectureId: string
  }

  const token = useSelector((state: RootState) => state.auth.token)
  const router = useRouter()
  const [courseId, setCourseId] = useState<string>('')
  console.log(slug, lectureId, 'lectureId')

  useEffect(() => {
    const fetchCourseId = async () => {
      if (!slug || !token) return
      try {
        const res = await axios.get(`${baseURL}/courses/${slug}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        console.log(res.data.data._id, 'res.data._id')
        setCourseId(res.data.data._id)
      } catch (err) {
        console.error('Failed to fetch course ID from slug')
      }
    }
    fetchCourseId()
  }, [slug, token])

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>Add Lecture Quiz</h1>
      {courseId && (
        <QuizForm
          parentId={lectureId}
          parentType='lecture'
          token={token}
          courseId={courseId}
          onSuccess={() =>
            router.push(`/dashboard/instructor/content/quizzes/${slug}`)
          }
        />
      )}
    </div>
  )
}
