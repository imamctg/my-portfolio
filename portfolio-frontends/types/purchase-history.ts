export interface Course {
  _id: string
  title: string
}

export interface Order {
  _id: string
  courseId: Course
  amount: number
  paymentType: string
  status: string
  transactionId: string
  createdAt: string
  receiptUrl?: string
}

export interface Purchase {
  _id: string
  courseId: Course | null // Updated to allow null
  courseTitle?: string // Optional field
  paymentType: string
  amount: number
  status: string
  transactionId: string
  createdAt: string
}
