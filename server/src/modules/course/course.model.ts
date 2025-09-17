import mongoose, { Schema, Document, Types, FlattenMaps } from 'mongoose'

// ---------- ENUM ----------
export const COURSE_STATUSES = [
  'draft', // ডিফল্ট স্টেট, এডিটেবল
  'under_review', // সাবমিট করা হয়েছে (পূর্বের 'pending')
  'approved', // এডমিন দ্বারা ভেরিফাইড
  'published', // লাইভ স্টেট
  'changes_requested', // এডমিনের মডিফিকেশন রিকোয়েস্ট
  'rejected', // এডমিন দ্বারা রিজেক্টেড
  'archived', // ডিএক্টিভেটেড কোর্স
] as const
export type CourseStatus = (typeof COURSE_STATUSES)[number]

// ---------- INTERFACES ----------

interface ICourseNote {
  type: 'admin_note' | 'instructor_response' | 'change_request'
  author: Types.ObjectId // Admin or Instructor ID
  message: string
  relatedTo?: Types.ObjectId // For threading/response linking
  createdAt: Date
}

export interface ILecture extends Document {
  _id: Types.ObjectId
  title: string
  videoUrl: string
  duration?: number
  isFreePreview?: boolean
  description?: string
  resources: { type: string; name: string; url: string; mimeType: string }[]
  resourceUrl?: string
  resourcePublicId?: string
  resourceType?: string
  completed?: boolean
}

export interface ISection extends Document {
  _id: Types.ObjectId
  title: string
  lectures: Types.DocumentArray<ILecture>
  quiz?: Types.ObjectId
}

// Add these to your ICourse interface

export interface IUserRef extends Document {
  _id: Types.ObjectId
  name: string
  email: string
}
export interface IAdminNote extends Document {
  adminId: Types.ObjectId
  note: string
  responseNote?: string
  createdAt: Date
  updatedAt: Date
}

export interface IChangeRequest extends Document {
  adminId: Types.ObjectId
  message: string
  responseNote?: string
  createdAt: Date
  updatedAt: Date
}

export interface INoteResponse {
  type: 'note' | 'request'
  message: string
  createdAt: Date
  updatedAt: Date
  admin: {
    _id: Types.ObjectId
    name: string
    email: string
  }
  responseNote?: string
}

export interface ICourse extends Document {
  _id: Types.ObjectId
  title: string
  description: string
  price: number
  instructor: Types.ObjectId | string
  slug: string
  thumbnail: string
  introVideo: string
  sections: Types.DocumentArray<ISection>
  students: Types.ObjectId[]
  studentsEnrolledAt: Date[]
  status: CourseStatus
  adminNote?: string
  createdAt: Date
  updatedAt: Date
  rejectionReason?: string // নতুন ফিল্ড যোগ করুন
  publishedAt?: Date // নতুন ফিল্ড
  lastReviewedAt?: Date // নতুন ফিল্ড
  lastReviewedBy?: Types.ObjectId // নতুন ফিল্ড
  adminNotes: Types.DocumentArray<IAdminNote>
  changeRequests: Types.DocumentArray<IChangeRequest>
  changeLog?: string // Track instructor's changes
  // notes: ICourseNote[]
  affiliateDiscount?: number
  instructorDiscount?: number
}

// ---------- SCHEMAS ----------

const resourceSchema = new Schema(
  {
    type: { type: String, enum: ['file', 'link'], required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    mimeType: { type: String }, // Only for file resources
  },
  { _id: false }
)

const lectureSchema = new Schema<ILecture>(
  {
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    duration: { type: Number },
    isFreePreview: { type: Boolean, default: false },
    description: { type: String },
    resources: [resourceSchema],
  },
  { _id: true }
)

const sectionSchema = new Schema<ISection>(
  {
    title: { type: String, required: true },
    lectures: [lectureSchema],
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
    },
  },
  { _id: true }
)

const adminNoteSchema = new Schema<IAdminNote>({
  adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  note: { type: String, required: true },
  responseNote: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const changeRequestSchema = new Schema<IChangeRequest>({
  adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  responseNote: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    slug: { type: String, unique: true, required: true },

    thumbnail: { type: String, required: true },
    introVideo: { type: String, required: true },
    sections: [sectionSchema],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    studentsEnrolledAt: [{ type: Date }],
    status: {
      type: String,
      enum: COURSE_STATUSES,
      default: 'draft',
    },
    adminNote: { type: String, required: false },
    rejectionReason: { type: String }, // রিজেক্ট কারণ
    publishedAt: { type: Date }, // পাবলিশ তারিখ
    lastReviewedAt: { type: Date }, // শেষ রিভিউ তারিখ
    lastReviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    adminNotes: [adminNoteSchema],
    changeRequests: [changeRequestSchema],
    changeLog: { type: String },
    // notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CourseNote' }],
    affiliateDiscount: {
      type: Number,
      default: 0,
      min: 0,
      max: 1, // ১ মানে ১০০%
    },
    instructorDiscount: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },
  },

  { timestamps: true }
)

// ---------- MODEL ----------
export const Course =
  mongoose.models.Course || mongoose.model<ICourse>('Course', courseSchema)

export default Course
