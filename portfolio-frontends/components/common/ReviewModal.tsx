'use client'

import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { Star } from 'lucide-react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'

interface Props {
  isOpen: boolean
  onClose: () => void
  courseId: string
}
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
const ReviewModal = ({ isOpen, onClose, courseId }: Props) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const token = useSelector((state: RootState) => state.auth.token)

  const submitReview = async () => {
    if (!rating || !comment) return
    try {
      setLoading(true)

      await axios.post(
        `${baseURL}/reviews/submit`,
        {
          courseId,
          rating,
          comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      onClose()
    } catch (err) {
      console.error('Review error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className='relative z-50'>
      <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
      <div className='fixed inset-0 flex items-center justify-center'>
        <Dialog.Panel className='bg-white rounded-xl p-6 shadow-lg max-w-md w-full'>
          <Dialog.Title className='text-lg font-bold mb-4'>
            Submit Your Review
          </Dialog.Title>
          <div className='flex mb-4 gap-1'>
            {[1, 2, 3, 4, 5].map((num) => (
              <Star
                key={num}
                className={`w-6 h-6 cursor-pointer ${
                  num <= rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
                onClick={() => setRating(num)}
              />
            ))}
          </div>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder='Write your feedback here...'
            className='w-full border rounded-lg p-2 text-sm'
          />
          <div className='flex justify-end mt-4 gap-2'>
            <button
              onClick={onClose}
              className='text-sm px-3 py-1 rounded border border-gray-300 hover:bg-gray-100'
            >
              Cancel
            </button>
            <button
              onClick={submitReview}
              disabled={loading}
              className='text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700'
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default ReviewModal
