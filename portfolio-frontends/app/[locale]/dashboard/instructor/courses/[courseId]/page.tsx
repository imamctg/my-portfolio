'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Input } from 'components/ui/input'
import { Textarea } from 'components/ui/textarea'
import { Button } from 'components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { Label } from 'components/ui/label'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
export default function EditCoursePage() {
  const token = useSelector((state: RootState) => state.auth.token)
  const { courseId } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [course, setCourse] = useState<any>({
    title: '',
    description: '',
    price: '',
    level: '',
    language: '',
    category: '',
    thumbnail: '',
  })

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${baseURL}/courses/${courseId}`)
        setCourse(res.data.data)
      } catch (error) {
        console.error('Error loading course', error)
      } finally {
        setLoading(false)
      }
    }

    if (courseId) fetchCourse()
  }, [courseId])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setCourse((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnailFile(file)
      setCourse((prev: any) => ({
        ...prev,
        thumbnail: URL.createObjectURL(file),
      }))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('title', course.title)
      formData.append('description', course.description)
      formData.append('price', course.price)
      formData.append('level', course.level)
      formData.append('language', course.language)
      formData.append('category', course.category)

      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile)
      }

      await axios.put(`${baseURL}/courses/${courseId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success('Course updated successfully!')
      router.push(`/dashboard/instructor/courses`)
    } catch (error) {
      console.error(error)
      toast.error('Failed to update course')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className='p-8 flex items-center justify-center'>
        <Loader2 className='w-6 h-6 animate-spin mr-2' />
        Loading...
      </div>
    )
  }

  return (
    <div className='max-w-3xl mx-auto p-6 space-y-6'>
      <h1 className='text-2xl font-bold'>Edit Course</h1>

      <div className='space-y-4'>
        <div>
          <Label htmlFor='title'>Title</Label>
          <Input
            name='title'
            value={course.title || ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor='description'>Description</Label>
          <Textarea
            name='description'
            value={course.description || ''}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='price'>Price ($)</Label>
            <Input
              name='price'
              type='number'
              value={course.price || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor='level'>Level</Label>
            <Input
              name='level'
              value={course.level || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor='language'>Language</Label>
            <Input
              name='language'
              value={course.language || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor='category'>Category</Label>
            <Input
              name='category'
              value={course.category || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <Label htmlFor='thumbnail'>Thumbnail Image</Label>
          <Input
            type='file'
            accept='image/*'
            onChange={handleThumbnailChange}
          />
          {course.thumbnail && (
            <Image
              src={course.thumbnail}
              alt='Course Thumbnail'
              width={600}
              height={300}
              className='mt-4 rounded border shadow'
            />
          )}
        </div>
      </div>

      <div className='pt-4 flex justify-end'>
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
          Save Changes
        </Button>
      </div>
    </div>
  )
}
