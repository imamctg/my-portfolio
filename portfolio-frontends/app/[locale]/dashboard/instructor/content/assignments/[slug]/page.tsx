'use client'

import axios from 'axios'
import Link from 'next/link'
import { useEffect, useState, use } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useParams } from 'next/navigation'

interface Quiz {
  _id: string
  title: string
}

interface Assignment {
  _id: string
  title: string
}

interface Lecture {
  _id: string
  title: string
  duration: string
  quizzes?: Quiz[]
}

interface Section {
  _id: string
  title: string
  lectures: Lecture[]
  quiz?: Quiz
  assignment?: Assignment
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
const AssignmentPage = ({
  params,
}: {
  params: Promise<{ courseId: string }>
}) => {
  const { slug } = useParams()
  const token = useSelector((state: RootState) => state.auth.token)
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(false)
  const [courseId, setCourseId] = useState<string>('')

  useEffect(() => {
    const fetchCourseId = async () => {
      if (!slug || !token) return
      try {
        const res = await axios.get(`${baseURL}/courses/${slug}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.data?.data?._id) {
          setCourseId(res.data.data._id)
        } else {
          toast.error('Invalid course data received')
        }
      } catch (err) {
        toast.error('Failed to resolve course')
      }
    }

    fetchCourseId()
  }, [slug, token])

  useEffect(() => {
    const fetchSections = async () => {
      if (!token || !slug || !courseId) return
      setLoading(true)
      try {
        const res = await axios.get(`${baseURL}/courses/${courseId}/sections`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setSections(res.data.sections || [])
      } catch (err) {
        toast.error('Failed to load sections')
      } finally {
        setLoading(false)
      }
    }
    if (courseId) {
      fetchSections()
    }
  }, [token, courseId])

  const deleteAssignment = async (assignmentId: string) => {
    try {
      await axios.delete(`${baseURL}/assignments/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Assignment deleted')
      window.location.reload()
    } catch {
      toast.error('Failed to delete assignment')
    }
  }

  return (
    <div className='p-6 max-w-5xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold text-indigo-700'>📚 Assignments</h2>
      </div>

      {loading ? (
        <div className='text-center text-gray-500'>Loading...</div>
      ) : sections.length === 0 ? (
        <div className='text-center text-gray-500'>No sections found.</div>
      ) : (
        <div className='space-y-6'>
          {sections.map((section) => (
            <div
              key={section._id}
              className='bg-white border rounded-xl shadow-sm p-4'
            >
              {/* Section Header */}
              <div className='flex justify-between items-center mb-2'>
                <h3 className='text-lg font-semibold text-gray-800'>
                  {section.title}
                </h3>
              </div>

              {/* Lectures */}
              {section.lectures.length === 0 ? (
                <p className='text-sm text-gray-500 ml-2'>
                  No lectures in this section.
                </p>
              ) : (
                <ul className='pl-4 list-disc space-y-1'>
                  {section.lectures.map((lecture) => (
                    <li
                      key={lecture._id}
                      className='flex flex-col gap-1 text-sm text-gray-700'
                    >
                      <div>
                        <span>{lecture.title}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* Section-level  Assignment */}
              <div className='pl-4 text-sm mt-4 space-y-1 space-x-3'>
                {section.assignment ? (
                  <div>
                    📝 Assignment: {section.assignment.title}
                    <Link
                      href={`/dashboard/instructor/content/quizzes/${courseId}/${section._id}/edit-assignment`}
                    >
                      <button className='ml-2 text-green-600 hover:underline'>
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => deleteAssignment(section.assignment._id)}
                      className='ml-2 text-red-500 hover:underline'
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <Link
                    href={`/dashboard/instructor/content/quizzes/${courseId}/${section._id}/add-assignment`}
                  >
                    <button className='text-indigo-600 hover:underline'>
                      ➕ Add Assignment
                    </button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AssignmentPage
