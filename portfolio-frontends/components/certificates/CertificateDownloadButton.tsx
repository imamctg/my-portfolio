'use client'

import React from 'react'

type Props = {
  userId: string
  courseId: string
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
const CertificateDownloadButton: React.FC<Props> = ({ userId, courseId }) => {
  const handleDownload = async () => {
    try {
      const res = await fetch(
        `${baseURL}/certificate/${encodeURIComponent(
          userId
        )}/${encodeURIComponent(courseId)}`
      )

      if (!res.ok) throw new Error('Failed to fetch certificate URL')

      const data = await res.json()
      const cloudinaryUrl = data.url

      // Fetch the actual file from Cloudinary as blob
      const fileResponse = await fetch(cloudinaryUrl)
      const blob = await fileResponse.blob()

      // Create blob URL
      const blobUrl = window.URL.createObjectURL(blob)

      // Create anchor with custom filename
      const anchor = document.createElement('a')
      anchor.href = blobUrl
      anchor.download = `certificate.pdf` // ✅ Force download as PDF
      document.body.appendChild(anchor)
      anchor.click()

      // Cleanup
      window.URL.revokeObjectURL(blobUrl)
      document.body.removeChild(anchor)
    } catch (error) {
      console.error('Error downloading certificate:', error)
      alert('Error downloading certificate')
    }
  }

  return (
    <button
      onClick={handleDownload}
      className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
    >
      Download Certificate
    </button>
  )
}

export default CertificateDownloadButton
