import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IOrder extends Document {
  _id: Types.ObjectId
  userId: Types.ObjectId
  courseId: Types.ObjectId
  paymentType: string
  amount: number
  discountAmount: number
  finalPrice: number

  status: 'pending' | 'paid' | 'failed'
  transactionId: string
  receiptUrl?: string
  referrerId?: Types.ObjectId
  discountPercent?: number
  discountType?: 'flat' | 'percentage' // ✅ New
  discountValue?: number
  createdAt: Date
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    paymentType: { type: String, required: true },
    amount: { type: Number, required: true },
    discountAmount: { type: Number, required: true },
    finalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    transactionId: { type: String, required: true }, // 👈 এই ফিল্ড
    receiptUrl: { type: String },
    referrerId: { type: Schema.Types.ObjectId, ref: 'User' },
    discountPercent: { type: Number },
    discountType: {
      type: String,
      enum: ['flat', 'percentage'],
    },
    discountValue: {
      type: Number,
    },
  },
  { timestamps: true }
)

export const Order = mongoose.model<IOrder>('Order', orderSchema)
