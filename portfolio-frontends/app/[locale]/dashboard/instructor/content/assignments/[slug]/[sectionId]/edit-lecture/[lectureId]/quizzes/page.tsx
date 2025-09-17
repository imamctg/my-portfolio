// 'use client'

// import { useState, useEffect } from 'react'
// import { useParams } from 'next/navigation'
// import { FaPlus, FaTrash } from 'react-icons/fa'
// import toast from 'react-hot-toast'
// import axios from 'axios'

// interface Quiz {
//   id: string
//   question: string
//   options: string[]
//   correctAnswer: string
// }

// export default function LectureQuizzesPage() {
//   const { courseId, sectionId, lectureId } = useParams()
//   const [quizzes, setQuizzes] = useState<Quiz[]>([])
//   const [question, setQuestion] = useState('')
//   const [options, setOptions] = useState(['', '', '', ''])
//   const [correctAnswer, setCorrectAnswer] = useState('')
//   const [loading, setLoading] = useState(false)

//   // Load existing quizzes
//   useEffect(() => {
//     const fetchQuizzes = async () => {
//       try {
//         const { data } = await axios.get(
//           `http://localhost:5000/api/lectures/${lectureId}/quizzes`
//         )
//         setQuizzes(data)
//       } catch (error) {
//         toast.error('Failed to load quizzes')
//       }
//     }
//     fetchQuizzes()
//   }, [lectureId])

//   const handleAddQuiz = async () => {
//     if (!question || options.includes('') || !correctAnswer) {
//       toast.error('Please complete all fields')
//       return
//     }

//     const newQuiz = {
//       lectureId,
//       question,
//       options,
//       correctAnswer,
//     }

//     setLoading(true)
//     try {
//       const { data } = await axios.post(
//         `http://localhost:5000/api/lectures/${lectureId}/quizzes`,
//         newQuiz
//       )
//       setQuizzes([...quizzes, data])
//       toast.success('Quiz added')
//       setQuestion('')
//       setOptions(['', '', '', ''])
//       setCorrectAnswer('')
//     } catch (err) {
//       toast.error('Failed to add quiz')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const removeQuiz = async (id: string) => {
//     try {
//       await axios.delete(
//         `http://localhost:5000/api/lectures/${lectureId}/quizzes/${id}`
//       )
//       setQuizzes(quizzes.filter((q) => q.id !== id))
//       toast.success('Quiz removed')
//     } catch {
//       toast.error('Failed to delete quiz')
//     }
//   }

//   return (
//     <div className='p-6 space-y-6'>
//       <h2 className='text-2xl font-bold text-gray-800'>🎯 Manage Quizzes</h2>

//       {/* Add Quiz Form */}
//       <div className='bg-white p-4 rounded shadow space-y-4'>
//         <input
//           type='text'
//           placeholder='Question'
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           className='w-full border p-2 rounded'
//         />

//         <div className='grid grid-cols-2 gap-2'>
//           {options.map((opt, idx) => (
//             <input
//               key={idx}
//               type='text'
//               placeholder={`Option ${idx + 1}`}
//               value={opt}
//               onChange={(e) => {
//                 const updated = [...options]
//                 updated[idx] = e.target.value
//                 setOptions(updated)
//               }}
//               className='border p-2 rounded'
//             />
//           ))}
//         </div>

//         <select
//           className='border p-2 rounded w-full'
//           value={correctAnswer}
//           onChange={(e) => setCorrectAnswer(e.target.value)}
//         >
//           <option value=''>Select Correct Answer</option>
//           {options.map((opt, idx) => (
//             <option key={idx} value={opt}>
//               {opt || `Option ${idx + 1}`}
//             </option>
//           ))}
//         </select>

//         <button
//           onClick={handleAddQuiz}
//           disabled={loading}
//           className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 disabled:opacity-60'
//         >
//           <FaPlus /> {loading ? 'Adding...' : 'Add Quiz'}
//         </button>
//       </div>

//       {/* Quiz List */}
//       <div className='bg-white p-4 rounded shadow'>
//         <h3 className='font-semibold mb-3'>Quizzes for this Lecture</h3>
//         {quizzes.length ? (
//           <ul className='space-y-3'>
//             {quizzes.map((q) => (
//               <li key={q.id} className='border p-3 rounded'>
//                 <div className='flex justify-between items-start'>
//                   <div>
//                     <p className='font-semibold'>{q.question}</p>
//                     <ul className='list-disc ml-5 text-sm'>
//                       {q.options.map((opt, idx) => (
//                         <li
//                           key={idx}
//                           className={
//                             opt === q.correctAnswer
//                               ? 'text-green-600 font-semibold'
//                               : ''
//                           }
//                         >
//                           {opt}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                   <FaTrash
//                     onClick={() => removeQuiz(q.id)}
//                     className='text-red-500 cursor-pointer mt-1'
//                   />
//                 </div>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className='text-gray-500'>No quizzes added for this lecture.</p>
//         )}
//       </div>
//     </div>
//   )
// }

// 'use client'

// import { useEffect, useState } from 'react'
// import { useParams } from 'next/navigation'
// import axios from 'axios'
// import toast from 'react-hot-toast'
// import { FaPlus, FaTrash } from 'react-icons/fa'
// import { useSelector } from 'react-redux'
// import { RootState } from 'features/redux/store'
// // import { RootState } from '@/store'

