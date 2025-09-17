'use client'

import { use, useEffect, useState } from 'react'
import { FaStar } from 'react-icons/fa'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'
import { Review } from 'types/review'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
export default function InstructorReviewsPage() {
  const token = useSelector((state: RootState) => state.auth.token)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return // 🔒 Prevent unauthorized call

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${baseURL}/reviews/instructor`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        console.log(res.data, 'res.data')
        setReviews(res.data)
      } catch (error) {
        console.error(error)
        toast.error('Failed to fetch reviews')
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [token])
  console.log(reviews, 'reviews')
  return (
    <div className='p-6'>
      <h2 className='text-3xl font-semibold mb-6'>⭐ Student Reviews</h2>

      {loading ? (
        <p className='text-gray-600'>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <div className='bg-white p-6 rounded shadow text-center text-gray-500'>
          No reviews found for your courses.
        </div>
      ) : (
        <div className='space-y-4'>
          {reviews.map((review) => (
            <div
              key={review._id}
              className='bg-white rounded shadow p-5 border border-gray-100 hover:shadow-md transition'
            >
              <div className='flex justify-between items-center mb-2'>
                <div className='text-lg font-semibold'>
                  {review.courseTitle}
                </div>
                <div className='text-sm text-gray-500'>
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className='flex items-center gap-2 mb-1'>
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`${
                      i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className='text-sm text-gray-600'>
                  ({review.rating}/5)
                </span>
              </div>

              <p className='text-gray-700 italic'>"{review.comment}"</p>

              <div className='mt-2 text-sm text-gray-500'>
                — {review.studentName}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
