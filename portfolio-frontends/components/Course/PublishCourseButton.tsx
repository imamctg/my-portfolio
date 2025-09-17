// src/components/course/PublishCourseButton.tsx
// import { publishCourse } from '@/services/courseService';
import { publishCourse } from 'app/[locale]/services/courseService'
import { RootState } from 'features/redux/store'
import { useRouter } from 'next/router'
import { Root } from 'postcss'
import { useSelector } from 'react-redux'

export const PublishCourseButton = ({ courseId }: { courseId: string }) => {
  const router = useRouter()
  const token = useSelector((state: RootState) => state.auth.token)

  const handlePublish = async () => {
    try {
      await publishCourse(courseId, token)
      router.reload()
      alert('Course published successfully!')
    } catch (error) {
      alert('Failed to publish course')
    }
  }

  return (
    <button
      onClick={handlePublish}
      className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'
    >
      Publish Course
    </button>
  )
}
