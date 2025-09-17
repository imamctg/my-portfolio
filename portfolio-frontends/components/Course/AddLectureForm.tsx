'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from 'components/ui/button'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Textarea } from 'components/ui/textarea'
import { Input } from 'components/ui/input'
import { RootState } from 'features/redux/store'
import { useSelector } from 'react-redux'
import { LectureResource } from 'types/lecture'

interface AddLectureFormProps {
  courseId: string
  sectionId: string
  onSuccess?: () => void
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
export default function AddLectureForm({
  courseId,
  sectionId,
  onSuccess,
}: AddLectureFormProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const token = useSelector((state: RootState) => state.auth.token)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [isFreePreview, setIsFreePreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resources, setResources] = useState<LectureResource[]>([])
  const [progress, setProgress] = useState({
    percentage: 0,
    message: 'Preparing to upload...',
  })

  // Update the handleSubmit function in AddLectureForm.tsx
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !videoFile) {
      return toast.error(t('allFieldsRequired'))
    }

    try {
      setIsSubmitting(true)
      setProgress({ percentage: 0, message: 'Preparing files...' })

      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('isFreePreview', String(isFreePreview))
      formData.append('video', videoFile)

      // Process all resources consistently
      const processedResources = resources
        .map((resource) => {
          if (resource.type === 'file' && resource.file) {
            return {
              type: 'file',
              name: resource.name || resource.file.name,
              file: resource.file, // This will be handled separately in FormData
            }
          } else if (resource.type === 'link') {
            return {
              type: 'link',
              name: resource.name || resource.url,
              url: resource.url,
            }
          }
          return null
        })
        .filter(Boolean)

      // Append resources as JSON string
      formData.append('resources', JSON.stringify(processedResources))

      // Append file resources to FormData
      resources.forEach((resource, index) => {
        if (resource.type === 'file' && resource.file) {
          formData.append(`resourceFiles`, resource.file)
        }
      })

      // Final upload progress
      setProgress({ percentage: 95, message: 'Finalizing lecture creation...' })
      const res = await axios.post(
        `${baseURL}/courses/${courseId}/sections/${sectionId}/lectures`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              )
              setProgress({
                percentage: percentCompleted,
                message: 'Uploading files...',
              })
            }
          },
        }
      )

      setProgress({ percentage: 100, message: 'Lecture added successfully!' })
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (res.data.success) {
        toast.success(t('lectureAddedSuccessfully'))
        // Reset form
        setTitle('')
        setDescription('')
        setVideoFile(null)
        setResources([])
        setIsFreePreview(false)

        if (onSuccess) {
          onSuccess()
        } else {
          router.refresh()
        }
      } else {
        throw new Error(res.data.message || 'Failed to add lecture')
      }
    } catch (error: any) {
      console.error('Error adding lecture:', error)
      // More detailed error logging
      if (error.response) {
        console.error('Response data:', error.response.data)
        console.error('Response status:', error.response.status)
        console.error('Response headers:', error.response.headers)
      }
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          t('somethingWentWrong')
      )
    } finally {
      setIsSubmitting(false)
      setProgress({ percentage: 0, message: '' })
    }
  }

  return (
    <>
      {/* Loading overlay */}
      {isSubmitting && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg max-w-md w-full'>
            <div className='flex items-center space-x-4 mb-4'>
              <Loader2 className='animate-spin h-8 w-8 text-blue-500' />
              <div>
                <h3 className='font-semibold text-lg'>Adding Lecture</h3>
                <p className='text-gray-600'>{progress.message}</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className='w-full bg-gray-200 rounded-full h-2.5'>
              <div
                className='bg-blue-600 h-2.5 rounded-full'
                style={{ width: `${progress.percentage}%` }}
              ></div>
            </div>

            <p className='text-right mt-1 text-sm text-gray-500'>
              {progress.percentage}% complete
            </p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className='space-y-6 bg-white p-6 rounded shadow'
      >
        {/* Title */}
        <div>
          <label className='block font-semibold mb-1'>
            {t('lectureTitle')}
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('enterLectureTitle')}
            required
          />
        </div>

        {/* Video Upload */}
        <div>
          <label className='block font-semibold mb-1'>{t('uploadVideo')}</label>
          <Input
            type='file'
            accept='video/*'
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className='block font-semibold mb-1'>{t('description')}</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('optionalDescription')}
          />
        </div>

        {/* Free Preview Checkbox */}
        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            checked={isFreePreview}
            onChange={(e) => setIsFreePreview(e.target.checked)}
          />
          <label className='font-medium'>{t('freePreview')}</label>
        </div>

        {/* Resources Section */}
        <div className='space-y-2'>
          <label className='block font-medium'>Resources</label>
          {resources.map((resource, index) => (
            <div key={index} className='flex items-center gap-2 mb-2'>
              {resource.type === 'file' && resource.file && (
                <span className='text-sm'>{resource.file.name}</span>
              )}
              {resource.type === 'link' && (
                <input
                  type='url'
                  placeholder='https://example.com'
                  value={resource.url}
                  onChange={(e) => {
                    const updated = [...resources]
                    updated[index].url = e.target.value
                    setResources(updated)
                  }}
                  className='flex-1 border px-2 py-1 rounded text-sm'
                />
              )}
              <button
                type='button'
                onClick={() => {
                  const updated = [...resources]
                  updated.splice(index, 1)
                  setResources(updated)
                }}
                className='text-red-500 hover:text-red-700'
              >
                Remove
              </button>
            </div>
          ))}

          <div className='flex gap-2'>
            <button
              type='button'
              onClick={() =>
                setResources([
                  ...resources,
                  { type: 'file', name: '', url: '', file: null },
                ])
              }
              className='bg-gray-200 px-2 py-1 rounded text-sm'
            >
              Add File
            </button>
            <button
              type='button'
              onClick={() =>
                setResources([
                  ...resources,
                  { type: 'link', name: '', url: '' },
                ])
              }
              className='bg-gray-200 px-2 py-1 rounded text-sm'
            >
              Add Link
            </button>
          </div>

          {resources.map(
            (resource, index) =>
              resource.type === 'file' &&
              !resource.file && (
                <div key={`file-${index}`} className='mt-1'>
                  <input
                    type='file'
                    accept='.pdf,.zip,.png,.jpg,.jpeg'
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const updated = [...resources]
                        updated[index] = {
                          type: 'file',
                          name: file.name,
                          url: '',
                          file,
                        }
                        setResources(updated)
                      }
                    }}
                    className='w-full text-sm'
                  />
                </div>
              )
          )}
        </div>

        {/* Submit Button */}
        <Button type='submit' disabled={isSubmitting} className='w-full'>
          {isSubmitting && <Loader2 className='animate-spin w-4 h-4 mr-2' />}
          {t('addLecture')}
        </Button>
      </form>

      {!isSubmitting && (
        <div className='mt-6 text-center'>
          <button
            type='button'
            onClick={() =>
              router.push(
                `/en/dashboard/instructor/content/curriculum/${courseId}`
              )
            }
            className='text-blue-600 hover:underline text-sm'
          >
            🔙 View Curriculum
          </button>
        </div>
      )}
    </>
  )
}
