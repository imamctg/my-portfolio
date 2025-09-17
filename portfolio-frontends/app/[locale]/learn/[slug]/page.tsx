'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useSearchParams } from 'next/navigation'
import FullPageLoader from 'components/common/FullPageLoader'
import ErrorPage from 'components/common/ErrorPage'
import CourseSidebar from 'components/CoursePlayer/CourseSidebar'
import CustomVideoPlayer from 'components/CoursePlayer/CustomVideoPlayer'
import QuizModal from 'components/CoursePlayer/QuizModal'
import type { Quiz, Lecture, Section } from 'types/quiz'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'

interface Course {
  _id: string
  title: string
  description: string
  thumbnail: string
  sections: Section[]
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
export default function CourseDetailsPage() {
  const token = useSelector((state: RootState) => state.auth.token)
  const { slug } = useParams()
  const searchParams = useSearchParams()
  const quizId = searchParams.get('quizId')
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [quizType, setQuizType] = useState<'lecture' | 'section' | null>(null)
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null)
  const [course, setCourse] = useState<Course | null>(null)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [initialLoad, setInitialLoad] = useState(true)

  // Fetch course and quizzes data

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        if (!token || !slug) return

        const [courseRes, quizzesRes] = await Promise.all([
          axios.get(`${baseURL}/courses/${slug}/details`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseURL}/quizzes/course/${slug}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])
        console.log(courseRes.data.data, 'courseRes.data.data')
        const courseData = courseRes.data.data
        const quizzesData = quizzesRes.data.quizzes || []

        setCourse(courseData)
        setQuizzes(quizzesData)

        // ✅ Restore last selected lecture from localStorage
        const storedLectureId = localStorage.getItem(
          `selectedLecture_${course?._id}`
        )
        let selected: Lecture | null = null

        if (storedLectureId) {
          for (const section of courseData.sections) {
            const found = section.lectures.find(
              (lec: Lecture) => lec._id === storedLectureId
            )
            if (found) {
              selected = found
              break
            }
          }
        }

        // ✅ If not found, fallback to first uncompleted lecture
        if (!selected) {
          outer: for (const section of courseData.sections) {
            for (const lec of section.lectures) {
              if (!lec.completed) {
                selected = lec
                break outer
              }
            }
          }
        }

        // ✅ Still fallback to very first lecture if needed
        // Replace:
        if (!selected && courseData.sections?.[0]?.lectures?.[0]) {
          selected = courseData.sections[0].lectures[0]
        }

        // And finally:
        if (selected) {
          setSelectedLecture(selected)
        }
      } catch (err: any) {
        console.error('Error details:', err.response?.data || err.message)
        setError('Failed to load course data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug, token])

  // Fetch course and quizzes data

  useEffect(() => {
    if (selectedLecture && course?._id) {
      localStorage.setItem(
        `selectedLecture_${course?._id}`,
        selectedLecture._id
      )
    }
  }, [selectedLecture, course?._id])
  console.log(selectedLecture, 'selectedLecture', course?._id, 'courseId')
  // Loading and error states
  if (loading && (!course || !selectedLecture)) {
    return <FullPageLoader />
  }

  if (error) {
    return <ErrorPage message={error} />
  }

  if (!course || !selectedLecture) {
    return <ErrorPage message='Course data could not be loaded' />
  }

  // Find quiz for current lecture or section
  const findQuiz = (
    lectureId?: string,
    sectionId?: string
  ): Quiz | undefined => {
    if (lectureId) {
      return quizzes.find((q) => q.lecture === lectureId)
    }
    if (sectionId) {
      return quizzes.find((q) => q.section === sectionId)
    }
    return undefined
  }

  const handleQuizOpen = (lectureId?: string, sectionId?: string) => {
    const quiz = findQuiz(lectureId, sectionId)
    if (!quiz) return

    if (lectureId) {
      setQuizType('lecture')
    } else if (sectionId) {
      setQuizType('section')
    }

    setCurrentQuiz(quiz)
    setShowQuiz(true)
  }

  const handleQuizSubmit = async (
    score: number,
    total: number,
    answers: any[]
  ) => {
    try {
      setShowQuiz(false)
    } catch (err) {
      console.error('Quiz submission error:', err)
      // You might want to show an error message to the user here
    }
  }

  const markLectureCompleted = async (lectureId: string) => {
    if (!token) {
      throw new Error('No authentication token found')
    }
    try {
      const response = await axios.put(
        `${baseURL}/courses/lectures/${lectureId}/complete`,
        { courseId: course?._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.data.success) {
        // Optimistically update the UI
        setCourse((prev) => {
          if (!prev) return null
          return {
            ...prev,
            sections: prev.sections.map((section) => ({
              ...section,
              lectures: section.lectures.map((lecture) =>
                lecture._id === lectureId
                  ? { ...lecture, completed: true }
                  : lecture
              ),
            })),
          }
        })

        // Also update local storage to maintain state
        localStorage.setItem(
          `completed_lectures_${course?._id}`,
          JSON.stringify({
            ...JSON.parse(
              localStorage.getItem(`completed_lectures_${course?._id}`) || '{}'
            ),
            [lectureId]: true,
          })
        )
      }
    } catch (err) {
      console.error('Failed to mark lecture complete:', err)
      // Show error to user
    }
  }

  // Only check for selectedLecture after course is loaded
  if (!selectedLecture && course?.sections?.[0]?.lectures?.[0]) {
    setSelectedLecture(course.sections[0].lectures[0])
    return <FullPageLoader />
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 lg:p-6'>
      <div className='lg:col-span-2 order-1 lg:order-none'>
        {showQuiz && currentQuiz ? (
          <QuizModal
            quiz={currentQuiz}
            quizType={quizType}
            onClose={() => setShowQuiz(false)}
            onSubmit={handleQuizSubmit}
          />
        ) : (
          <CustomVideoPlayer
            src={selectedLecture.videoUrl}
            onComplete={() => markLectureCompleted(selectedLecture._id)}
          />
        )}
      </div>

      <div className='order-2 lg:order-none'>
        <CourseSidebar
          sections={course.sections}
          selectedLectureId={selectedLecture._id}
          onSelect={setSelectedLecture}
          onQuizOpen={handleQuizOpen}
          quizzes={quizzes}
        />
      </div>
    </div>
  )
}
