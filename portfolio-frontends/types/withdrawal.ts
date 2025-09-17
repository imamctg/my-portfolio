export interface Withdrawal {
  _id: string
  user: {
    name: string
    email: string
  }
  amount: number
  method: string
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected'
  accountDetails: string
  createdAt: string
}
