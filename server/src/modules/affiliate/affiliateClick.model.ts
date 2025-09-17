// server/src/models/affiliateClick.model.ts
import mongoose, { Document, Schema } from 'mongoose'

export interface IAffiliateClick extends Document {
  affiliateUser: mongoose.Types.ObjectId
  link: mongoose.Types.ObjectId
  ip?: string
  userAgent?: string
  referrer?: string
  createdAt: Date
}

const AffiliateClickSchema = new Schema<IAffiliateClick>(
  {
    affiliateUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    link: { type: Schema.Types.ObjectId, ref: 'AffiliateLink', required: true },
    ip: { type: String },
    userAgent: { type: String },
    referrer: { type: String },
  },
  { timestamps: true }
)

const AffiliateClickModel =
  mongoose.models.AffiliateClick ||
  mongoose.model<IAffiliateClick>('AffiliateClick', AffiliateClickSchema)
export default AffiliateClickModel
