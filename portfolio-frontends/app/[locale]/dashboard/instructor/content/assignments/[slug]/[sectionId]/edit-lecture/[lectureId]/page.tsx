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

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
export default function EditLecturePage() {
  const token = useSelector((state: RootState) => state.auth.token)
  const { courseId, sectionId, lectureId } = useParams()
  const router = useRouter()

  const [form, setForm] = useState({
    title: '',
    description: '',
  })
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [resourceFile, setResourceFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

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

        console.log(res, 'res')
        const { title, description } = res.data.data
        setForm({ title, description })
      } catch {
        toast.error('Failed to load lecture')
      } finally {
        setLoading(false)
      }
    }

    if (lectureId) fetchLecture()
  }, [lectureId, courseId, sectionId])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdate = async () => {
    if (!form.title.trim()) return toast.error('Title is required')

    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('description', form.description)

    if (videoFile) formData.append('video', videoFile)
    if (resourceFile) formData.append('resource', resourceFile)

    setSaving(true)
    try {
      await axios.put(
        `${baseURL}/courses/${courseId}/sections/${sectionId}/lectures/${lectureId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      toast.success('Lecture updated successfully!')
      router.push(`/dashboard/instructor/content/curriculum/${courseId}`)
    } catch {
      toast.error('Failed to update lecture')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className='p-6'>Loading...</div>

  return (
    <div className='max-w-xl mx-auto p-6'>
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
          <Label htmlFor='video'>Upload Video</Label>
          <Input
            type='file'
            accept='video/*'
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
          />
        </div>
        <div>
          <Label htmlFor='resource'>Attach Resource</Label>
          <Input
            type='file'
            onChange={(e) => setResourceFile(e.target.files?.[0] || null)}
          />
        </div>
      </div>

      <div className='pt-4'>
        <Button onClick={handleUpdate} disabled={saving}>
          {saving ? 'Updating...' : 'Update Lecture'}
        </Button>
      </div>
    </div>
  )
}
