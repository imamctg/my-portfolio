import { Schema, model, Document, Types } from 'mongoose'
import { IQuiz } from './quiz.model'

interface IQuizAnswer {
  questionIndex: number
  selectedOption: number
  isCorrect: boolean
  timeSpent: number
}

export interface IQuizSubmission extends Document {
  user: Types.ObjectId
  quiz: Types.ObjectId
  course: Types.ObjectId
  lecture?: Types.ObjectId
  section?: Types.ObjectId
  answers: IQuizAnswer[]
  score: number
  totalQuestions: number
  passingScore: number
  percentage: number
  isPassed: boolean
  timeStarted: Date
  timeFinished?: Date
  timeSpent: number // in seconds
  attemptNumber: number
  details: {
    correctCount: number
    incorrectCount: number
    skippedCount: number
    questionsByDifficulty: {
      easy: { correct: number; total: number }
      medium: { correct: number; total: number }
      hard: { correct: number; total: number }
    }
  }
  metadata: {
    device?: string
    browser?: string
    ipAddress?: string
  }
  createdAt: Date
  updatedAt: Date
}

const QuizAnswerSchema = new Schema<IQuizAnswer>({
  questionIndex: { type: Number, required: true },
  selectedOption: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true },
  timeSpent: { type: Number, required: true },
})

const QuizSubmissionSchema = new Schema<IQuizSubmission>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    quiz: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
      index: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    lecture: {
      type: Schema.Types.ObjectId,
      ref: 'Lecture',
      index: true,
    },
    section: {
      type: Schema.Types.ObjectId,
      ref: 'Section',
      index: true,
    },
    answers: {
      type: [QuizAnswerSchema],
      required: true,
      validate: {
        validator: function (v: IQuizAnswer[]) {
          return v.length > 0
        },
        message: 'At least one answer is required',
      },
    },
    score: {
      type: Number,
      required: true,
      min: 0,
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },
    passingScore: {
      type: Number,
      required: true,
      min: 0,
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    isPassed: {
      type: Boolean,
      required: true,
    },
    timeStarted: {
      type: Date,
      required: true,
      default: Date.now,
    },
    timeFinished: {
      type: Date,
    },
    timeSpent: {
      type: Number,
      required: true,
      min: 0, // in seconds
    },
    attemptNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    details: {
      correctCount: { type: Number, required: true, min: 0 },
      incorrectCount: { type: Number, required: true, min: 0 },
      skippedCount: { type: Number, required: true, min: 0 },
      questionsByDifficulty: {
        easy: {
          correct: { type: Number, required: true, min: 0 },
          total: { type: Number, required: true, min: 0 },
        },
        medium: {
          correct: { type: Number, required: true, min: 0 },
          total: { type: Number, required: true, min: 0 },
        },
        hard: {
          correct: { type: Number, required: true, min: 0 },
          total: { type: Number, required: true, min: 0 },
        },
      },
    },
    metadata: {
      device: { type: String },
      browser: { type: String },
      ipAddress: { type: String },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Virtual for quiz duration percentage (if time limit was enforced)
QuizSubmissionSchema.virtual('timePercentage').get(function (
  this: IQuizSubmission
) {
  if (!this.populated('quiz')) return null
  const quiz = this.quiz as unknown as IQuiz // Type assertion
  return (this.timeSpent / (quiz.duration * 60)) * 100
})

// Indexes for better query performance
QuizSubmissionSchema.index({ user: 1, quiz: 1 })
QuizSubmissionSchema.index({ course: 1, user: 1 })
QuizSubmissionSchema.index({ quiz: 1, score: -1 })
QuizSubmissionSchema.index({ user: 1, isPassed: 1 })
QuizSubmissionSchema.index({ createdAt: -1 })

// Pre-save hook to calculate derived fields
QuizSubmissionSchema.pre<IQuizSubmission>('save', function (next) {
  if (this.isModified('answers')) {
    // Calculate score, percentage, etc.
    this.totalQuestions = this.answers.length
    this.score = this.answers.reduce(
      (sum, answer) => sum + (answer.isCorrect ? 1 : 0),
      0
    )
    this.percentage = (this.score / this.totalQuestions) * 100
    this.isPassed =
      this.percentage >= (this.passingScore / this.totalQuestions) * 100

    // Calculate detailed statistics
    this.details = {
      correctCount: this.answers.filter((a) => a.isCorrect).length,
      incorrectCount: this.answers.filter(
        (a) => !a.isCorrect && a.selectedOption !== -1
      ).length,
      skippedCount: this.answers.filter((a) => a.selectedOption === -1).length,
      questionsByDifficulty: {
        easy: { correct: 0, total: 0 },
        medium: { correct: 0, total: 0 },
        hard: { correct: 0, total: 0 },
      },
    }

    // Note: You'll need to populate quiz questions with difficulty to calculate this
    // This is just a placeholder structure
  }

  if (this.isNew && !this.timeFinished) {
    this.timeFinished = new Date()
  }

  if (this.timeStarted && this.timeFinished) {
    this.timeSpent = Math.floor(
      (this.timeFinished.getTime() - this.timeStarted.getTime()) / 1000
    )
  }

  next()
})

export default model<IQuizSubmission>('QuizSubmission', QuizSubmissionSchema)
