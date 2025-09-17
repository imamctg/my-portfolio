'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'
import { useParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Quiz } from 'types/quiz'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
const QuizzesPage = () => {
  const { slug } = useParams() as { slug: string }
  const token = useSelector((state: RootState) => state.auth.token)
  const [sections, setSections] = useState<any[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(false)
  const [courseId, setCourseId] = useState<string>('')

  useEffect(() => {
    const fetchCourseId = async () => {
      if (!slug || !token) return
      try {
        const res = await axios.get(`${baseURL}/courses/${slug}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setCourseId(res.data.data._id)
      } catch (err) {
        toast.error('Failed to resolve course')
      }
    }
    fetchCourseId()
  }, [slug, token])

  console.log(courseId, 'courseId')
  useEffect(() => {
    const fetchData = async () => {
      if (!token || !courseId) return
      setLoading(true)
      try {
        const [sectionsRes, quizzesRes] = await Promise.all([
          axios.get(`${baseURL}/courses/${courseId}/sections`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseURL}/quizzes/course/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        setSections(sectionsRes.data.sections || [])
        setQuizzes(quizzesRes.data.quizzes || [])
      } catch (err) {
        toast.error('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token, courseId])

  useEffect(() => {
    console.log('Current quizzes state:', quizzes)
    console.log('Current sections state:', sections)
  }, [quizzes, sections])

  const deleteQuiz = async (quizId: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return
    try {
      await axios.delete(`${baseURL}/quizzes/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Quiz deleted successfully')
      setQuizzes(quizzes.filter((q) => q._id !== quizId))
    } catch (err) {
      toast.error('Failed to delete quiz')
    }
  }

  return (
    <div className='p-6 max-w-5xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold text-indigo-700'>📚 Quizzes</h2>
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
                <ul className='pl-4 list-disc space-y-3'>
                  {section.lectures.map((lecture) => {
                    const lectureQuizzes = quizzes.filter(
                      (q) => q.lecture === lecture._id
                    )
                    return (
                      <li key={lecture._id} className='text-sm text-gray-700'>
                        <div className='flex justify-between items-center'>
                          <span>{lecture.title}</span>
                          <Link
                            href={`/dashboard/instructor/content/quizzes/${slug}/${section._id}/${lecture._id}/add-lecture-quiz`}
                          >
                            <button className='text-xs px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700'>
                              🎯 Add Quiz
                            </button>
                          </Link>
                        </div>

                        {lectureQuizzes.length > 0 && (
                          <ul className='ml-4 mt-1 space-y-2'>
                            {lectureQuizzes.map((quiz) => (
                              <li
                                key={quiz._id}
                                className='flex items-center gap-2'
                              >
                                <span>{quiz.title}</span>
                                <Link
                                  href={`/dashboard/instructor/content/quizzes/${slug}/${section._id}/${lecture._id}/edit-lecture-quiz?quizId=${quiz._id}`}
                                  className='text-blue-500 hover:underline text-xs'
                                >
                                  Edit.....
                                </Link>
                                <button
                                  onClick={() => deleteQuiz(quiz._id)}
                                  className='text-red-500 hover:underline text-xs'
                                >
                                  Delete
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}

              {/* Section Quiz */}
              <div className='pl-4 mt-4'>
                {quizzes
                  .filter((q) => q.section === section._id)
                  .map((quiz) => (
                    <div
                      key={quiz._id}
                      className='flex items-center gap-2 text-sm'
                    >
                      <span>🎯 Section Quiz: {quiz.title}</span>
                      <Link
                        href={`/dashboard/instructor/content/quizzes/${slug}/${section._id}/edit-section-quiz?quizId=${quiz._id}`}
                        className='text-blue-500 hover:underline text-xs'
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteQuiz(quiz._id)}
                        className='text-red-500 hover:underline text-xs'
                      >
                        Delete
                      </button>
                    </div>
                  ))}

                {quizzes.filter((q) => q.section === section._id).length ===
                  0 && (
                  <Link
                    href={`/dashboard/instructor/content/quizzes/${slug}/${section._id}/add-section-quiz`}
                  >
                    <button className='text-indigo-600 hover:underline text-sm'>
                      ➕ Add Section Quiz
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

export default QuizzesPage
