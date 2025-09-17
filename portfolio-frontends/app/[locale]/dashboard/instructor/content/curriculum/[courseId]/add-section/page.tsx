'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { Input } from 'components/ui/input'
import { Button } from 'components/ui/button'
import { toast } from 'sonner'
import { Label } from 'components/ui/label'
import { RootState } from 'features/redux/store'
import { useSelector } from 'react-redux'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
export default function AddSectionPage() {
  const token = useSelector((state: RootState) => state.auth.token)
  const { courseId } = useParams()
  const { sectionId } = useParams()
  const router = useRouter()

  const [sectionName, setSectionName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddSection = async () => {
    if (!sectionName) return toast.error('Section name is required')
    setLoading(true)
    try {
      await axios.post(
        `${baseURL}/courses/${courseId}/section`,
        {
          courseId,
          title: sectionName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      toast.success('Section added successfully!')
      router.push(`/dashboard/instructor/content/curriculum/${courseId}`)
    } catch (err) {
      toast.error('Failed to add section')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-4'>➕ Add Section</h1>
      <Label htmlFor='sectionName'>Section Title</Label>
      <Input
        id='sectionName'
        placeholder='e.g., Introduction, Chapter 1'
        value={sectionName}
        onChange={(e) => setSectionName(e.target.value)}
        className='mb-4'
      />
      <Button onClick={handleAddSection} disabled={loading}>
        {loading ? 'Adding...' : 'Add Section'}
      </Button>
    </div>
  )
}
