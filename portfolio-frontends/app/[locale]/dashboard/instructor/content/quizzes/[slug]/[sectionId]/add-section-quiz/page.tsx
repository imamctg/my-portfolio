'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'
import QuizForm from 'components/Quiz/QuizForm'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function AddSectionQuizPage() {
  const { slug, sectionId } = useParams() as {
    slug: string
    sectionId: string
  }

  const token = useSelector((state: RootState) => state.auth.token)
  const router = useRouter()
  const [courseId, setCourseId] = useState<string>('')

  useEffect(() => {
    const fetchCourseId = async () => {
      if (!slug || !token) return
      try {
        const res = await axios.get(`${baseURL}/courses/${slug}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setCourseId(res.data.data._id)
      } catch (err) {
        toast.error('Failed to load course info')
      }
    }

    fetchCourseId()
  }, [slug, token])

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>Add Section Quiz</h1>
      {courseId && (
        <QuizForm
          parentId={sectionId}
          parentType='section'
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
