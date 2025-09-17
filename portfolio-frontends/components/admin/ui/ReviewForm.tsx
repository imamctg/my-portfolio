'use client'

import { Button } from 'components/ui/button'
import { Label } from 'components/ui/label'
import { Textarea } from 'components/ui/textarea'
import { reviewCourse } from 'features/course/redux/courseStatusSlice'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

interface Props {
  courseId: string
}

export default function ReviewForm({ courseId }: Props) {
  const [decision, setDecision] = useState<
    'approved' | 'rejected' | 'changes_requested'
  >('approved')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useDispatch()

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      await (dispatch as any)(reviewCourse({ courseId, decision, notes }))

      // react-hot-toast সঠিক ব্যবহার
      toast.success(`Course ${decision}`)
    } catch (error: any) {
      toast.error(error.message || 'Review failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  // RadioGroup এর বিকল্প হিসেবে সাধারণ buttons ব্যবহার করা হচ্ছে
  const renderDecisionButtons = () => {
    const decisions = [
      {
        value: 'approved',
        label: 'Approve',
        color: 'bg-green-500 hover:bg-green-600',
      },
      {
        value: 'changes_requested',
        label: 'Request Changes',
        color: 'bg-yellow-500 hover:bg-yellow-600',
      },
      {
        value: 'rejected',
        label: 'Reject',
        color: 'bg-red-500 hover:bg-red-600',
      },
    ]

    return (
      <div className='flex gap-2 flex-wrap'>
        {decisions.map((item) => (
          <Button
            key={item.value}
            className={`${item.color} ${
              decision === item.value
                ? 'ring-2 ring-offset-2 ring-blue-500'
                : ''
            }`}
            onClick={() => setDecision(item.value as any)}
          >
            {item.label}
          </Button>
        ))}
      </div>
    )
  }

  return (
    <div className='mt-4 space-y-4'>
      <div className='space-y-2'>
        <Label>Decision</Label>
        {renderDecisionButtons()}
      </div>

      <div className='space-y-2'>
        <Label>Feedback</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder='Add your feedback here...'
          rows={3}
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className='w-full md:w-auto'
      >
        {isSubmitting ? (
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Submitting...
          </>
        ) : (
          'Submit Review'
        )}
      </Button>
    </div>
  )
}
