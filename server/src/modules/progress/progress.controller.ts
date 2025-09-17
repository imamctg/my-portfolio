import { Request, Response } from 'express'
import { getCourseProgressService } from './progress.service'
import { StatusCodes } from 'http-status-codes'
import { validateObjectId } from '../../utils/validation'

export const getCourseProgress = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    console.log('✅ Reached progress controller')
    console.log(req.user, 'user')
    const userId = req.user.id
    console.log(userId, 'userId')

    if (!validateObjectId(userId)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Invalid user ID' })
    }

    const coursesWithProgress = await getCourseProgressService(userId)

    return res.status(StatusCodes.OK).json({ courses: coursesWithProgress })
  } catch (error) {
    console.error('Error getting course progress:', error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error fetching course progress' })
  }
}
