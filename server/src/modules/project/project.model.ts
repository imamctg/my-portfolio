import { Schema, model, Document } from 'mongoose'

export interface IProject extends Document {
  title: string
  description: string
  category: string
  technology: string
  thumbnail?: string
  link: string
  featured?: boolean
  slug: string
  createdAt: Date
  updatedAt: Date
}

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    technology: { type: String, required: true },
    thumbnail: { type: String },
    link: { type: String, required: true },
    featured: { type: Boolean, default: false },
    slug: { type: String, required: true, unique: true }, // 🔥 slug field added
  },
  { timestamps: true }
)

export const ProjectModel = model<IProject>('Project', projectSchema)
