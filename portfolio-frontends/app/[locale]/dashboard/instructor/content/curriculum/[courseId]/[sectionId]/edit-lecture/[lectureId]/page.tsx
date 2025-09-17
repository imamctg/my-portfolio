'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { Input } from 'components/ui/input'
import { Textarea } from 'components/ui/textarea'
import { Button } from 'components/ui/button'
import { toast } from 'sonner'
import { Label } from 'components/ui/label'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'
import { LectureResource } from 'types/lecture'
import { Loader2 } from 'lucide-react'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
export default function EditLecturePage() {
  const token = useSelector((state: RootState) => state.auth.token)
  const [resources, setResources] = useState<LectureResource[]>([])

  const { courseId, sectionId, lectureId } = useParams()
  const router = useRouter()

  const [form, setForm] = useState({
    title: '',
    description: '',
  })
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progress, setProgress] = useState({
    percentage: 0,
    message: 'Preparing to upload...',
  })

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        const res = await axios.get(
          `${baseURL}/courses/${courseId}/sections/${sectionId}/lectures/${lectureId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        console.log(res.data.data, 'res.data.data')
        const {
          title,
          description,
          resources: lectureResources,
        } = res.data.data
        setForm({ title, description })
        setResources(
          lectureResources?.map((r: any) => ({
            ...r,
            file: null, // We don't have the actual file, just the URL
          })) || []
        )
      } catch {
        toast.error('Failed to load lecture')
      } finally {
        setLoading(false)
      }
    }

    if (lectureId) fetchLecture()
  }, [lectureId, courseId, sectionId, token])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdate = async () => {
    if (!form.title.trim()) return toast.error('Title is required')

    try {
      setIsSubmitting(true)
      setProgress({ percentage: 0, message: 'Preparing files...' })

      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('description', form.description)

      // Process all resources
      const processedResources = resources
        .map((resource) => {
          if (resource.type === 'file') {
            return {
              type: 'file',
              name:
                resource.name ||
                (resource.file ? resource.file.name : resource.url),
              url: resource.url || '', // Keep existing URL if no new file
              file: resource.file || undefined,
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

      formData.append('resources', JSON.stringify(processedResources))

      if (videoFile) {
        formData.append('video', videoFile)
      }

      // Add file resources to FormData
      resources.forEach((resource) => {
        if (resource.type === 'file' && resource.file) {
          formData.append('resourceFiles', resource.file)
        }
      })

      // Final upload progress
      setProgress({ percentage: 95, message: 'Finalizing lecture update...' })

      await axios.put(
        `${baseURL}/courses/${courseId}/sections/${sectionId}/lectures/${lectureId}`,
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

      setProgress({ percentage: 100, message: 'Lecture updated successfully!' })
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast.success('Lecture updated successfully!')
      router.push(`/dashboard/instructor/content/curriculum/${courseId}`)
    } catch (error: any) {
      console.error('Error updating lecture:', error)
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          'Failed to update lecture'
      )
    } finally {
      setIsSubmitting(false)
      setProgress({ percentage: 0, message: '' })
    }
  }

  if (loading) return <div className='p-6'>Loading...</div>

  return (
    <div className='max-w-xl mx-auto p-6'>
      {/* Loading overlay */}
      {isSubmitting && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg max-w-md w-full'>
            <div className='flex items-center space-x-4 mb-4'>
              <Loader2 className='animate-spin h-8 w-8 text-blue-500' />
              <div>
                <h3 className='font-semibold text-lg'>Updating Lecture</h3>
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

      <h1 className='text-2xl font-bold mb-4'>✏️ Edit Lecture</h1>

      <div className='space-y-4'>
        <div>
          <Label htmlFor='title'>Title</Label>
          <Input name='title' value={form.title} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor='description'>Description</Label>
          <Textarea
            name='description'
            rows={3}
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor='video'>
            Upload Video (Leave empty to keep current)
          </Label>
          <Input
            type='file'
            accept='video/*'
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
          />
        </div>

        {/* Resources section */}
        <div className='space-y-2'>
          <label className='block font-medium'>Resources</label>
          {resources.map((resource, index) => (
            <div key={index} className='flex items-center gap-2 mb-2'>
              {resource.type === 'file' ? (
                resource.file ? (
                  <span className='text-sm'>{resource.file.name}</span>
                ) : (
                  <span className='text-sm'>{resource.name}</span>
                )
              ) : (
                <input
                  type='url'
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
              !resource.file &&
              !resource.url && (
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
      </div>

      <div className='pt-4'>
        <Button onClick={handleUpdate} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className='animate-spin w-4 h-4 mr-2' />}
          {isSubmitting ? 'Updating...' : 'Update Lecture'}
        </Button>
      </div>
    </div>
  )
}
