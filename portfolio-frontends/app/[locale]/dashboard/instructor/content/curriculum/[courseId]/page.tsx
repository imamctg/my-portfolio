'use client'

import axios from 'axios'
import Link from 'next/link'
import { useEffect, useState, use } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useParams } from 'next/navigation'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
interface Lecture {
  _id: string
  title: string
  duration: string
}

interface Section {
  _id: string
  title: string
  lectures: Lecture[]
}

const CurriculumPage = ({
  params,
}: {
  params: Promise<{ courseId: string }>
}) => {
  const { courseId } = useParams()
  const token = useSelector((state: RootState) => state.auth.token)
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchSections = async () => {
      if (!token || !courseId) return
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
    fetchSections()
  }, [token, courseId])

  const deleteLecture = async (lectureId: string) => {
    try {
      await axios.delete(`${baseURL}/courses/lectures/${lectureId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSections((prev) =>
        prev.map((s) => ({
          ...s,
          lectures: s.lectures.filter((l) => l._id !== lectureId),
        }))
      )
      toast.success('Lecture deleted')
    } catch {
      toast.error('Failed to delete lecture')
    }
  }

  const deleteSection = async (sectionId: string) => {
    try {
      await axios.delete(`${baseURL}/courses/sections/${sectionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSections((prev) => prev.filter((s) => s._id !== sectionId))
      toast.success('Section deleted')
    } catch {
      toast.error('Failed to delete section')
    }
  }

  return (
    <div className='p-6 max-w-5xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold text-indigo-700'>📚 Curriculum</h2>
        <Link
          href={`/dashboard/instructor/content/curriculum/${courseId}/add-section`}
        >
          <button className='flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700'>
            <Plus className='w-4 h-4' /> Add Section
          </button>
        </Link>
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
                <div className='flex items-center gap-2'>
                  <Link
                    href={`/dashboard/instructor/content/curriculum/${courseId}/${section._id}/add-lecture`}
                  >
                    <button className='text-sm text-indigo-600 hover:underline'>
                      ➕ Add Lecture
                    </button>
                  </Link>
                  <Link
                    href={`/dashboard/instructor/content/curriculum/${courseId}/${section._id}/edit-section`}
                  >
                    <button className='text-sm text-green-600 hover:underline'>
                      ✏️ Edit Section
                    </button>
                  </Link>
                  <button
                    onClick={() => deleteSection(section._id)}
                    className='text-sm text-red-500 hover:underline'
                  >
                    ❌ Delete Section
                  </button>
                </div>
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
                      <div className='flex justify-between items-center'>
                        <span>{lecture.title}</span>
                        <div className='flex gap-2'>
                          <Link
                            href={`/dashboard/instructor/content/curriculum/${courseId}/${section._id}/edit-lecture/${lecture._id}`}
                          >
                            <Pencil className='w-4 h-4 text-blue-500 cursor-pointer' />
                          </Link>
                          <Trash2
                            className='w-4 h-4 text-red-500 cursor-pointer'
                            onClick={() => deleteLecture(lecture._id)}
                          />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CurriculumPage
