import Course from '../course/course.model'
import UserProgress from '../course/UserProgress.model'
import { Types } from 'mongoose'

// ✅ Course Progress Return Type
interface CourseProgress {
  _id: Types.ObjectId
  title: string
  thumbnail: string
  instructor: {
    name: string
    _id: string
  }
  progress: number
  totalLectures: number
  completedLectures: number
}

// ✅ Custom Lean Course Type
interface EnrolledCourseLean {
  _id: Types.ObjectId
  title: string
  slug: string
  thumbnail: string
  instructor: {
    _id: Types.ObjectId
    name: string
  }
  sections: {
    lectures: {
      _id: Types.ObjectId
    }[]
  }[]
}

export const getCourseProgressService = async (
  userId: string
): Promise<CourseProgress[]> => {
  // ✅ 1. Get enrolled courses with instructor populated
  const enrolledCourses = await Course.find(
    { students: userId },
    '_id title thumbnail instructor sections slug'
  )
    .populate<{ instructor: { _id: Types.ObjectId; name: string } }>(
      'instructor',
      'name'
    )
    .lean<EnrolledCourseLean[]>()

  // ✅ 2. Get completed lecture IDs for the user
  const completedLectures = await UserProgress.find(
    { user: userId, completed: true },
    'lecture'
  ).lean()

  const completedLectureIds = completedLectures.map((cl) =>
    cl.lecture.toString()
  )

  // ✅ 3. Calculate progress for each course
  const coursesWithProgress: CourseProgress[] = enrolledCourses.map(
    (course) => {
      let totalLectures = 0
      let completedLecturesCount = 0

      const sections = course.sections || []

      sections.forEach((section) => {
        const lectures = section.lectures || []
        lectures.forEach((lecture) => {
          totalLectures++
          if (completedLectureIds.includes(lecture._id.toString())) {
            completedLecturesCount++
          }
        })
      })

      const progress =
        totalLectures > 0
          ? Math.round((completedLecturesCount / totalLectures) * 100)
          : 0

      return {
        _id: course._id,
        title: course.title,
        slug: course.slug,
        thumbnail: course.thumbnail,
        instructor: {
          _id: course.instructor._id.toString(),
          name: course.instructor.name,
        },
        progress,
        totalLectures,
        completedLectures: completedLecturesCount,
      }
    }
  )

  return coursesWithProgress
}
