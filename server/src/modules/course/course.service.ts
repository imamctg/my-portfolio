import mongoose, { Types } from 'mongoose'
import { uploadToCloudinary } from '../../utils/cloudinaryUpload'
import { canChangeStatus } from '../../utils/courseStatus'
import { getCloudinaryVideoDuration } from '../../utils/getCloudinaryVideoDuration'
import Course, { ILecture, COURSE_STATUSES, CourseStatus } from './course.model'
import LectureModel from './Lecture.model'
import UserProgressModel from './UserProgress.model'
import User, { IUser } from '../user/user.model'
import slugify from 'slugify'
import { nanoid } from 'nanoid'

export const handleCourseCreation = async (
  body: any,
  files: Express.Multer.File[]
) => {
  const { title, description, price, instructor, sections: sectionsJSON } = body

  if (!files || files.length === 0) {
    throw new Error('No files provided')
  }

  // Upload thumbnail and intro video in parallel
  const [thumbnailUpload, introVideoUpload] = await Promise.all([
    (async () => {
      const thumbnailFile = files.find((file) => file.fieldname === 'thumbnail')
      if (!thumbnailFile) throw new Error('Thumbnail is required')
      return uploadToCloudinary(
        thumbnailFile.buffer,
        'thumbnails',
        `thumbnail-${Date.now()}`,
        'image'
      )
    })(),
    (async () => {
      const introVideoFile = files.find(
        (file) => file.fieldname === 'introVideo'
      )
      if (!introVideoFile) throw new Error('Intro video is required')
      return uploadToCloudinary(
        introVideoFile.buffer,
        'introVideos',
        `introVideo-${Date.now()}`,
        'video'
      )
    })(),
  ])

  const parsedSections: any[] = JSON.parse(sectionsJSON)

  // Process all sections and lectures
  const sections = await Promise.all(
    parsedSections.map(async (section: any, sIndex: number) => {
      const lectures = await Promise.all(
        section.lectures.map(async (lecture: any, lIndex: number) => {
          const fileFieldName = `lectureFile_${sIndex}_${lIndex}`
          const lectureFile = files.find(
            (file) => file.fieldname === fileFieldName
          )

          if (!lectureFile) {
            throw new Error(
              `Lecture video missing for section ${sIndex + 1}, lecture ${
                lIndex + 1
              }`
            )
          }

          // Process video upload first
          const videoUpload = await uploadToCloudinary(
            lectureFile.buffer,
            'lectureVideos',
            `lecture_${sIndex}_${lIndex}_${Date.now()}`,
            'video'
          )

          // Get video duration
          const duration = await getCloudinaryVideoDuration(
            videoUpload.public_id
          )

          // Process all resources for this lecture
          const resources = await Promise.all(
            lecture.resources.map(async (resource: any, rIndex: number) => {
              if (resource.type === 'file') {
                const resourceFieldName = `resource_${sIndex}_${lIndex}_${rIndex}`
                const resourceFile = files.find(
                  (file) => file.fieldname === resourceFieldName
                )

                if (!resourceFile) {
                  throw new Error(
                    `Resource file missing for lecture ${
                      lIndex + 1
                    }, resource ${rIndex + 1}`
                  )
                }

                const resourceUpload = await uploadToCloudinary(
                  resourceFile.buffer,
                  'lectureResources',
                  `resource_${sIndex}_${lIndex}_${rIndex}_${Date.now()}`,
                  'raw'
                )

                return {
                  type: 'file',
                  name: resource.name || resourceFile.originalname,
                  url: resourceUpload.secure_url,
                  mimeType: resourceFile.mimetype,
                }
              } else {
                // For links, just store the URL and name
                return {
                  type: 'link',
                  name: resource.name || resource.url,
                  url: resource.url,
                }
              }
            })
          )

          return {
            title: lecture.title,
            description: lecture.description || '',
            videoUrl: videoUpload.secure_url,
            duration,
            resources,
            isFreePreview: lecture.isFreePreview || false,
          }
        })
      )

      return {
        title: section.title,
        lectures,
      }
    })
  )
  const baseSlug = slugify(title, { lower: true, strict: true })
  const slug = `${baseSlug}-${nanoid(6)}`

  // Create and save the course
  const course = new Course({
    title,
    description,
    price,
    instructor,
    thumbnail: thumbnailUpload.secure_url,
    introVideo: introVideoUpload.secure_url,
    sections,
    slug,
    status: 'draft', // Default status
  })

  await course.save()
  return course
}

export const handleCourseUpdate = async (
  courseId: string,
  body: any,
  thumbnailFile?: Express.Multer.File
) => {
  const existingCourse = await Course.findById(courseId)
  if (!existingCourse) {
    throw new Error('Course not found')
  }

  let thumbnailUrl = existingCourse.thumbnail
  if (thumbnailFile) {
    const thumbnailUpload = await uploadToCloudinary(
      thumbnailFile.buffer,
      'thumbnails',
      `thumbnail-${Date.now()}`,
      'image'
    )
    thumbnailUrl = thumbnailUpload.secure_url
  }

  existingCourse.title = body.title || existingCourse.title
  existingCourse.description = body.description || existingCourse.description
  existingCourse.price = body.price || existingCourse.price
  existingCourse.level = body.level || existingCourse.level
  existingCourse.language = body.language || existingCourse.language
  existingCourse.category = body.category || existingCourse.category
  existingCourse.thumbnail = thumbnailUrl

  await existingCourse.save()
  return existingCourse
}

