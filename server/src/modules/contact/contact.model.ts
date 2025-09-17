// src/modules/contact/contact.model.ts

import mongoose, { Schema, Document } from 'mongoose'

export interface IContactMessage extends Document {
  name: string
  email: string
  message: string
  userId?: mongoose.Types.ObjectId
  createdAt: Date
}

const ContactSchema: Schema<IContactMessage> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

export const ContactMessage =
  mongoose.models.ContactMessage ||
  mongoose.model<IContactMessage>('ContactMessage', ContactSchema)
