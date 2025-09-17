import User, { USER_ROLES, UserRole } from './user.model'
import Course from '../course/course.model'
import bcrypt from 'bcryptjs'
import { uploadToCloudinary } from '../../middlewares/cloudinary'

// সব ইউজার ফেরত দাও
export const getAllUsersService = async () => {
  return await User.find().select('-password')
}

// ইউজারের রোল আপডেট করা
export const updateUserRoleService = async (id: string, role: string) => {
  if (!USER_ROLES.includes(role as UserRole)) {
    throw new Error(`Invalid role: ${role}`)
  }

  const user = await User.findById(id)
  if (!user) return null

  user.role = role as UserRole
  await user.save()
  return user
}

export const updateInstructorStatusService = async (
  userId: string,
  status: 'pending' | 'approved' | 'rejected'
) => {
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    throw new Error('Invalid status value')
  }

  const user = await User.findById(userId)
  if (!user || user.role !== 'instructor') {
    throw new Error('Instructor not found')
  }

  user.status = status
  await user.save()

  return user
}

// ইউজার ইনফো আপডেট করা
export const updateUserInfoService = async (
  id: string,
  name?: string,
  email?: string,
  password?: string,
  file?: Express.Multer.File
) => {
  const user = await User.findById(id)
  if (!user) return null

  let profileImageUrl = user.profileImage
  if (file) {
    const result = await uploadToCloudinary(file.buffer, 'users')
    profileImageUrl = result.secure_url
  }

  if (name) user.name = name
  if (email) user.email = email
  if (profileImageUrl) user.profileImage = profileImageUrl

  if (password) {
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
  }

  await user.save()
  return user
}

// ইউজার ডিলিট করা
export const deleteUserService = async (id: string) => {
  const user = await User.findByIdAndDelete(id)
  return user
}

// ইউজারের মধ্যে কোর্স যোগ করা
export const addCourseToUserService = async (
  userId: string,
  courseId: string
) => {
  const user = await User.findById(userId)
  const course = await Course.findById(courseId)

  if (!user || !course) return null

  const alreadyHasCourse = user.purchasedCourses.some(
    (c) => c.toString() === course._id.toString()
  )

  if (!alreadyHasCourse) {
    user.purchasedCourses.push(course._id)
    await user.save()
  }

  return user
}

// ইউজারের কোর্সগুলো পাওয়া
export const getUserCoursesService = async (userId: string) => {
  const user = await User.findById(userId).populate({
    path: 'purchasedCourses',
    populate: {
      path: 'instructor',
      select: 'name',
    },
  })

  if (!user) return null
  return user.purchasedCourses
}
