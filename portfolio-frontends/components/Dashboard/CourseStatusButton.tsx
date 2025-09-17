'use client'
import axios from 'axios'
import { Button } from 'components/ui/button'
import { RootState } from 'features/redux/store'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
const CourseStatusButton = ({ course, onUpdate }) => {
  const token = useSelector((state: RootState) => state.auth.token)
  const [loading, setLoading] = useState(false)

  const handleAction = async (action: string) => {
    setLoading(true)
    try {
      await axios.post(`${baseURL}/courses/${course._id}/${action}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      onUpdate() // Refresh course data
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-x-2'>
      {course.status === 'draft' && (
        <Button onClick={() => handleAction('submit')} disabled={loading}>
          Submit for Review
        </Button>
      )}

      {course.status === 'approved' && (
        <Button onClick={() => handleAction('publish')} disabled={loading}>
          Publish Course
        </Button>
      )}
    </div>
  )
}

export default CourseStatusButton
