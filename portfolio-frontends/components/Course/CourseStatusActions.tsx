import toast from 'react-hot-toast' // সরাসরি toast ইম্পোর্ট করুন
import { useDispatch } from 'react-redux'
import { Loader2 } from 'lucide-react'
import {
  reviewCourse,
  submitForReview,
} from 'features/course/redux/courseStatusSlice'
import { Button } from 'components/ui/button'

interface Props {
  course: {
    _id: string
    status: string
    title: string
  }
  refreshCourse: () => void
  isAdmin?: boolean
}

export default function CourseStatusActions({
  course,
  refreshCourse,
  isAdmin = false,
}: Props) {
  const dispatch = useDispatch()

  const handleAction = async (action: string, notes?: string) => {
    try {
      if (action === 'submit') {
        await (dispatch as any)(submitForReview(course._id))
        toast.success('Course submitted for review')
      } else {
        await (dispatch as any)(
          reviewCourse({
            courseId: course._id,
            decision: action as any,
            notes,
          })
        )
        toast.success(`Course ${action}`)
      }
      refreshCourse()
    } catch (error: any) {
      toast.error(error.message || 'Action failed')
    }
  }

  if (isAdmin && course.status === 'under_review') {
    return (
      <div className='space-y-4'>
        <h3 className='font-medium'>Admin Actions</h3>
        <div className='flex gap-2 flex-wrap'>
          <Button
            className='bg-green-600 hover:bg-green-700 text-white'
            onClick={() => handleAction('approved')}
          >
            Approve
          </Button>
          <Button
            className='bg-yellow-500 hover:bg-yellow-600 text-white'
            onClick={() => handleAction('changes_requested')}
          >
            Request Changes
          </Button>
          <Button
            className='bg-red-500 hover:bg-red-600 text-white'
            onClick={() => handleAction('rejected')}
          >
            Reject
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-2'>
      {course.status === 'draft' && (
        <Button
          onClick={() => handleAction('submit')}
          className='w-full md:w-auto'
        >
          Submit for Review
        </Button>
      )}

      {course.status === 'approved' && (
        <Button
          className='bg-green-600 hover:bg-green-700 text-white w-full md:w-auto'
          onClick={() => handleAction('publish')}
        >
          Publish Course
        </Button>
      )}

      {course.status === 'changes_requested' && (
        <div className='space-y-2'>
          <p className='text-sm text-yellow-600'>Changes requested by admin</p>
          <Button
            onClick={() => handleAction('submit')}
            className='w-full md:w-auto'
          >
            Resubmit After Changes
          </Button>
        </div>
      )}
    </div>
  )
}
