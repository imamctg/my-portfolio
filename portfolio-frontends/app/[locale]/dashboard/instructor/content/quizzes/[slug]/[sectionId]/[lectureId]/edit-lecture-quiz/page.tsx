'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import QuizForm from 'components/Quiz/QuizForm'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'
import { toast } from 'react-hot-toast'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function EditLectureQuizPage() {
  const token = useSelector((state: RootState) => state.auth.token)
  const router = useRouter()

  const { slug, sectionId, lectureId } = useParams() as {
    slug: string
    sectionId: string
    lectureId: string
  }

  const searchParams = useSearchParams()
  const quizId = searchParams.get('quizId')
  const [loading, setLoading] = useState(true)
  const [quizData, setQuizData] = useState(null)
  const [courseId, setCourseId] = useState<string>('')

  // Step 1: Resolve courseId from slug
  useEffect(() => {
    const fetchCourseId = async () => {
      try {
        const res = await axios.get(`${baseURL}/courses/${slug}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setCourseId(res.data.data._id)
      } catch (err) {
        toast.error('Failed to fetch course ID')
      }
    }

    if (slug && token) {
      fetchCourseId()
    }
  }, [slug, token])

  // Step 2: Fetch quiz details
  useEffect(() => {
    const fetchQuizDetails = async (id: string) => {
      try {
        const res = await axios.get(`${baseURL}/quizzes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        return res.data.quiz
      } catch (error) {
        console.error('Failed to fetch quiz details:', error)
        toast.error('Failed to fetch quiz')
        return null
      }
    }

    const loadQuizData = async () => {
      if (quizId) {
        const data = await fetchQuizDetails(quizId)
        setQuizData(data)
      }
      setLoading(false)
    }

    loadQuizData()
  }, [quizId, token])

  if (loading)
    return <div className='text-center py-8'>Loading quiz details...</div>

  return (
    <div className='max-w-3xl mx-auto px-6 py-8'>
      <h2 className='text-2xl font-bold text-indigo-700 mb-6'>
        {quizData ? '📗 Edit Quiz' : '➕ Create New Quiz'}
      </h2>

      {courseId && (
        <QuizForm
          initialData={quizData || undefined}
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
