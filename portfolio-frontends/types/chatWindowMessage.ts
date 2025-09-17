export interface Message {
  _id: string
  senderId: string
  receiverId: string
  content: string
  createdAt: string
  seen: boolean
}
