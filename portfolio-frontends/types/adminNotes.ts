export interface Note {
  type: 'note' | 'request' | 'response'
  message: string
  createdAt: Date | string
  admin?: {
    _id: string
    name: string
    email: string
  }
  responseNote?: string
  updatedAt?: Date | string
}
