import { Request, Response } from 'express'
import * as quizService from './quiz.service'
import quizModel, { IQuiz } from './quiz.model'
import QuizSubmissionModel from './QuizSubmission.model'
import mongoose from 'mongoose'
import Course, { ICourse } from '../course/course.model'

// import QuizSubmission from '../models/quizSubmission'

export const getQuiz = async (req: Request, res: Response) => {
  const filter: any = {
    instructor: req.user.id,
    course: req.params.courseId,
  }
  if (req.params.sectionId) filter.section = req.params.sectionId
  if (req.params.lectureId) filter.lecture = req.params.lectureId

  const quiz = await quizService.findQuiz(filter)
  res.json({ quiz })
}

export const getCourseQuizzes = async (req: Request, res: Response) => {
  try {
    console.log(req.params.courseId, 'courseId')
    const quizzes = await quizModel.find({
      course: new mongoose.Types.ObjectId(req.params.courseId),
    })
    // .populate('lecture', 'title')
    // .populate('section', 'title')
    // .select('_id title course lecture section questions')

    res.json({ quizzes })
  } catch (error) {
    console.error('Error fetching quizzes:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// export const getCourseQuizzes = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   try {
//     const { courseId } = req.params

//     const course = await Course.findById( courseId ).lean<ICourse>()

//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' })
//     }

//     const quizzes = await quizModel
//       .find({ course: course._id })
//       .populate('lecture')
//       .populate('section')
//       .lean()

//     return res.status(200).json({ quizzes })
//   } catch (error) {
//     console.error('Error fetching quizzes:', error)
//     return res.status(500).json({ message: 'Server error' })
//   }
// }

export const getQuizDetails = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const quiz = await quizService.getQuizDetails(req.params.quizId)
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' })
    }
    res.json({ quiz })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const createQuiz = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, instructions, duration, totalMarks, questions, course } =
      req.body
    console.log(req.body, 'body')
    if (!course) {
      return res.status(400).json({ message: 'Course ID is required' })
    }

    const data = {
      instructor: req.user.id,
      course,
      section: req.params.sectionId || undefined,
      lecture: req.params.lectureId || undefined,
      title,
      instructions,
      duration,
      totalMarks,
      questions,
    }

    const quiz = await quizService.createQuiz(data)
    res.status(201).json({ quiz })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// export const updateQuiz = async (req: Request, res: Response): Promise<any> => {
//   const filter: any = {
//     instructor: req.user.id,
//     course: req.params.courseId,
//   }
//   if (req.params.sectionId) filter.section = req.params.sectionId
//   if (req.params.lectureId) filter.lecture = req.params.lectureId

//   const existing = (await quizService.findQuiz(filter)) as IQuiz
//   if (!existing) return res.status(404).json({ message: 'Quiz not found' })

//   const quizId = existing._id.toString()
//   const updated = await quizService.updateQuiz(quizId, req.body)

//   res.json({ quiz: updated })
// }

export const updateQuiz = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params
    const updated = await quizService.updateQuiz(quizId, req.body)
    res.json({ quiz: updated })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// export const deleteQuiz = async (req: Request, res: Response): Promise<any> => {
//   const filter: any = {
//     instructor: req.user.id,
//     course: req.params.courseId,
//   }
//   if (req.params.sectionId) filter.section = req.params.sectionId
//   if (req.params.lectureId) filter.lecture = req.params.lectureId

//   const existing = (await quizService.findQuiz(filter)) as IQuiz
//   if (!existing) return res.status(404).json({ message: 'Quiz not found' })

//   const quizId = existing._id.toString()
//   await quizService.deleteQuiz(quizId)
//   res.json({ message: 'Quiz deleted successfully' })
// }

export const deleteQuiz = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params
    await quizService.deleteQuiz(quizId)
    res.json({ message: 'Quiz deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete quiz' })
  }
}

