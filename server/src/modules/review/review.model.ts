import mongoose, { Types, Document } from 'mongoose'

// Populated version of review (used in controller after populate)
export interface PopulatedReview {
  _id: Types.ObjectId
  student: {
    name: string
    profileImage?: string // ✅ Add this line
  }
  course: { title: string }
  rating: number
  comment: string
  createdAt: Date
}

// Base Review document (used in model type if needed)
export interface IReview extends Document {
  student: Types.ObjectId
  instructor: Types.ObjectId
  course: Types.ObjectId
  rating: number
  comment: string
  createdAt: Date
  updatedAt: Date
}

const reviewSchema = new mongoose.Schema<IReview>(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export const ReviewModel = mongoose.model<IReview>('Review', reviewSchema)
