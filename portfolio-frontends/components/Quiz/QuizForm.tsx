'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import QuestionEditor, { QuestionType } from './QuestionEditor'

type QuizFormProps = {
  initialData?: {
    _id?: string
    title: string
    instructions?: string
    duration: number
    totalMarks: number
    questions: QuestionType[]
  }
  parentId: string
  parentType: 'section' | 'lecture'
  token: string
  courseId: string
  onSuccess?: () => void
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

const QuizForm: React.FC<QuizFormProps> = ({
  initialData,
  parentId,
  parentType,
  token,
  courseId,
  onSuccess,
}) => {
  const [title, setTitle] = useState(initialData?.title || '')
  const [instructions, setInstructions] = useState(
    initialData?.instructions || ''
  )
  const [duration, setDuration] = useState(initialData?.duration || 15)
  const [totalMarks, setTotalMarks] = useState(initialData?.totalMarks || 10)
  const [questions, setQuestions] = useState<QuestionType[]>(
    initialData?.questions || []
  )
  const [isEditing, setIsEditing] = useState(!!initialData?._id)
  const [loading, setLoading] = useState(false)

  const apiBase =
    parentType === 'section'
      ? `${baseURL}/quizzes/sections/${parentId}`
      : `${baseURL}/quizzes/lectures/${parentId}`

  useEffect(() => {
    if (!initialData) {
      const fetchQuiz = async () => {
        try {
          const res = await axios.get(apiBase, {
            headers: { Authorization: `Bearer ${token}` },
          })
          const quiz = res.data.quiz
          if (quiz) {
            setIsEditing(true)
            setTitle(quiz.title)
            setInstructions(quiz.instructions)
            setDuration(quiz.duration)
            setTotalMarks(quiz.totalMarks)
            setQuestions(quiz.questions)
          }
        } catch (err) {
          console.log('No existing quiz found.')
        }
      }
      fetchQuiz()
    }
  }, [initialData, apiBase, token])

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        marks: 1,
        explanation: '',
      },
    ])
  }

  const handleDeleteQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index))
  }

  const validateForm = (): boolean => {
    if (!title.trim()) {
      toast.error('Quiz title is required.')
      return false
    }
    if (questions.length === 0) {
      toast.error('At least one question is required.')
      return false
    }
    for (const [i, q] of questions.entries()) {
      if (!q.questionText.trim()) {
        toast.error(`Question ${i + 1} text is required.`)
        return false
      }
      if (q.options.some((o) => !o.trim())) {
        toast.error(`All options for question ${i + 1} must be filled.`)
        return false
      }
      if (q.marks <= 0) {
        toast.error(`Marks must be positive for question ${i + 1}.`)
        return false
      }
    }
    return true
  }

  const handleSubmit = async () => {
    if (!courseId || courseId === 'undefined') {
      toast.error('❌ Course ID could not be resolved.')
      return
    }

    if (!validateForm()) return
    setLoading(true)
    try {
      const method = isEditing ? 'put' : 'post'
      const url = isEditing ? `${baseURL}/quizzes/${initialData?._id}` : apiBase

      const res = await axios[method](
        url,
        {
          title,
          instructions,
          duration,
          totalMarks,
          questions,
          course: courseId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      toast.success(`Quiz ${isEditing ? 'updated' : 'created'} successfully!`)
      onSuccess?.()
    } catch (err) {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} quiz.`)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this quiz?')) return
    setLoading(true)
    try {
      const url = isEditing ? `${baseURL}/quizzes/${initialData?._id}` : apiBase

      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Quiz deleted successfully!')
      onSuccess?.()
    } catch (err) {
      toast.error('Failed to delete quiz.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-6 p-4 bg-white rounded-lg shadow-sm'>
      <div className='flex justify-between items-center border-b pb-4'>
        <h2 className='text-xl font-semibold text-gray-800'>
          {isEditing ? 'Edit Quiz' : 'Create New Quiz'}
        </h2>
        <button
          onClick={handleAddQuestion}
          className='px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm flex items-center gap-1'
        >
          + Add Question
        </button>
      </div>

      <div className='space-y-4'>
        <div className='grid grid-cols-1 gap-4'>
          <input
            type='text'
            placeholder='Quiz Title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='border px-4 py-2 rounded w-full'
          />
          <textarea
            placeholder='Instructions (optional)'
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className='border px-4 py-2 rounded w-full'
            rows={3}
          />
          <div className='grid grid-cols-2 gap-4'>
            <input
              type='number'
              min={1}
              placeholder='Duration (minutes)'
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className='border px-4 py-2 rounded w-full'
            />
            <input
              type='number'
              min={1}
              placeholder='Total Marks'
              value={totalMarks}
              onChange={(e) => setTotalMarks(Number(e.target.value))}
              className='border px-4 py-2 rounded w-full'
            />
          </div>
        </div>

        <div className='space-y-6'>
          {questions.map((q, index) => (
            <QuestionEditor
              key={index}
              question={q}
              onChange={(updated) =>
                setQuestions((prev) =>
                  prev.map((item, i) => (i === index ? updated : item))
                )
              }
              onDelete={() => handleDeleteQuestion(index)}
            />
          ))}
        </div>
      </div>

      <div className='pt-6 flex justify-end space-x-3'>
        {isEditing && (
          <button
            onClick={handleDelete}
            disabled={loading}
            className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50'
          >
            {loading ? 'Deleting...' : 'Delete Quiz'}
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50'
        >
          {loading
            ? isEditing
              ? 'Updating...'
              : 'Creating...'
            : isEditing
            ? 'Update Quiz'
            : 'Create Quiz'}
        </button>
      </div>
    </div>
  )
}

export default QuizForm
