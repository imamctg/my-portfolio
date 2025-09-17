'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Quiz } from 'types/quiz'
import axios from 'axios'
import { RootState } from 'features/redux/store'
import { useSelector } from 'react-redux'

interface Props {
  quiz: Quiz
  quizType: 'lecture' | 'section' | null
  onClose: () => void
  onSubmit: (score: number, total: number, answers: any[]) => Promise<void>
}

interface QuizSubmission {
  score: number
  total: number
  answers: number[]
  timeSpent: number
  quizType: 'lecture' | 'section' | null
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
const QuizModal: React.FC<Props> = ({ quiz, quizType, onClose, onSubmit }) => {
  const token = useSelector((state: RootState) => state.auth.token)
  const [answers, setAnswers] = useState<number[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Initialize answers array with -1 (unanswered)
  useEffect(() => {
    setAnswers(Array(quiz.questions.length).fill(-1))
  }, [quiz])

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0 || submitted) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, submitted])

  // Handle time up
  useEffect(() => {
    if (timeLeft === 0 && !submitted) {
      handleAutoSubmit()
    }
  }, [timeLeft])

  const handleAnswer = (questionIndex: number, selectedOption: number) => {
    const newAnswers = [...answers]
    newAnswers[questionIndex] = selectedOption
    setAnswers(newAnswers)
  }

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const calculateScore = (): number => {
    return quiz.questions.reduce((score, question, index) => {
      return score + (answers[index] === question.correctAnswer ? 1 : 0)
    }, 0)
  }

  const handleAutoSubmit = async () => {
    await handleQuizSubmit(0, quiz.questions.length) // Auto-submit with 0 score when time runs out
  }

  const handleManualSubmit = async () => {
    const score = calculateScore()
    if (isSubmitting) return
    await handleQuizSubmit(score, quiz.questions.length)
    setIsSubmitting(true)
  }

  const handleQuizSubmit = async (score: number, total: number) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const formattedAnswers = quiz.questions.map((question, index) => ({
        questionIndex: index,
        selectedOption: answers[index],
        isCorrect: answers[index] === question.correctAnswer,
        timeSpent: 30,
      }))

      const timeSpent = 600 - timeLeft

      const submissionData = {
        score,
        total,
        answers: formattedAnswers,
        timeSpent,
        quizType,
        courseId: quiz.course,
      }

      const response = await axios.post(
        `${baseURL}/quizzes/submit/${quiz._id}`,
        submissionData,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        setSubmitted(true) // Show results first
        // Don't call onSubmit here - let user close manually
      } else {
        throw new Error(response.data.message || 'Submission failed')
      }
    } catch (err: any) {
      console.error('Quiz submission error:', err)
      setError(
        err.response?.data?.message ||
          'Failed to submit quiz. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const score = calculateScore()
  const percentage = (score / quiz.questions.length) * 100
  const passed = percentage >= 70 // 70% passing threshold
  const allAnswered = answers.every((a) => a !== -1)

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-bold'>
            {quiz.title} -{' '}
            {quizType === 'lecture' ? 'Lecture Quiz' : 'Section Quiz'}
          </h2>

          <button
            onClick={() => {
              onSubmit(score, quiz.questions.length, answers) // Submit to parent
              onClose() // Then close
            }}
            className='px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700'
          >
            Close
          </button>
        </div>

        {error && (
          <div className='mb-4 p-3 bg-red-100 text-red-700 rounded'>
            {error}
          </div>
        )}

        <div className='flex justify-between items-center mb-6'>
          <div className='text-sm text-gray-600'>
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </div>
          <div
            className={`text-sm font-medium ${
              timeLeft < 60 ? 'text-red-500' : 'text-gray-700'
            }`}
          >
            ⏱️ {Math.floor(timeLeft / 60)}:
            {String(timeLeft % 60).padStart(2, '0')}
          </div>
        </div>

        {!submitted ? (
          <>
            <div className='mb-6'>
              <p className='font-medium text-lg mb-3'>
                {currentQuestion.questionText}
              </p>
              <div className='space-y-2'>
                {currentQuestion.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer ${
                      answers[currentQuestionIndex] === index
                        ? 'bg-blue-50 border-blue-200'
                        : 'border-gray-200'
                    }`}
                  >
                    <input
                      type='radio'
                      name={`q-${currentQuestionIndex}`}
                      checked={answers[currentQuestionIndex] === index}
                      onChange={() => handleAnswer(currentQuestionIndex, index)}
                      className='mr-3 h-5 w-5'
                      disabled={isSubmitting}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className='flex justify-between mt-6'>
              <button
                onClick={goToPrevQuestion}
                disabled={currentQuestionIndex === 0 || isSubmitting}
                className='px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50'
              >
                Previous
              </button>
              {currentQuestionIndex < quiz.questions.length - 1 ? (
                <button
                  onClick={goToNextQuestion}
                  className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50'
                  disabled={isSubmitting}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleManualSubmit}
                  className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50'
                  disabled={isSubmitting || !allAnswered}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                </button>
              )}
            </div>
          </>
        ) : (
          <div className='mt-4'>
            <div
              className={`p-4 rounded-lg mb-6 ${
                passed
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-yellow-50 border border-yellow-200'
              }`}
            >
              <h3 className='text-xl font-bold mb-2'>
                Your Score: {score} / {quiz.questions.length} (
                {percentage.toFixed(0)}%)
              </h3>
              <p className={passed ? 'text-green-700' : 'text-yellow-700'}>
                {passed
                  ? '🎉 Congratulations! You passed!'
                  : 'Keep practicing! You can try again.'}
              </p>
            </div>

            <div className='space-y-4'>
              {quiz.questions.map((question, index) => {
                const userAnswer = answers[index]
                const isCorrect = userAnswer === question.correctAnswer

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      isCorrect
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <p className='font-medium'>{question.questionText}</p>
                    <div className='mt-2 text-sm'>
                      <p
                        className={
                          isCorrect ? 'text-green-600' : 'text-red-600'
                        }
                      >
                        Your answer:{' '}
                        {question.options[userAnswer] || 'Not answered'}
                      </p>
                      {!isCorrect && (
                        <p className='text-green-600 mt-1'>
                          Correct answer:{' '}
                          {question.options[question.correctAnswer]}
                        </p>
                      )}
                      {question.explanation && (
                        <p className='text-gray-600 mt-2'>
                          💡 Explanation: {question.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className='flex justify-end mt-6'></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuizModal
