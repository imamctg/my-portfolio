import fs from 'fs'
import mongoose from 'mongoose'
import User from '../user/user.model'
import Course from '../course/course.model'
import { generateCertificate } from '../../utils/generateCertificate'
import { cloudinary } from '../../config/cloudinary'

export const handleCertificateGeneration = async (
  userId: string,
  courseId: string
): Promise<string> => {
  console.log(userId, courseId, 'handleCertificateGeneration')

  // 1. Get user
  const user = await User.findById(userId)
  if (!user) {
    const error: any = new Error('User not found')
    error.status = 404
    throw error
  }

  // 2. Check if certificate already exists
  const existing = user.certificates.find(
    (c) => c.courseId.toString() === courseId
  )
  if (existing) {
    return existing.certificateUrl
  }

  // 3. Get course
  const course = await Course.findById(courseId)
  if (!course) {
    const error: any = new Error('Course not found')
    error.status = 404
    throw error
  }

  // 4. Generate certificate
  const filePath = await generateCertificate(user.name, course.title)
  fs.statSync(filePath)
  await new Promise((res) => setTimeout(res, 300))

  try {
    // 5. Upload to Cloudinary
    const cloudRes = await cloudinary.uploader.upload(filePath, {
      resource_type: 'raw',
      folder: 'certificates',
      use_filename: true,
      unique_filename: false,
    })

    // Delete local file
    fs.unlinkSync(filePath)

    // 6. Build download URL
    const cloudinaryPublicId = cloudRes.public_id
    const sanitizedFileName = `certificate-${user.name.replace(/\s+/g, '-')}`
    const encodedFileName = encodeURIComponent(sanitizedFileName)

    const downloadUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/fl_attachment:${encodedFileName}/${cloudinaryPublicId}`

    // 7. Save certificate to user
    user.certificates.push({
      courseId: new mongoose.Types.ObjectId(courseId),
      certificateUrl: downloadUrl,
      issuedAt: new Date(),
    })

    await user.save()

    // 8. Return URL
    return downloadUrl
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    throw new Error('Certificate upload failed')
  }
}
