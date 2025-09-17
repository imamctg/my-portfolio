import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    )

    const readable = new Readable()
    readable.push(fileBuffer)
    readable.push(null)
    readable.pipe(uploadStream)
  })
}

export { cloudinary }
