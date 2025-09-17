'use client'

import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'

interface Props {
  courseId: string
}

const ConfirmEnrollmentButton = ({ courseId }: Props) => {
  const router = useRouter()
  const user = useSelector((state: RootState) => state.auth.user)

  const handleClick = () => {
    if (!user) {
      router.push(`/login?redirect=/checkout/${courseId}`)
    } else {
      router.push(`/payment/initiate?course=${courseId}`)
    }
  }

  return (
    <button
      onClick={handleClick}
      className='bg-blue-600 text-white px-4 py-2 rounded'
    >
      Confirm Enrollment
    </button>
  )
}

export default ConfirmEnrollmentButton
