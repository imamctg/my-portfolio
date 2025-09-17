'use client'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { RootState } from 'features/redux/store'
import { toast } from 'react-hot-toast'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

const EditSectionPage = () => {
  const { courseId, sectionId } = useParams() as {
    courseId: string
    sectionId: string
  }
  const token = useSelector((state: RootState) => state.auth.token)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [resourceFile, setResourceFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchSection = async () => {
      if (!token) return
      try {
        const res = await axios.get(
          `${baseURL}/courses/sections/${sectionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        const section = res.data.section
        setTitle(section.title)
        setDescription(section.description || '')
        setIsPublished(section.isPublished || false)
      } catch (err) {
        toast.error('Failed to load section data')
      }
    }
    fetchSection()
  }, [token, sectionId])

  const handleUpdate = async () => {
    if (!title.trim()) {
      toast.error('Title is required')
      return
    }
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('isPublished', JSON.stringify(isPublished))
      if (resourceFile) formData.append('resourceFile', resourceFile)

      await axios.put(`${baseURL}/courses/sections/${sectionId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success('Section updated successfully')
      router.push(`/dashboard/instructor/content/curriculum/${courseId}`)
    } catch (err) {
      toast.error('Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-3xl mx-auto p-6'>
      <h2 className='text-2xl font-bold text-indigo-700 mb-4'>
        ✏️ Edit Section
      </h2>

      <div className='space-y-4'>
        <div>
          <label className='block mb-1 font-medium'>Title</label>
          <input
            type='text'
            className='w-full border rounded p-2'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className='block mb-1 font-medium'>Description</label>
          <textarea
            className='w-full border rounded p-2'
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className='block mb-1 font-medium'>
            📎 Upload Resource File (PDF, ZIP, etc)
          </label>
          <input
            type='file'
            accept='.pdf,.zip,.docx'
            onChange={(e) => setResourceFile(e.target.files?.[0] || null)}
          />
        </div>

        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            id='publish'
            checked={isPublished}
            onChange={() => setIsPublished((prev) => !prev)}
          />
          <label htmlFor='publish' className='font-medium'>
            ✅ Publish this Section
          </label>
        </div>

        <div className='flex items-center gap-4 pt-4'>
          <button
            onClick={() =>
              router.push(
                `/dashboard/instructor/content/curriculum/${courseId}/${sectionId}/edit-section/quiz`
              )
            }
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
          >
            📘 Edit Section Quiz
          </button>

          <button
            onClick={() =>
              router.push(
                `/dashboard/instructor/content/curriculum/${courseId}/${sectionId}/edit-section/assignment`
              )
            }
            className='bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600'
          >
            📝 Edit Section Assignment
          </button>
        </div>
      </div>

      <div className='mt-6 flex justify-end'>
        <button
          onClick={handleUpdate}
          disabled={loading}
          className='bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50'
        >
          {loading ? 'Updating...' : 'Update Section'}
        </button>
      </div>
    </div>
  )
}

export default EditSectionPage