export const getStudentQuiz = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const quiz = await quizModel
      .findById(req.params.quizId)
      .populate('course')
      .populate('associatedLecture')
      .populate('associatedSection')

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' })
    }

    res.status(200).json({ success: true, data: quiz })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// export const submitQuiz = async (req: Request, res: Response) => {
//   try {
//     const { score, total, answers, timeSpent } = req.body
//     console.log(req.body, 'req.body of submitQuiz')
//     const userId = req.user._id

//     // Calculate additional fields
//     const percentage = (score / total) * 100
//     const passingScore = Math.ceil(total * 0.7) // 70% passing threshold
//     const isPassed = percentage >= 70

//     const submission = new QuizSubmissionModel({
//       user: userId,
//       quiz: req.params.quizId,
//       course: req.body.courseId,
//       answers,
//       score,
//       totalQuestions: total,
//       passingScore,
//       percentage,
//       isPassed,
//       timeSpent,
//       attemptNumber: 1, // You can implement attempt counting
//       details: {
//         correctCount: answers.filter((a: any) => a.isCorrect).length,
//         incorrectCount: answers.filter((a: any) => !a.isCorrect).length,
//         skippedCount: answers.filter((a: any) => a.selectedOption === -1)
//           .length,
//         questionsByDifficulty: {
//           easy: { correct: 0, total: 0 },
//           medium: { correct: 0, total: 0 },
//           hard: { correct: 0, total: 0 },
//         },
//       },
//       timeStarted: new Date(Date.now() - timeSpent * 1000),
//       timeFinished: new Date(),
//     })

//     await submission.save()

//     res.status(201).json({
//       success: true,
//       data: submission,
//       message: 'Quiz submitted successfully',
//     })
//   } catch (error: any) {
//     console.error('Quiz submission error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message,
//     })
//   }
// }

export const submitQuiz = async (req: Request, res: Response): Promise<any> => {
  try {
    const { score, total, answers, timeSpent = 0 } = req.body
    const userId = req.user._id

    const existing = await QuizSubmissionModel.findOne({
      user: userId,
      quiz: req.params.quizId,
      createdAt: { $gt: new Date(Date.now() - 5000) }, // 5 second window
    })

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate submission detected',
      })
    }

    // Validate required fields
    // if (!timeSpent) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'timeSpent is required',
    //   })
    // }

    // More comprehensive validation
    if (typeof score !== 'number' || typeof total !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Invalid score or total',
      })
    }

    const submission = new QuizSubmissionModel({
      user: userId,
      quiz: req.params.quizId,
      course: req.body.courseId,
      answers,
      score,
      totalQuestions: total,
      timeStarted: new Date(Date.now() - timeSpent * 1000), // Calculate start time
      timeFinished: new Date(),
      timeSpent,
      // Add other required fields
      passingScore: Math.ceil(total * 0.7),
      percentage: (score / total) * 100,
      isPassed: score / total >= 0.7,
      attemptNumber: 1,
      details: {
        correctCount: answers.filter((a: any) => a.isCorrect).length,
        incorrectCount: answers.filter((a: any) => a.isCorrect === false)
          .length,
        skippedCount: answers.filter((a: any) => a.selectedOption === -1)
          .length,
        questionsByDifficulty: {
          easy: { correct: 0, total: 0 },
          medium: { correct: 0, total: 0 },
          hard: { correct: 0, total: 0 },
        },
      },
    })

    await submission.save()

    res.status(201).json({
      success: true,
      data: submission,
      message: 'Quiz submitted successfully',
    })
  } catch (error: any) {
    console.error('Quiz submission error:', error)

    // Don't crash the server on validation errors
    res.status(500).json({
      success: false,
      message: error._message || 'Quiz submission failed',
      errors: error.errors || null,
    })
  }
}

export const getQuizResults = async (req: Request, res: Response) => {
  try {
    const results = await QuizSubmissionModel.find({
      user: req.user._id,
      course: req.params.courseId,
    }).populate('quiz')

    res.status(200).json({ success: true, data: results })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}