export const getLectureById = async (
  courseId: string,
  sectionId: string,
  lectureId: string
) => {
  const course = await Course.findById(courseId)
  if (!course) return null

  const section = course.sections.id(sectionId)
  if (!section) return null

  const lecture = section.lectures.id(lectureId)
  return lecture || null
}

export const updateSectionById = async ({
  courseId,
  sectionId,
  title,
  description,
  isPublished,
  resourceFile,
}: {
  courseId: string
  sectionId: string
  title?: string
  description?: string
  isPublished?: boolean
  resourceFile?: Express.Multer.File
}) => {
  const course = await Course.findById(courseId)
  if (!course) return null

  const section = course.sections.id(sectionId)
  if (!section) return null

  if (title) section.title = title
  if (description !== undefined) section.description = description
  if (isPublished !== undefined) section.isPublished = isPublished

  if (resourceFile) {
    const resourceUpload = await uploadToCloudinary(
      resourceFile.buffer,
      'sectionResources',
      `section_resource_${Date.now()}`,
      'raw'
    )
    section.resourceUrl = resourceUpload.secure_url
  }

  await course.save()
  return section
}

export const markLectureCompleted = async (
  lectureId: string,
  userId: string,
  courseId: string
) => {
  // ✅ Validate that the course contains the lecture
  const course = await Course.findOne({ 'sections.lectures._id': lectureId })
  if (!course) {
    throw new Error('Course containing lecture not found')
  }

  let foundLecture: ILecture | null = null
  for (const section of course.sections) {
    const lecture = section.lectures.id(lectureId)
    if (lecture) {
      foundLecture = lecture
      break
    }
  }

  if (!foundLecture) {
    throw new Error('Lecture not found in any section')
  }

  // ✅ Save or update progress including course ID
  const updatedProgress = await UserProgressModel.findOneAndUpdate(
    { user: userId, lecture: lectureId },
    {
      user: userId,
      course: courseId, // ✅ include courseId to support reload check
      lecture: lectureId,
      completed: true,
      completedAt: new Date(),
    },
    { upsert: true, new: true }
  )

  return updatedProgress
}

export const getCourseWithProgress = async (
  courseId: string,
  userId: string
) => {
  // Implementation remains same
}

// New Status Management Functions
export const submitCourseForReview = async (
  courseId: string,
  instructorId: string
) => {
  const course = await Course.findOne({
    _id: courseId,
    instructor: instructorId,
    status: { $in: ['draft', 'changes_requested'] },
  })

  if (!course) throw new Error('Invalid submission request')

  course.status = 'under_review'
  await course.save()
  return course
}

export const publishCourse = async (courseId: string, instructorId: string) => {
  // First get the course to clean adminNotes
  const course = await Course.findOne({
    _id: courseId,
    instructor: instructorId,
    status: 'approved',
  })

  if (!course) throw new Error('Course not approved or not found')

  // Clean invalid adminNotes
  course.adminNotes = course.adminNotes.filter(
    (note: any) => note.note && note.note.trim() !== ''
  )

  course.status = 'published'
  course.publishedAt = new Date()
  await course.save()
  return course
}

export const archiveCourse = async (
  courseId: string,
  userId: string,
  isAdmin: boolean
) => {
  const query: any = { _id: courseId }
  if (!isAdmin) {
    query.instructor = userId
  }

  const course = await Course.findOne(query)
  if (!course) throw new Error('Course not found')

  if (
    !canChangeStatus(
      course.status,
      'archived',
      isAdmin ? 'admin' : 'instructor'
    )
  ) {
    throw new Error(
      `Cannot archive course from current status: ${course.status}`
    )
  }

  course.status = 'archived'
  await course.save()
  return course
}

// Helper function to check course ownership
export const checkCourseOwnership = async (
  courseId: string,
  userId: string
) => {
  const course = await Course.findOne({ _id: courseId, instructor: userId })
  if (!course) throw new Error('Course not found or unauthorized')
  return course
}

interface StudentWithCourses
  extends Omit<
    IUser,
    '_id' | 'purchasedCourses' | 'createdCourses' | 'certificates'
  > {
  _id: mongoose.Types.ObjectId
  enrolledCourses: {
    _id: mongoose.Types.ObjectId
    title: string
    enrolledAt: Date
  }[]
}

export const getStudentsOfInstructorCourses = async (instructorId: string) => {
  try {
    // 1. ইনস্ট্রাক্টরের সকল কোর্স খুঁজে বের করুন
    const courses = await Course.find({
      instructor: new mongoose.Types.ObjectId(instructorId),
    }).select('students')

    if (!courses.length) {
      console.log('No courses found for instructor:', instructorId)
      return [] // খালি অ্যারে রিটার্ন করুন
    }

    // 2. সকল স্টুডেন্ট আইডি সংগ্রহ করুন (ইউনিক রাখুন)
    const studentIds = [
      ...new Set(
        courses.flatMap((course) =>
          course.students.map((id: any) => id.toString())
        )
      ),
    ]

    // 3. স্টুডেন্ট ডিটেইলস পপুলেট করুন
    const students = await User.find({
      _id: { $in: studentIds.map((id) => new mongoose.Types.ObjectId(id)) },
    }).select('name email profileImage role')

    return students
  } catch (error) {
    console.error('Error in getStudentsOfInstructorCourses:', error)
    throw error
  }
}
