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
      if (!token || !courseId || !sectionId) return
      try {
        const res = await axios.get(`${baseURL}/courses/${courseId}/sections`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const allSections = res.data.sections || []
        const matchedSection = allSections.find((s: any) => s._id === sectionId)

        if (!matchedSection) {
          toast.error('Section not found')
          return
        }

        setTitle(matchedSection.title)
        setDescription(matchedSection.description || '')
        setIsPublished(matchedSection.isPublished || false)
      } catch (err) {
        toast.error('Failed to load section data')
      }
    }

    fetchSection()
  }, [token, courseId, sectionId])

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

      await axios.put(
        `${baseURL}/courses/${courseId}/sections/${sectionId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

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
