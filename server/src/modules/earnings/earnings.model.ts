import mongoose, { Schema, Document, Types } from 'mongoose'

export type StudentSource = 'instructor' | 'platform' | 'affiliate'
export type DiscountType = 'flat' | 'percentage'
export type EarningStatus = 'pending' | 'paid' | 'reversed' | 'requested'
export interface EarningItem {
  affiliateFee?: number
  createdAt?: string | Date
  orderId?: string
  status?: string
}

export interface IEarnings extends Document {
  instructorId: Types.ObjectId
  referrerId?: Types.ObjectId
  orderId: Types.ObjectId
  courseId: Types.ObjectId
  studentSource: StudentSource
  grossAmount: number
  platformFee: number
  affiliateFee?: number
  instructorEarnings: number
  paymentGatewayFee: number
  status: EarningStatus
  paidAt?: Date
  withdrawnAmount?: number
  discountType?: DiscountType
  discountAmount?: number
  bonusApplied?: boolean
  weeklyCampaignBonus?: number
  monthlyBonus?: number
  affiliateId?: Types.ObjectId
  type: string
  meta?: {
    method?: string
    accountDetails?: any
    requestStatus?: string
    [key: string]: any
  }
  createdAt: Date
  updatedAt: Date
}

const earningsSchema = new Schema<IEarnings>(
  {
    instructorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    referrerId: { type: Schema.Types.ObjectId, ref: 'User' },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      unique: true,
    },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },

    studentSource: {
      type: String,
      enum: ['instructor', 'platform', 'affiliate'],
      required: true,
    },

    grossAmount: { type: Number, required: true },
    platformFee: { type: Number, required: true },
    affiliateFee: { type: Number, default: 0 },
    instructorEarnings: { type: Number, required: true },
    paymentGatewayFee: { type: Number, required: true },

    status: {
      type: String,
      enum: ['pending', 'requested', 'paid', 'reversed'],
      default: 'pending',
    },

    paidAt: { type: Date },
    withdrawnAmount: { type: Number, default: 0 },
    discountType: {
      type: String,
      enum: ['flat', 'percentage'],
    },
    discountAmount: { type: Number },

    bonusApplied: { type: Boolean, default: false },
    weeklyCampaignBonus: { type: Number, default: 0 },
    monthlyBonus: { type: Number, default: 0 },
    affiliateId: { type: Types.ObjectId, ref: 'User', required: false },
    type: { type: String, enum: ['conversion', 'payout'] },
    meta: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
)

export const Earnings = mongoose.model<IEarnings>('Earnings', earningsSchema)
