import mongoose, { Schema, Types, Document } from 'mongoose'

export interface IReferralTracking extends Document {
  referrerId: Types.ObjectId
  referredUserId?: Types.ObjectId
  courseId?: Types.ObjectId
  action: 'signup' | 'purchase'
  transactionId?: string
  createdAt: Date
}

const referralTrackingSchema = new Schema<IReferralTracking>(
  {
    referrerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    referredUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    action: { type: String, enum: ['signup', 'purchase'], required: true },
    transactionId: { type: String },
  },
  { timestamps: true }
)

export const ReferralTracking = mongoose.model<IReferralTracking>(
  'ReferralTracking',
  referralTrackingSchema
)
