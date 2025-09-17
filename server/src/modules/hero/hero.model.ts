import { Schema, model, Document } from 'mongoose'

export interface IHero extends Document {
  title: string
  subtitle?: string
  role?: string
  description?: string
  ctaText?: string
  ctaLink?: string
  heroImage?: string
  locale: string // en, bn etc
  createdAt: Date
  updatedAt: Date
}

const heroSchema = new Schema<IHero>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    role: { type: String },
    description: { type: String },
    ctaText: { type: String },
    ctaLink: { type: String },
    heroImage: { type: String },
    locale: { type: String, required: true, unique: true }, // singleton per locale
  },
  { timestamps: true }
)

export const HeroModel = model<IHero>('Hero', heroSchema)
