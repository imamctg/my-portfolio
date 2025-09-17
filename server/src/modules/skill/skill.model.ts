// server/src/modules/skill/skill.model.ts
import { Schema, model, Document } from 'mongoose'

export interface ISkill extends Document {
  name: string
  level?: 'beginner' | 'intermediate' | 'expert' | string
  order?: number
  icon?: string // optional icon name or url
  createdAt: Date
  updatedAt: Date
  locale?: string
}

const skillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true },
    level: { type: String },
    order: { type: Number, default: 0 },
    icon: { type: String },
    locale: { type: String, default: 'en' },
  },
  { timestamps: true }
)

export const SkillModel = model<ISkill>('Skill', skillSchema)
