import mongoose, { Schema, Document } from 'mongoose'

export interface ICoupon extends Document {
  code: string
  discount: number
  discountType?: 'flat' | 'percentage' // ✅ added
  expiresAt: Date
  instructor: mongoose.Types.ObjectId
  expired?: boolean
  applicableCourses?: mongoose.Types.ObjectId[]
}

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true }, // Either 20 (flat) or 20 (%) — depends on discountType
    discountType: {
      type: String,
      enum: ['flat', 'percentage'], // ✅ new field
      default: 'flat',
    },
    expiresAt: { type: Date, required: true },
    instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expired: { type: Boolean, default: false },
    applicableCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
  },
  { timestamps: true }
)

export const CouponModel = mongoose.model<ICoupon>('Coupon', couponSchema)
