import { Schema, model, Document } from 'mongoose'

export interface ICta extends Document {
  title: string
  description?: string
  buttonText?: string
  buttonLink?: string
  locale: string // en, bn etc
  createdAt: Date
  updatedAt: Date
}

const ctaSchema = new Schema<ICta>(
  {
    title: { type: String, required: true },
    description: { type: String },
    buttonText: { type: String },
    buttonLink: { type: String },
    locale: { type: String, unique: true }, // singleton per locale
  },
  { timestamps: true }
)

export const CtaModel = model<ICta>('Cta', ctaSchema)
