import { Schema, model, Document } from 'mongoose'

export interface ITestimonial extends Document {
  name: string
  comment: string
  profileImage?: string
  createdAt: Date
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true, trim: true },
    comment: { type: String, required: true },
    profileImage: { type: String },
  },
  { timestamps: true }
)

export const TestimonialModel = model<ITestimonial>(
  'Testimonial',
  testimonialSchema
)
