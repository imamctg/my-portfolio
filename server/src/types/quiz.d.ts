// import { Document, Types } from 'mongoose'

// export interface IQuestion {
//   questionText: string
//   options: string[]
//   correctAnswerIndex: number
//   explanation?: string
// }

// export interface IQuiz extends Document {
//   title: string
//   questions: IQuestion[]
// }

import { Document, Types } from 'mongoose'

export interface IQuestion {
  questionText: string
  options: string[]
  correctAnswerIndex: number
  explanation?: string
}

export interface IQuiz extends Document {
  title: string
  questions: IQuestion[]
  quizType: 'lecture' | 'section'
  associatedLecture?: Types.ObjectId
  associatedSection?: Types.ObjectId
  course: Types.ObjectId
}

export interface IQuizSubmission extends Document {
  user: Types.ObjectId
  quiz: Types.ObjectId
  course: Types.ObjectId
  score: number
  totalQuestions: number
  answers: number[]
  submittedAt: Date
}
