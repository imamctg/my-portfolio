import { Schema, model, Document } from 'mongoose'

export enum WithdrawalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

export enum WithdrawalMethod {
  BKASH = 'bkash',
  NAGAD = 'nagad',
  BANK = 'bank',
  PAYPAL = 'paypal',
}

export enum UserType {
  INSTRUCTOR = 'instructor',
  AFFILIATE = 'affiliate',
  ADMIN = 'admin',
}

export interface IWithdrawal extends Document {
  user: Schema.Types.ObjectId
  userType: UserType
  amount: number
  method: WithdrawalMethod
  accountDetails: string
  status: WithdrawalStatus
  processedBy?: Schema.Types.ObjectId
  processedAt?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const withdrawalSchema = new Schema<IWithdrawal>(
  {
    // প্রত্যেক user আসলে 'User' কালেকশনের ডকুমেন্ট
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },

    userType: { type: String, required: true, enum: Object.values(UserType) },
    amount: { type: Number, required: true, min: 100 },
    method: {
      type: String,
      required: true,
      enum: Object.values(WithdrawalMethod),
    },
    accountDetails: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: Object.values(WithdrawalStatus),
      default: WithdrawalStatus.PENDING,
    },
    processedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    processedAt: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
)

export const Withdrawal = model<IWithdrawal>('Withdrawal', withdrawalSchema)
