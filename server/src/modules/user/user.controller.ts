import { Request, Response } from 'express'
import {
  getAllUsersService,
  updateUserRoleService,
  updateUserInfoService,
  deleteUserService,
  addCourseToUserService,
  getUserCoursesService,
  updateInstructorStatusService,
} from './user.service'
import User, { USER_ROLES, UserRole } from './user.model'

// সব ইউজার ফেরত দাও
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersService()
    res.json({ users })
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// ইউজারের রোল আপডেট করা
export const updateUserRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const { role } = req.body

    // ✅ Validate role
    if (!USER_ROLES.includes(role as UserRole)) {
      res.status(400).json({ message: 'Invalid role' })
      return
    }

    const user = await updateUserRoleService(id, role)

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.status(200).json({
      message: 'User role updated',
      user,
      availableRoles: USER_ROLES,
    })
  } catch (error) {
    console.error('Error updating user role:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const updateInstructorStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { userId } = req.params
  const { status } = req.body

  try {
    const updatedUser = await updateInstructorStatusService(userId, status)

    return res.status(200).json({
      success: true,
      message: `Instructor status updated to ${status}`,
      user: updatedUser,
    })
  } catch (error: any) {
    if (error.message === 'Invalid status value') {
      return res.status(400).json({ message: error.message })
    } else if (error.message === 'Instructor not found') {
      return res.status(404).json({ message: error.message })
    } else {
      return res
        .status(500)
        .json({ message: 'Server error', error: error.message })
    }
  }
}

// ইউজার ইনফো আপডেট করা
export const updateUserInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const { name, email, password } = req.body

    const user = await updateUserInfoService(
      id,
      name,
      email,
      password,
      req.file
    )

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.status(200).json({ message: 'User info updated successfully', user })
  } catch (error) {
    console.error('Error updating user info:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// ইউজার ডিলিট করা
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const user = await deleteUserService(id)

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.status(200).json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// ইউজারের মধ্যে কোর্স যোগ করা
export const addCourseToUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, courseId } = req.body

    const user = await addCourseToUserService(userId, courseId)

    if (!user) {
      res.status(404).json({ message: 'User or Course not found' })
      return
    }

    res.status(200).json({ message: 'Course added successfully', user })
  } catch (error: any) {
    console.error('Error in addCourseToUser:', error.message || error)
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message || error })
  }
}

// ইউজারের কোর্সগুলো পাওয়া
export const getUserCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id
    const courses = await getUserCoursesService(userId)

    if (!courses) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.status(200).json({ courses })
  } catch (error) {
    console.error('Error fetching user courses:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
