export interface ChartItem {
  month: string
  earnings: number
}

export interface PaymentHistoryItem {
  date: string
  amount: number
  status: 'Paid' | 'Pending'
  method: string
}

export interface EarningsData {
  totalEarnings: number
  pendingEarnings: number
  monthlyEarnings: number
  paidEarnings: number
  chartData?: ChartItem[] // ✅ ইহা যোগ করো
  paymentHistory?: PaymentHistoryItem[] // ✅ ইহাও যোগ করো
}

export interface EarningsHistory {
  date: string
  amount: number
  course: string
  status: 'pending' | 'paid'
  source: 'instructor' | 'platform' | 'affiliate'
}
