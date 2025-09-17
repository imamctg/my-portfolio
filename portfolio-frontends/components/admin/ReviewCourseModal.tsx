// src/components/admin/ReviewCourseModal.tsx
import { reviewCourse } from 'app/[locale]/services/courseService'
import { RootState } from 'features/redux/store'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
// import { reviewCourse } from '@/services/courseService';

const ReviewCourseModal = ({
  courseId,
  onClose,
}: {
  courseId: string
  onClose: () => void
}) => {
  const token = useSelector((state: RootState) => state.auth.token)
  const [decision, setDecision] = useState<
    'approved' | 'rejected' | 'changes_requested'
  >('approved')
  const [notes, setNotes] = useState('')

  const handleSubmit = async () => {
    try {
      await reviewCourse(courseId, decision, token, notes) // token যোগ করুন
      onClose()
      toast.success('Review submitted successfully!')
      // window.location.reload() এর পরিবর্তে callback ব্যবহার করুন
      if (typeof window !== 'undefined') {
        window.location.reload()
      }
    } catch (error) {
      toast.error('Failed to submit review')
      console.error('Review submission error:', error)
    }
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='bg-white p-6 rounded-lg w-96'>
        <h2 className='text-xl font-bold mb-4'>Review Course</h2>

        <div className='mb-4'>
          <label className='block mb-2'>Decision:</label>
          <select
            value={decision}
            onChange={(e) => setDecision(e.target.value as any)}
            className='w-full p-2 border rounded'
          >
            <option value='approved'>Approve</option>
            <option value='changes_requested'>Request Changes</option>
            <option value='rejected'>Reject</option>
          </select>
        </div>

        <div className='mb-4'>
          <label className='block mb-2'>Notes:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className='w-full p-2 border rounded'
            rows={4}
          />
        </div>

        <div className='flex justify-end gap-2'>
          <button onClick={onClose} className='px-4 py-2 border rounded'>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReviewCourseModal
