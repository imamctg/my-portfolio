'use client'

import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { toast, Toaster } from 'react-hot-toast'
import { updateUser } from 'features/auth/redux/authSlice'
import { Eye, EyeOff } from 'lucide-react'
import { RootState } from 'features/redux/store'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
export default function AccountSettingsPage() {
  const dispatch = useDispatch()
  const user = useSelector((state: any) => state.auth.user)
  const token =
    useSelector((state: RootState) => state.auth.token) ||
    (typeof window !== 'undefined' && localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')!).token
      : null)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const validatePassword = (password: string) => {
    const regex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/
    return regex.test(password)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = []

    if (password) {
      if (!validatePassword(password)) {
        newErrors.push(
          'Password must be at least 8 characters, include a capital letter, number, and special character.'
        )
      }

      if (password !== confirmPassword) {
        newErrors.push('Passwords do not match.')
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setErrors([])
      setLoading(true)

      const formData = new FormData()
      formData.append('name', name)
      formData.append('email', email)
      if (password) formData.append('password', password)
      if (profileImage) formData.append('profileImage', profileImage)

      const userId = user?.id || user?._id

      const res = await axios.put(`${baseURL}/user/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      const updatedUser = res.data.user
      const storedToken = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')!).token
        : null

      if (storedToken) {
        const newUserData = {
          user: updatedUser,
          profileImage: updatedUser.profileImage,
          storedToken,
        }
        localStorage.setItem('user', JSON.stringify(newUserData))
      }

      dispatch(
        updateUser({ name, email, profileImage: updatedUser.profileImage })
      )
      toast.success('✅ Account updated successfully!')
    } catch (err) {
      console.error(err)
      toast.error('❌ Failed to update account.')
    } finally {
      setLoading(false)
    }
  }
  console.log(user, 'user...')
  return (
    <div className='max-w-2xl mx-auto p-6 mt-12 bg-white rounded-2xl shadow-md'>
      <Toaster position='top-right' reverseOrder={false} />
      <h1 className='text-3xl font-semibold mb-6 text-center text-blue-600'>
        ⚙️ Account Settings
      </h1>

      {errors.length > 0 && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6'>
          <ul className='list-disc list-inside space-y-1'>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleUpdate} className='space-y-6'>
        <div>
          <label className='block text-gray-700 font-medium mb-1'>
            Full Name
          </label>
          <input
            type='text'
            className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={name}
            placeholder={user?.name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className='block text-gray-700 font-medium mb-1'>Email</label>
          <input
            type='email'
            className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={email}
            placeholder={user?.email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className='block text-gray-700 font-medium mb-1'>
            New Password
          </label>
          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              className='w-full px-4 py-2 border rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter new password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type='button'
              className='absolute top-2.5 right-3 text-gray-500'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label className='block text-gray-700 font-medium mb-1'>
            Confirm Password
          </label>
          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              className='w-full px-4 py-2 border rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Re-type new password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type='button'
              className='absolute top-2.5 right-3 text-gray-500'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {password && (
          <div className='text-sm text-gray-500 -mt-4'>
            <p>Password must include:</p>
            <ul className='list-disc ml-5'>
              <li>At least 8 characters</li>
              <li>One uppercase letter</li>
              <li>One number</li>
              <li>One special character</li>
            </ul>
          </div>
        )}

        <div>
          <label className='block text-gray-700 font-medium mb-1'>
            Profile Image
          </label>
          <input
            type='file'
            accept='image/*'
            className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200'
            onChange={(e) =>
              setProfileImage(e.target.files ? e.target.files[0] : null)
            }
          />
        </div>

        <div className='pt-4'>
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all duration-300 disabled:opacity-60'
          >
            {loading ? 'Updating...' : 'Update Account'}
          </button>
        </div>
      </form>
    </div>
  )
}
