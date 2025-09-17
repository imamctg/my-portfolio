'use client'

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { RootState } from 'features/redux/store'
import { useSelector } from 'react-redux'
import { Loader2 } from 'lucide-react'
import { Lecture, LectureResource, Section } from 'types/lecture'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

const CreateCoursePage = () => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progress, setProgress] = useState({
    percentage: 0,
    message: 'Preparing to upload...',
  })
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [introVideo, setIntroVideo] = useState<File | null>(null)
  const [sections, setSections] = useState<Section[]>([])

  const user = useSelector((state: RootState) => state.auth.user)
  const instructorId = user?.id
  const token = useSelector((state: RootState) => state.auth.token)

  // Section management
  const addSection = () => {
    setSections([...sections, { title: '', lectures: [] }])
  }

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index))
  }

  const updateSectionTitle = (index: number, title: string) => {
    const updated = [...sections]
    updated[index].title = title
    setSections(updated)
  }

  // Lecture management
  const addLecture = (sectionIndex: number) => {
    const updated = [...sections]
    updated[sectionIndex].lectures.push({
      title: '',
      videoUrl: '',
      isFreePreview: false,
      file: null,
      duration: 0,
      description: '',
      resources: [],
    })
    setSections(updated)
  }

  const updateLecture = (
    sectionIndex: number,
    lectureIndex: number,
    field: keyof Lecture,
    value: any
  ) => {
    const updated = [...sections]
    const lecture = updated[sectionIndex].lectures[lectureIndex]

    if (field === 'file') {
      lecture[field] = value as File | null
    } else {
      updated[sectionIndex].lectures[lectureIndex] = {
        ...lecture,
        [field]: value,
      }
    }

    setSections(updated)
  }

  const addResource = (
    sectionIndex: number,
    lectureIndex: number,
    type: 'file' | 'link'
  ) => {
    const updated = [...sections]
    updated[sectionIndex].lectures[lectureIndex].resources.push({
      type,
      name: '',
      url: '',
      file: type === 'file' ? null : undefined,
    })
    setSections(updated)
  }

  const updateResource = (
    sectionIndex: number,
    lectureIndex: number,
    resourceIndex: number,
    field: keyof LectureResource,
    value: any
  ) => {
    const updated = [...sections]
    const resource =
      updated[sectionIndex].lectures[lectureIndex].resources[resourceIndex]

    if (field === 'file') {
      updated[sectionIndex].lectures[lectureIndex].resources[resourceIndex] = {
        ...resource,
        file: value as File | null,
        name: value?.name || '',
      }
    } else {
      updated[sectionIndex].lectures[lectureIndex].resources[resourceIndex] = {
        ...resource,
        [field]: value,
      }
    }

    setSections(updated)
  }

  const removeResource = (
    sectionIndex: number,
    lectureIndex: number,
    resourceIndex: number
  ) => {
    const updated = [...sections]
    updated[sectionIndex].lectures[lectureIndex].resources.splice(
      resourceIndex,
      1
    )
    setSections(updated)
  }

  const removeLecture = (sectionIndex: number, lectureIndex: number) => {
    const updated = [...sections]
    updated[sectionIndex].lectures.splice(lectureIndex, 1)
    setSections(updated)
  }

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!thumbnail || !introVideo) {
      alert('Please upload thumbnail and intro video.')
      return
    }

    // Validate each lecture has a video file
    for (const [sIndex, section] of sections.entries()) {
      for (const [lIndex, lecture] of section.lectures.entries()) {
        if (!lecture.file) {
          alert(
            `Please upload video for Section ${sIndex + 1}, Lecture ${
              lIndex + 1
            }`
          )
          return
        }
      }
    }

    setIsSubmitting(true)
    setProgress({ percentage: 0, message: 'Preparing files...' })

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('instructor', instructorId || '')
      formData.append('thumbnail', thumbnail)
      formData.append('introVideo', introVideo)

      // Add sections metadata with resources
      const sectionsData = sections.map((section) => ({
        title: section.title,
        lectures: section.lectures.map((lecture) => ({
          title: lecture.title,
          description: lecture.description,
          isFreePreview: lecture.isFreePreview,
          duration: lecture.duration,
          resources: lecture.resources.map((resource) => ({
            type: resource.type,
            name: resource.name,
            url: resource.url,
          })),
        })),
      }))
      formData.append('sections', JSON.stringify(sectionsData))

      // Count total files to upload for progress calculation
      let totalFiles = 2 // thumbnail + introVideo
      sections.forEach((section) => {
        section.lectures.forEach((lecture) => {
          totalFiles++ // video file
          lecture.resources.forEach((resource) => {
            if (resource.type === 'file' && resource.file) {
              totalFiles++ // resource file
            }
          })
        })
      })

      let uploadedFiles = 0

      // Upload lecture files with progress tracking
      for (const [sIndex, section] of sections.entries()) {
        for (const [lIndex, lecture] of section.lectures.entries()) {
          if (lecture.file) {
            formData.append(`lectureFile_${sIndex}_${lIndex}`, lecture.file)
            uploadedFiles++
            setProgress({
              percentage: Math.round((uploadedFiles / totalFiles) * 100),
              message: `Uploading lecture ${lIndex + 1} of section ${
                sIndex + 1
              }...`,
            })
          }

          // Upload resources
          for (const [rIndex, resource] of lecture.resources.entries()) {
            if (resource.type === 'file' && resource.file) {
              formData.append(
                `resource_${sIndex}_${lIndex}_${rIndex}`,
                resource.file
              )
              uploadedFiles++
              setProgress({
                percentage: Math.round((uploadedFiles / totalFiles) * 100),
                message: `Uploading resources for lecture ${lIndex + 1}...`,
              })
            }
          }
        }
      }

      // Final upload
      setProgress({ percentage: 95, message: 'Finalizing course creation...' })

      const res = await axios.post(`${baseURL}/courses`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      setProgress({ percentage: 100, message: 'Course created successfully!' })
      await new Promise((resolve) => setTimeout(resolve, 500))
      router.push('/dashboard/instructor/courses')
    } catch (error: any) {
      console.error('Error:', error.response?.data || error.message)
      setIsSubmitting(false)
      setProgress({ percentage: 0, message: 'Upload failed' })
      alert('Course creation failed. Please try again.')
    }
  }

  return (
    <div className='max-w-4xl mx-auto mt-4 p-6 border rounded-lg shadow space-y-6'>
      <h2 className='text-2xl font-bold mb-4'>Create a New Course</h2>

      {/* Loading overlay */}
      {isSubmitting && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg max-w-md w-full'>
            <div className='flex items-center space-x-4 mb-4'>
              <Loader2 className='animate-spin h-8 w-8 text-blue-500' />
              <div>
                <h3 className='font-semibold text-lg'>Creating Course</h3>
                <p className='text-gray-600'>{progress.message}</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className='w-full bg-gray-200 rounded-full h-2.5'>
              <div
                className='bg-blue-600 h-2.5 rounded-full'
                style={{ width: `${progress.percentage}%` }}
              ></div>
            </div>

            <p className='text-right mt-1 text-sm text-gray-500'>
              {progress.percentage}% complete
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Basic Course Info */}
        <div className='space-y-4'>
          <div>
            <label className='font-semibold block mb-1'>Course Title</label>
            <input
              type='text'
              placeholder='Title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className='w-full border px-3 py-2 rounded'
            />
          </div>

          <div>
            <label className='font-semibold block mb-1'>Description</label>
            <textarea
              placeholder='Description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className='w-full border px-3 py-2 rounded'
              rows={4}
            />
          </div>

          <div>
            <label className='font-semibold block mb-1'>Price</label>
            <input
              type='number'
              placeholder='Price'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className='w-full border px-3 py-2 rounded'
            />
          </div>
        </div>

        {/* Media Uploads */}
        <div className='space-y-4'>
          <div>
            <label className='font-semibold block mb-1'>
              Course Thumbnail (Image)
            </label>
            <input
              type='file'
              accept='image/*'
              onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
              required
              className='w-full'
            />
          </div>

          <div>
            <label className='font-semibold block mb-1'>Intro Video</label>
            <input
              type='file'
              accept='video/*'
              onChange={(e) => setIntroVideo(e.target.files?.[0] || null)}
              required
              className='w-full'
            />
          </div>
        </div>

        {/* Sections */}
        <div>
          <h3 className='text-lg font-semibold mb-2'>Course Sections</h3>
          {sections.map((section, sIndex) => (
            <div key={sIndex} className='border p-3 mb-4 rounded space-y-2'>
              <div className='flex justify-between items-center'>
                <input
                  type='text'
                  placeholder='Section Title'
                  value={section.title}
                  onChange={(e) => updateSectionTitle(sIndex, e.target.value)}
                  className='w-full border px-3 py-2 rounded'
                  required
                />
                <button
                  type='button'
                  onClick={() => removeSection(sIndex)}
                  className='ml-2 text-red-600 hover:text-red-800'
                  title='Remove section'
                >
                  🗑️
                </button>
              </div>

              {section.lectures.map((lecture, lIndex) => (
                <div key={lIndex} className='border p-3 rounded space-y-2'>
                  <div>
                    <label className='block font-medium mb-1'>
                      Lecture Title
                    </label>
                    <input
                      type='text'
                      placeholder='Lecture Title'
                      value={lecture.title}
                      onChange={(e) =>
                        updateLecture(sIndex, lIndex, 'title', e.target.value)
                      }
                      className='w-full border px-2 py-1 rounded'
                      required
                    />
                  </div>

                  <div>
                    <label className='block font-medium mb-1'>
                      Description (optional)
                    </label>
                    <textarea
                      placeholder='Lecture Description'
                      value={lecture.description ?? ''}
                      onChange={(e) =>
                        updateLecture(
                          sIndex,
                          lIndex,
                          'description',
                          e.target.value
                        )
                      }
                      className='w-full border px-2 py-1 rounded'
                    />
                  </div>

                  <div>
                    <label className='block font-medium mb-1'>
                      Lecture Video
                    </label>
                    <input
                      type='file'
                      accept='video/*'
                      onChange={(e) =>
                        updateLecture(
                          sIndex,
                          lIndex,
                          'file',
                          e.target.files?.[0]
                        )
                      }
                      className='w-full border px-2 py-1 rounded'
                      required
                    />
                    {lecture.file && (
                      <div className='text-sm text-green-600 mt-1'>
                        Selected: {lecture.file.name}
                      </div>
                    )}
                  </div>

                  {/* Resources Section */}
                  <div className='space-y-2'>
                    <label className='block font-medium mb-1'>Resources</label>
                    {lecture.resources.map((resource, rIndex) => (
                      <div
                        key={rIndex}
                        className='flex items-center gap-2 mb-2'
                      >
                        {resource.type === 'file' && resource.file && (
                          <span className='text-sm'>{resource.file.name}</span>
                        )}
                        {resource.type === 'link' && (
                          <input
                            type='url'
                            placeholder='https://example.com'
                            value={resource.url}
                            onChange={(e) =>
                              updateResource(
                                sIndex,
                                lIndex,
                                rIndex,
                                'url',
                                e.target.value
                              )
                            }
                            className='flex-1 border px-2 py-1 rounded text-sm'
                          />
                        )}
                        <button
                          type='button'
                          onClick={() => removeResource(sIndex, lIndex, rIndex)}
                          className='text-red-500 hover:text-red-700'
                        >
                          Remove
                        </button>
                      </div>
                    ))}

                    <div className='flex gap-2'>
                      <button
                        type='button'
                        onClick={() => addResource(sIndex, lIndex, 'file')}
                        className='bg-gray-200 px-2 py-1 rounded text-sm'
                      >
                        Add File
                      </button>
                      <button
                        type='button'
                        onClick={() => addResource(sIndex, lIndex, 'link')}
                        className='bg-gray-200 px-2 py-1 rounded text-sm'
                      >
                        Add Link
                      </button>
                    </div>

                    {lecture.resources.map(
                      (resource, rIndex) =>
                        resource.type === 'file' &&
                        !resource.file && (
                          <div key={`file-${rIndex}`} className='mt-1'>
                            <input
                              type='file'
                              accept='.pdf,.zip,.png,.jpg,.jpeg'
                              onChange={(e) =>
                                updateResource(
                                  sIndex,
                                  lIndex,
                                  rIndex,
                                  'file',
                                  e.target.files?.[0]
                                )
                              }
                              className='w-full text-sm'
                            />
                          </div>
                        )
                    )}
                  </div>

                  <div className='flex items-center'>
                    <input
                      type='checkbox'
                      id={`freePreview-${sIndex}-${lIndex}`}
                      checked={lecture.isFreePreview}
                      onChange={(e) =>
                        updateLecture(
                          sIndex,
                          lIndex,
                          'isFreePreview',
                          e.target.checked
                        )
                      }
                      className='mr-2'
                    />
                    <label htmlFor={`freePreview-${sIndex}-${lIndex}`}>
                      Free Preview
                    </label>
                  </div>

                  <button
                    type='button'
                    onClick={() => removeLecture(sIndex, lIndex)}
                    className='text-red-500 hover:text-red-700 text-sm'
                  >
                    Remove Lecture
                  </button>
                </div>
              ))}

              <button
                type='button'
                onClick={() => addLecture(sIndex)}
                className='bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 text-sm'
              >
                ➕ Add Lecture
              </button>
            </div>
          ))}

          <button
            type='button'
            onClick={addSection}
            className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
          >
            ➕ Add Section
          </button>
        </div>

        <button
          type='submit'
          disabled={isSubmitting}
          className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center justify-center ${
            isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className='animate-spin mr-2 h-4 w-4' />
              Creating...
            </>
          ) : (
            '✅ Create Course'
          )}
        </button>
      </form>
    </div>
  )
}

export default CreateCoursePage
