export default interface User {
  _id: string
  name: string
  email: string
  role: 'student' | 'admin' | 'instructor'
  status?: 'pending' | 'approved' | 'rejected'
  createdAt: string
  bio?: string
  website?: string
  experience?: string
  nidFileUrl?: string
  profileImage?: string
  notes?: string
}
