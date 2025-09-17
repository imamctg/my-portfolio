import { Schema, model, Document, Types } from 'mongoose'

export interface IQuestion {
  questionText: string
  options: string[]
  correctAnswer: number // index of correct option (0-based)
  marks: number
  explanation?: string
  questionType?: 'multiple-choice' | 'true-false' | 'short-answer' // প্রকারভেদ
  difficulty?: 'easy' | 'medium' | 'hard'
}

export interface IQuiz extends Document {
  instructor: Types.ObjectId
  course: Types.ObjectId
  section?: Types.ObjectId
  lecture?: Types.ObjectId
  title: string
  description?: string
  instructions?: string
  duration: number // minutes
  totalMarks: number
  passingScore: number // minimum marks to pass
  questions: IQuestion[]
  isPublished: boolean
  attemptsAllowed: number // -1 for unlimited
  shuffleQuestions: boolean
  showCorrectAnswers: boolean // whether to show after submission
  createdAt: Date
  updatedAt: Date
}

const QuestionSchema = new Schema<IQuestion>({
  questionText: { type: String, required: true },
  options: {
    type: [String],
    validate: {
      validator: function (v: string[]) {
        return v.length >= 2 && v.length <= 5 // 2-5 options allowed
      },
      message: 'Questions must have between 2 and 5 options',
    },
  },
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function (this: IQuestion, v: number) {
        return v < this.options.length // correctAnswer must be valid index
      },
      message: 'Correct answer must be a valid option index',
    },
  },
  marks: { type: Number, required: true, min: 1 },
  explanation: { type: String },
  questionType: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'short-answer'],
    default: 'multiple-choice',
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
})

const QuizSchema = new Schema<IQuiz>(
  {
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    section: {
      type: Schema.Types.ObjectId,
      ref: 'Section',
      index: true, // for faster querying
    },
    lecture: {
      type: Schema.Types.ObjectId,
      ref: 'Lecture',
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    instructions: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1, // minimum 1 minute
    },
    totalMarks: {
      type: Number,
      required: true,
      min: 1,
    },
    passingScore: {
      type: Number,
      default: function (this: IQuiz) {
        return Math.ceil(this.totalMarks * 0.7) // default 70%
      },
      validate: {
        validator: function (this: IQuiz, v: number) {
          return v <= this.totalMarks
        },
        message: 'Passing score cannot exceed total marks',
      },
    },
    questions: {
      type: [QuestionSchema],
      default: [],
      validate: {
        validator: function (v: IQuestion[]) {
          return v.length > 0 // at least one question
        },
        message: 'Quiz must have at least one question',
      },
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    attemptsAllowed: {
      type: Number,
      default: 1, // default single attempt
      min: -1, // -1 means unlimited attempts
    },
    shuffleQuestions: {
      type: Boolean,
      default: false,
    },
    showCorrectAnswers: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Virtual for quiz type (section/lecture quiz)
QuizSchema.virtual('quizType').get(function (this: IQuiz) {
  return this.lecture ? 'lecture' : 'section'
})

// Indexes for better performance
QuizSchema.index({ course: 1, isPublished: 1 })
QuizSchema.index({ instructor: 1, createdAt: -1 })

export default model<IQuiz>('Quiz', QuizSchema)
