// server/src/models/affiliateLink.model.ts
import mongoose, { Document, Schema } from 'mongoose'

export interface IAffiliateLink extends Document {
  owner: mongoose.Types.ObjectId
  label: string
  targetUrl: string
  slug?: string
  createdAt: Date
  updatedAt: Date
}

const AffiliateLinkSchema = new Schema<IAffiliateLink>(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    label: { type: String, default: 'Referral link' },
    targetUrl: { type: String, required: true },
    slug: { type: String, index: true, unique: true, sparse: true },
  },
  { timestamps: true }
)

const AffiliateLinkModel =
  mongoose.models.AffiliateLink ||
  mongoose.model<IAffiliateLink>('AffiliateLink', AffiliateLinkSchema)
export default AffiliateLinkModel
