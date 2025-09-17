import { v2 as cloudinary } from 'cloudinary'

/**
 * Improved public_id extraction from Cloudinary URL
 * Handles various URL formats and versions
 */
export const extractPublicId = (url: string): string => {
  try {
    // Remove everything before '/upload/'
    const uploadPart = url.split('/upload/')[1]
    if (!uploadPart) return ''

    // Remove any version prefix (v1234567890/)
    const versionRegex = /^v\d+\//
    const withoutVersion = uploadPart.replace(versionRegex, '')

    // Remove file extension and any transformation parameters
    const basePart = withoutVersion.split(/[?#]/)[0] // Remove query params
    const parts = basePart.split('.')
    if (parts.length > 1) {
      parts.pop() // Remove extension
    }

    return parts.join('.')
  } catch (error) {
    console.error('Error extracting public ID:', error)
    return ''
  }
}

/**
 * Enhanced video duration fetcher with:
 * - Better error handling
 * - Exponential backoff
 * - Timeout
 * - Resource validation
 */
export const getCloudinaryVideoDuration = async (
  publicId: string,
  maxRetries = 5,
  initialDelay = 1000,
  timeout = 15000
): Promise<number> => {
  try {
    let lastError: Error | null = null
    let delay = initialDelay

    const startTime = Date.now()

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Check timeout
        if (Date.now() - startTime > timeout) {
          throw new Error('Duration fetch timed out')
        }

        const result = await cloudinary.api.resource(publicId, {
          resource_type: 'video',
          image_metadata: true,
        })

        if (result?.duration) {
          console.log(
            `Successfully got duration (${result.duration}s) for ${publicId} on attempt ${attempt}`
          )
          return Math.round(result.duration)
        }

        // If no duration but no error, wait and retry
        lastError = new Error('Duration not available yet')
      } catch (error: any) {
        lastError = error
        console.warn(
          `Attempt ${attempt} failed for ${publicId}:`,
          error.message
        )

        // Don't retry for certain errors
        if (
          error.message.includes('Not found') ||
          error.message.includes('Invalid')
        ) {
          break
        }
      }

      // Exponential backoff with jitter
      if (attempt < maxRetries) {
        const jitter = Math.random() * 500 // Add random jitter
        await new Promise((res) => setTimeout(res, delay + jitter))
        delay *= 2 // Double the delay each time
      }
    }

    console.error(
      `Failed to get duration after ${maxRetries} attempts for ${publicId}`,
      lastError?.message || 'Unknown error'
    )
    return 0
  } catch (error) {
    console.error('Unexpected error in getCloudinaryVideoDuration:', error)
    return 0
  }
}
