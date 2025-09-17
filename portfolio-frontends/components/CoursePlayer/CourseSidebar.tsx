import React, { useEffect, useState } from 'react'
import { Quiz, Section, Lecture } from 'types/quiz'

interface Props {
  sections: Section[]
  selectedLectureId: string
  onSelect: (lecture: Lecture) => void
  onQuizOpen: (lectureId?: string, sectionId?: string) => void
  quizzes: Quiz[]
}

const CourseSidebar: React.FC<Props> = ({
  sections,
  selectedLectureId,
  onSelect,
  onQuizOpen,
  quizzes,
}) => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {}
  )
  const [openResources, setOpenResources] = useState<{
    [key: string]: boolean
  }>({})

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const toggleResources = (lectureId: string) => {
    setOpenResources((prev) => ({
      ...prev,
      [lectureId]: !prev[lectureId],
    }))
  }

  // Format seconds to "1h 20m" or "20 min"
  const formatDuration = (seconds: number): string => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    return h > 0 ? `${h}h ${m}m` : `${m} min`
  }

  // Section total lecture time
  const getSectionDuration = (lectures: Lecture[]) =>
    lectures.reduce((acc, lec) => acc + (lec.duration || 0), 0)

  // Check if quiz exists
  const hasQuiz = (lectureId?: string, sectionId?: string): boolean => {
    if (lectureId) return quizzes.some((q) => q.lecture === lectureId)
    if (sectionId) return quizzes.some((q) => q.section === sectionId)
    return false
  }

  // Get file icon and extension
  const getFileInfo = (resource: any) => {
    let icon = '📁'
    let extension = 'file'

    if (resource.type === 'link') {
      return { icon: '🌐', extension: 'link' }
    }

    if (resource.mimeType) {
      if (resource.mimeType.includes('pdf')) {
        icon = '📄'
        extension = 'pdf'
      } else if (resource.mimeType.includes('zip')) {
        icon = '🗄️'
        extension = 'zip'
      } else if (resource.mimeType.includes('image')) {
        icon = '🖼️'
        extension = resource.mimeType.split('/')[1] // png, jpg, etc.
      }
    } else if (resource.url) {
      // Fallback for files without mimeType
      const url = resource.url.toLowerCase()
      if (url.includes('.pdf')) {
        icon = '📄'
        extension = 'pdf'
      } else if (url.includes('.zip')) {
        icon = '🗄️'
        extension = 'zip'
      } else if (
        url.includes('.png') ||
        url.includes('.jpg') ||
        url.includes('.jpeg')
      ) {
        icon = '🖼️'
        extension = url.split('.').pop() || 'image'
      }
    }

    return { icon, extension }
  }

  // Handle file download with proper filename
  const handleFileDownload = (resource: any) => {
    if (resource.type === 'link') {
      window.open(resource.url, '_blank')
      return
    }

    const { extension } = getFileInfo(resource)
    const filename = resource.name
      ? `${resource.name.split('.')[0]}.${extension}`
      : `resource.${extension}`

    fetch(resource.url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      })
      .catch((error) => console.error('Download error:', error))
  }

  // Auto-open current section
  useEffect(() => {
    if (selectedLectureId) {
      const sectionContainingLecture = sections.find((section) =>
        section.lectures.some((lecture) => lecture._id === selectedLectureId)
      )
      if (
        sectionContainingLecture &&
        !openSections[sectionContainingLecture._id]
      ) {
        setOpenSections((prev) => ({
          ...prev,
          [sectionContainingLecture._id]: true,
        }))
      }
    }
  }, [selectedLectureId, sections])

  return (
    <div className='bg-white rounded-xl shadow p-4 h-[calc(100vh-200px)] overflow-y-auto'>
      <h3 className='text-lg font-semibold mb-4'>📚 Course Syllabus</h3>

      {(() => {
        let globalLectureCounter = 0
        return sections.map((section, sectionIndex) => (
          <div key={section._id} className='mb-4'>
            {/* Section Header */}
            <div className='font-bold text-gray-800 mb-2 cursor-pointer flex flex-col p-2 hover:bg-gray-50 rounded-lg'>
              <div
                className='flex items-center justify-between'
                onClick={() => toggleSection(section._id)}
              >
                <div className='flex items-center'>
                  <span className='mr-2'>
                    {openSections[section._id] ? '🔽' : '▶️'}
                  </span>
                  <span>
                    Section {sectionIndex + 1}: {section.title}
                  </span>
                </div>
              </div>

              {/* Progress information below the title */}
              <div className='flex justify-between items-center mt-1 text-xs text-gray-600 ml-6'>
                <span>
                  📚 Lectures: {section.lectures.length} | ✅ Completed:{' '}
                  {section.lectures.filter((l) => l.completed).length}
                </span>
                <span className='bg-gray-100 px-2 py-1 rounded-full'>
                  ⏱ {formatDuration(getSectionDuration(section.lectures))}
                </span>
              </div>
            </div>

            {/* Section Content */}
            {openSections[section._id] && (
              <div className='ml-6 mt-2'>
                {section.lectures.map((lecture) => {
                  globalLectureCounter++
                  const hasResources =
                    lecture.resources && lecture.resources.length > 0

                  return (
                    <div key={lecture._id} className='mb-3'>
                      <div
                        onClick={() => onSelect(lecture)}
                        className={`cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors ${
                          selectedLectureId === lecture._id
                            ? 'bg-blue-50 border-blue-200'
                            : 'border-gray-200'
                        } ${
                          lecture.completed
                            ? 'border-green-200 bg-green-50'
                            : ''
                        }`}
                      >
                        <div className='flex items-start'>
                          {lecture.completed ? (
                            <span className='mr-2 text-green-500 mt-0.5'>
                              ✓
                            </span>
                          ) : (
                            <span className='mr-2 text-gray-400 mt-0.5'>○</span>
                          )}
                          <div className='flex-1'>
                            <div className='flex justify-between items-start'>
                              <p className='font-medium'>
                                Lecture {globalLectureCounter}: {lecture.title}
                              </p>
                              {hasResources && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleResources(lecture._id)
                                  }}
                                  className='text-xs text-gray-500 hover:text-gray-700 ml-2'
                                >
                                  {openResources[lecture._id]
                                    ? '▲ Hide Resources'
                                    : '▼ Show Resources'}
                                </button>
                              )}
                            </div>
                            <p className='text-xs text-gray-500 mt-1'>
                              ⏱{' '}
                              {lecture.duration !== undefined
                                ? formatDuration(lecture.duration)
                                : '...'}
                            </p>

                            {/* Resources Section */}
                            {hasResources && openResources[lecture._id] && (
                              <div className='mt-3 pl-2 border-l-2 border-gray-200'>
                                <div className='space-y-2'>
                                  {lecture.resources.map((resource, index) => {
                                    const { icon, extension } =
                                      getFileInfo(resource)
                                    return (
                                      <div
                                        key={index}
                                        className='flex items-center hover:bg-gray-100 p-1 rounded cursor-pointer'
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleFileDownload(resource)
                                        }}
                                      >
                                        <span className='mr-2'>{icon}</span>
                                        <div>
                                          <span className='text-xs'>
                                            {resource.name ||
                                              (resource.type === 'file'
                                                ? 'Download Resource'
                                                : 'External Link')}
                                          </span>
                                          <span className='text-gray-400 text-xs ml-2'>
                                            ({extension})
                                          </span>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Lecture Quiz Button */}
                      {hasQuiz(lecture._id) && (
                        <div className='mt-1 ml-8'>
                          <button
                            onClick={() => onQuizOpen(lecture._id)}
                            className='inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100 hover:bg-blue-100 transition'
                          >
                            <span className='text-sm'>📝</span>
                            <span className='font-medium'>Take Quiz</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Section Quiz Button */}
                {hasQuiz(undefined, section._id) && (
                  <div className='mt-4 pt-4 border-t border-gray-100'>
                    <button
                      onClick={() => onQuizOpen(undefined, section._id)}
                      className='w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-green-100 text-green-800 rounded-lg shadow-sm hover:bg-green-200 transition'
                    >
                      <span className='text-lg'>🏁</span>
                      <span>Section Quiz</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      })()}
    </div>
  )
}

export default CourseSidebar
