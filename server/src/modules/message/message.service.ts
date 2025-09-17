import { Message } from './message.model'
import User, { IUser } from '../user/user.model'

export const sendMessage = async (
  senderId: string,
  receiverId: string,
  content: string
) => {
  return await Message.create({ senderId, receiverId, content })
}

export const getMessagesBetweenUsers = async (
  userId1: string,
  userId2: string
) => {
  return await Message.find({
    $or: [
      { senderId: userId1, receiverId: userId2 },
      { senderId: userId2, receiverId: userId1 },
    ],
  }).sort({ createdAt: 1 })
}

// export const deleteMessages = async (messageIds: string[]) => {
//   return await Message.deleteMany({ _id: { $in: messageIds } })
// }

export const deleteSingleMessage = async (messageId: string) => {
  return await Message.findByIdAndDelete(messageId)
}

export const deleteAllMessagesBetweenUsers = async (
  userId1: string,
  userId2: string
) => {
  return await Message.deleteMany({
    $or: [
      { senderId: userId1, receiverId: userId2 },
      { senderId: userId2, receiverId: userId1 },
    ],
  })
}

export const getAvailableUsers = async (currentUser: IUser) => {
  const allUsers = (await User.find({ _id: { $ne: currentUser._id } })
    .select('name role')
    .lean()) as unknown as Array<{
    _id: string
    name: string
    role: string
  }>

  if (currentUser.role === 'admin') return allUsers
}

export const markMessagesAsSeen = async (
  senderId: string,
  receiverId: string
) => {
  return await Message.updateMany(
    { senderId, receiverId, seen: false },
    { $set: { seen: true } }
  )
}
