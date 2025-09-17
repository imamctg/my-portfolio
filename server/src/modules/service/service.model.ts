import { Schema, model, Document } from 'mongoose'

interface IProcess {
  title: string
  description: string
  icon: string
  duration: string
}

interface IFaq {
  q: string
  a: string
}

export interface IService extends Document {
  title: string
  slug: string
  description: string
  overview?: string
  icon?: string
  published: boolean
  technologies: string[]
  features: string[]
  deliverables: string[]
  process: IProcess[]
  faqs: IFaq[]
}

const processSchema = new Schema<IProcess>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'FaTools' },
  duration: { type: String },
})

const faqSchema = new Schema<IFaq>({
  q: { type: String, required: true },
  a: { type: String, required: true },
})

const serviceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    overview: { type: String },
    icon: { type: String, default: 'FaLaptopCode' },
    published: { type: Boolean, default: false },
    technologies: { type: [String], default: [] },
    features: { type: [String], default: [] },
    deliverables: { type: [String], default: [] },
    process: { type: [processSchema], default: [] },
    faqs: { type: [faqSchema], default: [] },
  },
  { timestamps: true }
)

export const ServiceModel = model<IService>('Service', serviceSchema)
