import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary'
import { cloudinary } from '../middlewares/cloudinary'

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string,
  filename: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<{ secure_url: string; public_id: string }> => {
  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          public_id: filename,
          resource_type: resourceType,
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined
        ) => {
          if (error || !result) return reject(error)
          resolve(result)
        }
      )
      .end(fileBuffer)
  })

  return {
    secure_url: result.secure_url,
    public_id: result.public_id,
  }
}
