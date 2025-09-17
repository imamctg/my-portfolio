'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { loginSuccess } from 'features/auth/redux/authSlice'

const RestoreAuth = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const userFromStorage = localStorage.getItem('user')
    const tokenFromStorage = localStorage.getItem('token')

    if (
      userFromStorage &&
      tokenFromStorage &&
      userFromStorage !== 'undefined' &&
      tokenFromStorage !== 'undefined'
    ) {
      try {
        const user = JSON.parse(userFromStorage)
        // token যদি সিম্পল string (JWT) হয়, তাহলে সরাসরি ব্যবহার করুন:
        const token = tokenFromStorage
        dispatch(loginSuccess({ user, token }))
      } catch (error) {
        console.error('❌ Failed to parse auth data:', error)
      }
    }
  }, [dispatch])

  return null
}

export default RestoreAuth
