// components/Course/CourseSidebar.tsx
'use client'

import React from 'react'

interface Lecture {
  id: number
  title: string
  videoUrl: string
  duration: number
  description: string
}

interface Props {
  lectures: Lecture[]
  selectedLectureId: number
  onSelect: (lecture: Lecture) => void
}

const CourseSidebar: React.FC<Props> = ({
  lectures,
  selectedLectureId,
  onSelect,
}) => {
  return (
    <div className='bg-white rounded-xl shadow p-4 h-[450px] overflow-y-auto'>
      <h3 className='text-lg font-semibold mb-4'>📚 কোর্স লেকচারসমূহ</h3>
      {lectures.map((lecture) => (
        <div
          key={lecture.id}
          onClick={() => onSelect(lecture)}
          className={`cursor-pointer mb-3 p-3 border rounded hover:bg-gray-100 ${
            selectedLectureId === lecture.id
              ? 'bg-blue-100 border-blue-500'
              : ''
          }`}
        >
          <p className='font-medium'>{lecture.title}</p>
          <p className='text-xs text-gray-500'>⏱ {lecture.duration} min</p>
        </div>
      ))}
    </div>
  )
}

export default CourseSidebar
