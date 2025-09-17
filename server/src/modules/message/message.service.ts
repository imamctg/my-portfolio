import { Message } from './message.model'
import User, { IUser } from '../user/user.model'
import Course from '../course/course.model'
import { Types } from 'mongoose'

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

  if (currentUser.role === 'instructor') {
    const courses = await Course.find({ instructor: currentUser._id }).select(
      'students'
    )

    const studentIds = new Set(
      courses.flatMap((c) =>
        (c.students as Types.ObjectId[]).map((id: Types.ObjectId) =>
          id.toString()
        )
      )
    )

    const students = allUsers.filter(
      (u) => studentIds.has(u._id.toString()) && u.role === 'student'
    )
    const admin = allUsers.filter((u) => u.role === 'admin')
    return [...students, ...admin]
  }

  // if (currentUser.role === 'student') {
  //   const purchasedCourseIds = currentUser.purchasedCourses || []

  //   // if (!purchasedCourseIds.length) {
  //   //   // fallback: যদি কোনো কোর্স না কেনা থাকে, তাহলে শুধু admin দেখানো হবে
  //   //   return allUsers.filter((u) => u.role === 'admin')
  //   // }

  //   if (!Array.isArray(purchasedCourseIds) || purchasedCourseIds.length === 0) {
  //     // still allow admin
  //     const admin = allUsers.filter((u) => u.role === 'admin')
  //     return admin
  //   }

  //   const courses = await Course.find({
  //     _id: { $in: purchasedCourseIds },
  //   }).select('instructor')

  //   const instructorIds = new Set(
  //     courses.map((c) => (c.instructor as Types.ObjectId).toString())
  //   )
  //   const instructors = allUsers.filter(
  //     (u) => instructorIds.has(u._id.toString()) && u.role === 'instructor'
  //   )
  //   const admin = allUsers.filter((u) => u.role === 'admin')
  //   return [...instructors, ...admin]
  // }

  if (currentUser.role === 'student') {
    const purchasedCourseIds = currentUser.purchasedCourses || []

    if (!Array.isArray(purchasedCourseIds) || purchasedCourseIds.length === 0) {
      const admin = allUsers.filter((u) => u.role === 'admin')
      return admin
    }

    const courses = await Course.find({
      _id: { $in: purchasedCourseIds },
    })
      .select('instructor')
      .lean()

    const instructorIds = new Set(
      courses
        .filter((c) => c.instructor)
        .map((c) => (c.instructor as Types.ObjectId).toString())
    )

    const instructors = allUsers.filter(
      (u) => instructorIds.has(u._id.toString()) && u.role === 'instructor'
    )

    const admin = allUsers.filter((u) => u.role === 'admin')
    return [...instructors, ...admin]
  }

  return []
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
