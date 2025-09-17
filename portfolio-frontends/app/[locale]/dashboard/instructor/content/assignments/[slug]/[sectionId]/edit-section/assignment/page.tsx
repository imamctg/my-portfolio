'use client'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { RootState } from 'features/redux/store'
import { toast } from 'react-hot-toast'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

const EditSectionAssignmentPage = () => {
  const { courseId, sectionId } = useParams() as {
    courseId: string
    sectionId: string
  }

  const token = useSelector((state: RootState) => state.auth.token)
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [instructions, setInstructions] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [totalMarks, setTotalMarks] = useState(20)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await axios.get(
          `${baseURL}/courses/sections/${sectionId}/assignment`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        const assignment = res.data.assignment
        if (assignment) {
          setTitle(assignment.title)
          setInstructions(assignment.instructions)
          setDueDate(assignment.dueDate?.substring(0, 10))
          setTotalMarks(assignment.totalMarks)
        }
      } catch {
        // Optional if no assignment yet
      }
    }
    fetchAssignment()
  }, [token, sectionId])

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Title is required')
      return
    }

    setLoading(true)
    try {
      await axios.put(
        `${baseURL}/courses/sections/${sectionId}/assignment`,
        {
          title,
          instructions,
          dueDate,
          totalMarks,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      toast.success('Assignment saved successfully')
      router.push(
        `/dashboard/instructor/content/curriculum/${courseId}/${sectionId}/edit-section`
      )
    } catch {
      toast.error('Failed to save assignment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-2xl mx-auto p-6'>
      <h2 className='text-xl font-bold text-teal-700 mb-4'>
        📝 Section Assignment
      </h2>

      <div className='space-y-4'>
        <div>
          <label className='block font-medium'>Assignment Title</label>
          <input
            className='w-full border p-2 rounded'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className='block font-medium'>Instructions</label>
          <textarea
            className='w-full border p-2 rounded'
            rows={4}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block font-medium'>Due Date</label>
            <input
              type='date'
              className='w-full border p-2 rounded'
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div>
            <label className='block font-medium'>Total Marks</label>
            <input
              type='number'
              className='w-full border p-2 rounded'
              value={totalMarks}
              onChange={(e) => setTotalMarks(Number(e.target.value))}
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className='bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 disabled:opacity-50'
        >
          {loading ? 'Saving...' : 'Save Assignment'}
        </button>
      </div>
    </div>
  )
}

export default EditSectionAssignmentPage