// interface Quiz {
//   _id: string
//   question: string
//   options: string[]
//   correctAnswer: string
// }

// export default function LectureQuizzesPage() {
//   const { lectureId } = useParams() as { lectureId: string }
//   const [quizzes, setQuizzes] = useState<Quiz[]>([])
//   const [question, setQuestion] = useState('')
//   const [options, setOptions] = useState(['', '', '', ''])
//   const [correctAnswer, setCorrectAnswer] = useState('')
//   const [loading, setLoading] = useState(false)

//   const token = useSelector((state: RootState) => state.auth.token)

//   const fetchQuizzes = async () => {
//     try {
//       const { data } = await axios.get(
//         `localhost:5000/api/quizzes/${lectureId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       )
//       setQuizzes(data)
//     } catch {
//       toast.error('Failed to load quizzes')
//     }
//   }

//   useEffect(() => {
//     if (lectureId) fetchQuizzes()
//   }, [lectureId])

//   const handleAddQuiz = async () => {
//     if (!question || options.includes('') || !correctAnswer) {
//       toast.error('Please fill all fields')
//       return
//     }

//     const newQuiz = {
//       lectureId,
//       question,
//       options,
//       correctAnswer,
//     }

//     setLoading(true)
//     try {
//       const { data } = await axios.post('localhost:5000/api/quizzes', newQuiz, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       setQuizzes([...quizzes, data])
//       toast.success('Quiz added')
//       setQuestion('')
//       setOptions(['', '', '', ''])
//       setCorrectAnswer('')
//     } catch {
//       toast.error('Failed to add quiz')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const removeQuiz = async (quizId: string) => {
//     try {
//       await axios.delete(`localhost:5000/api/quizzes/${quizId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       setQuizzes(quizzes.filter((q) => q._id !== quizId))
//       toast.success('Quiz deleted')
//     } catch {
//       toast.error('Failed to delete quiz')
//     }
//   }

//   return (
//     <div className='p-6 space-y-6'>
//       <h2 className='text-2xl font-bold text-gray-800'>🎯 Manage Quizzes</h2>

//       {/* Add Quiz Form */}
//       <div className='bg-white p-4 rounded shadow space-y-4'>
//         <input
//           type='text'
//           placeholder='Question'
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           className='w-full border p-2 rounded'
//         />

//         <div className='grid grid-cols-2 gap-2'>
//           {options.map((opt, idx) => (
//             <input
//               key={idx}
//               type='text'
//               placeholder={`Option ${idx + 1}`}
//               value={opt}
//               onChange={(e) => {
//                 const updated = [...options]
//                 updated[idx] = e.target.value
//                 setOptions(updated)
//               }}
//               className='border p-2 rounded'
//             />
//           ))}
//         </div>

//         <select
//           className='border p-2 rounded w-full'
//           value={correctAnswer}
//           onChange={(e) => setCorrectAnswer(e.target.value)}
//         >
//           <option value=''>Select Correct Answer</option>
//           {options.map((opt, idx) => (
//             <option key={idx} value={opt}>
//               {opt || `Option ${idx + 1}`}
//             </option>
//           ))}
//         </select>

//         <button
//           onClick={handleAddQuiz}
//           disabled={loading}
//           className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 disabled:opacity-60'
//         >
//           <FaPlus /> {loading ? 'Adding...' : 'Add Quiz'}
//         </button>
//       </div>

//       {/* Quiz List */}
//       <div className='bg-white p-4 rounded shadow'>
//         <h3 className='font-semibold mb-3'>Quizzes for this Lecture</h3>
//         {quizzes.length > 0 ? (
//           <ul className='space-y-3'>
//             {quizzes.map((q) => (
//               <li key={q._id} className='border p-3 rounded'>
//                 <div className='flex justify-between items-start'>
//                   <div>
//                     <p className='font-semibold'>{q.question}</p>
//                     <ul className='list-disc ml-5 text-sm'>
//                       {q.options.map((opt, idx) => (
//                         <li
//                           key={idx}
//                           className={
//                             opt === q.correctAnswer
//                               ? 'text-green-600 font-semibold'
//                               : ''
//                           }
//                         >
//                           {opt}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                   <FaTrash
//                     onClick={() => removeQuiz(q._id)}
//                     className='text-red-500 cursor-pointer mt-1'
//                   />
//                 </div>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className='text-gray-500'>No quizzes added for this lecture.</p>
//         )}
//       </div>
//     </div>
//   )
// }

'use client'

import { useParams, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'
import QuizForm from 'components/Quiz/QuizForm'

export default function LectureQuizzesPage() {
  const { courseId, sectionId, lectureId } = useParams() as {
    courseId: string
    sectionId: string
    lectureId: string
  }

  const token = useSelector((state: RootState) => state.auth.token)
  const router = useRouter()

  return (
    <div className='max-w-3xl mx-auto px-6 py-8'>
      <h2 className='text-2xl font-bold text-indigo-700 mb-6'>
        📗 Edit Lecture Quiz
      </h2>

      <QuizForm
        courseId={courseId}
        parentId={lectureId}
        parentType='lecture'
        token={token}
        onSuccess={() =>
          router.push(
            `/dashboard/instructor/content/curriculum/${courseId}/${sectionId}/edit-lecture/${lectureId}`
          )
        }
      />
    </div>
  )
}
