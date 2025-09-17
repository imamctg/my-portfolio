'use client'

import { useAppSelector } from 'features/redux/hooks'
import { RootState } from 'features/redux/store'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export default function StatusNotification() {
  const lastStatusChange = useAppSelector(
    (state: RootState) => state.courseStatus.lastStatusChange
  )

  useEffect(() => {
    if (!lastStatusChange) return

    const { newStatus, courseTitle } = lastStatusChange
    const message = `"${courseTitle}" status changed to ${newStatus.replace(
      '_',
      ' '
    )}`

    if (newStatus === 'approved') toast.success(message)
    else if (newStatus === 'rejected') toast.error(message)
    else toast(message)
  }, [lastStatusChange])

  return null
}
