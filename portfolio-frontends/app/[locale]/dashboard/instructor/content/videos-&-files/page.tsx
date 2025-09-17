'use client'

import { useState } from 'react'
import { FaCloudUploadAlt, FaDownload } from 'react-icons/fa'
// import { toast } from 'react-toastify'
import toast from 'react-hot-toast'

export default function VideosAndFilesPage() {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([
    'Intro.mp4',
    'slides.pdf',
  ])
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return toast.error('Please select a file to upload')

    setLoading(true)
    try {
      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setUploadedFiles((prev) => [...prev, file.name])
      setFile(null)
      toast.success('File uploaded successfully')
    } catch (error) {
      toast.error('Failed to upload')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-4 md:p-6 space-y-6'>
      <h2 className='text-2xl font-bold text-gray-800 flex items-center gap-2'>
        <FaCloudUploadAlt className='text-green-600' /> Videos & Files
      </h2>

      {/* Upload Section */}
      <div className='bg-white dark:bg-gray-900 p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800'>
        <h3 className='text-lg font-semibold mb-4'>Upload New File</h3>
        <form
          className='flex flex-col md:flex-row gap-4 items-start md:items-center'
          onSubmit={handleUpload}
        >
          <input
            type='file'
            className='border border-gray-300 dark:border-gray-700 p-2 rounded w-full md:w-auto'
            onChange={handleFileChange}
          />
          <button
            type='submit'
            disabled={loading}
            className='bg-green-600 hover:bg-green-700 transition text-white px-6 py-2 rounded shadow disabled:opacity-60'
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>

      {/* File List */}
      <div className='bg-white dark:bg-gray-900 p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800'>
        <h3 className='text-lg font-semibold mb-3'>Uploaded Files</h3>
        {uploadedFiles.length === 0 ? (
          <p className='text-gray-500'>No files uploaded yet.</p>
        ) : (
          <ul className='space-y-2'>
            {uploadedFiles.map((fileName, index) => (
              <li
                key={index}
                className='flex items-center justify-between border-b border-dashed border-gray-300 pb-2 text-gray-800 dark:text-gray-100'
              >
                <span>{fileName}</span>
                <button className='text-blue-600 hover:underline flex items-center gap-1'>
                  <FaDownload className='w-4 h-4' /> Download
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
