// import { Schema, model, models, Document, Types, Model } from 'mongoose'

// export interface IMessage extends Document {
//   senderId: Types.ObjectId
//   receiverId: Types.ObjectId
//   text: string
//   read: boolean
//   senderRole: 'admin' | 'instructor' | 'student'
//   receiverRole: 'admin' | 'instructor' | 'student'
//   createdAt: Date
//   updatedAt: Date
// }

// const messageSchema = new Schema<IMessage>(
//   {
//     senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//     receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//     senderRole: {
//       type: String,
//       enum: ['admin', 'instructor', 'student'],
//       required: true,
//     },
//     receiverRole: {
//       type: String,
//       enum: ['admin', 'instructor', 'student'],
//       required: true,
//     },
//     text: { type: String, required: true },
//     read: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// )

// messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 })

// const Message: Model<IMessage> =
//   models.Message || model<IMessage>('Message', messageSchema)

// export default Message

// ✅ message.model.ts
import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IMessage extends Document {
  senderId: Types.ObjectId
  receiverId: Types.ObjectId
  content: string
  seen: boolean
  createdAt: Date
}

const messageSchema = new Schema<IMessage>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    seen: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const Message = mongoose.model<IMessage>('Message', messageSchema)
