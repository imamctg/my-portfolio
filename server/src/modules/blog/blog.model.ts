import { Schema, model, Document, Types } from 'mongoose'

/**
 * Blog Category Interface
 */
export interface IBlogCategory extends Document {
  name: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Blog Interface
 */
export interface IBlog extends Document {
  title: string
  slug: string
  content: string
  thumbnail?: string // Cloudinary URL
  category: Types.ObjectId
  author?: string
  tags?: string[]
  draft?: boolean
  seoTitle?: string
  seoDescription?: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Blog Category Schema
 */
const blogCategorySchema = new Schema<IBlogCategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true }
)

/**
 * Blog Schema
 */
const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    content: { type: String, required: true },
    thumbnail: { type: String },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'BlogCategory',
      required: true,
    },
    author: { type: String, default: 'Admin' },
    tags: { type: [String], default: [] },
    draft: { type: Boolean, default: true },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
)

export const Blog = model<IBlog>('Blog', blogSchema)
export const BlogCategory = model<IBlogCategory>(
  'BlogCategory',
  blogCategorySchema
)
