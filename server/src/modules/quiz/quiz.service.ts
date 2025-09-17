import mongoose, { Types } from 'mongoose'
import Quiz, { IQuiz, IQuestion } from './quiz.model'

interface QuizInput {
  instructor: string
  course: string
  section?: string
  lecture?: string
  title: string
  instructions?: string
  duration: number
  totalMarks: number
  questions: IQuestion[]
}

export const findQuizzesByCourse = async (
  courseId: string,
  instructorId: string
) => {
  return Quiz.find({
    course: new mongoose.Types.ObjectId(courseId),
    instructor: new mongoose.Types.ObjectId(instructorId),
  }).select('_id title course lecture section')
}

export const getQuizDetails = async (quizId: string) => {
  return Quiz.findById(quizId) // সম্পূর্ণ ডিটেইলস এর জন্য
}

export const findQuiz = async (
  filter: Partial<QuizInput>
): Promise<IQuiz | null> => Quiz.findOne(filter)

export const createQuiz = async (data: QuizInput): Promise<IQuiz> => {
  const quiz = new Quiz(data)
  return quiz.save()
}

// export const updateQuiz = async (
//   id: string,
//   data: Partial<QuizInput>
// ): Promise<IQuiz | null> => Quiz.findByIdAndUpdate(id, data, { new: true })

export const updateQuiz = async (
  id: string,
  data: Partial<QuizInput>
): Promise<IQuiz | null> => {
  return Quiz.findByIdAndUpdate(id, data, { new: true })
}

export const deleteQuiz = async (id: string): Promise<IQuiz | null> => {
  return Quiz.findByIdAndDelete(id)
}
