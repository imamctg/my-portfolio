// src/modules/contact/contact.service.ts

import { ContactMessage } from './contact.model'

export const saveMessage = async (data: {
  name: string
  email: string
  message: string
  userId?: string
}) => {
  return await ContactMessage.create(data)
}

export const getMessagesPaginated = async (
  search: string,
  page: number,
  limit: number
) => {
  const filter = search
    ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { message: { $regex: search, $options: 'i' } },
        ],
      }
    : {}

  const messages = await ContactMessage.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)

  const total = await ContactMessage.countDocuments(filter)

  return { messages, total }
}

export const deleteMessageById = async (id: string) => {
  return await ContactMessage.findByIdAndDelete(id)
}
