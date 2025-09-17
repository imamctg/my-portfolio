'use client'

import { submitForReview } from 'app/[locale]/services/courseService'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'

const SubmitForReviewButton = ({ courseId }: { courseId: string }) => {
  const router = useRouter()
  const token = useSelector((state: RootState) => state.auth.token)

  const handleSubmit = async () => {
    try {
      await submitForReview(courseId, token) // ✅ ২টি argument পাঠানো হলো
      router.reload()
      alert('Course submitted for review successfully!')
    } catch (error) {
      alert('Failed to submit course for review')
    }
  }

  return (
    <button
      onClick={handleSubmit}
      className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
    >
      Submit for Review
    </button>
  )
}

export default SubmitForReviewButton
