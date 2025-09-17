'use client'

import { useParams, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'
import QuizForm from 'components/Quiz/QuizForm'

export default function EditSectionQuizPage() {
  const { courseId, sectionId } = useParams() as {
    courseId: string
    sectionId: string
  }
  const token = useSelector((state: RootState) => state.auth.token)
  const router = useRouter()

  return (
    <div className='max-w-3xl mx-auto px-6 py-8'>
      <h2 className='text-2xl font-bold text-indigo-700 mb-6'>
        📘 Edit Section Quiz
      </h2>
      <QuizForm
        parentId={sectionId}
        courseId={courseId}
        parentType='section'
        token={token}
        onSuccess={() =>
          router.push(
            `/dashboard/instructor/content/curriculum/${courseId}/${sectionId}/edit-section`
          )
        }
      />
    </div>
  )
}
