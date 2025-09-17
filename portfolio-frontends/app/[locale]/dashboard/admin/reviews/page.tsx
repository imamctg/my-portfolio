import { fetchPendingReviews } from 'app/[locale]/actions/course.actions'
import ReviewForm from 'components/admin/ui/ReviewForm'
import CourseCard from 'components/Course/CourseCard'

export default async function AdminReviewPage() {
  const courses = await fetchPendingReviews()

  return (
    <div className='container py-8'>
      <h1 className='text-2xl font-bold mb-6'>Courses Pending Review</h1>

      {courses.length === 0 ? (
        <p className='text-gray-500'>No courses pending review</p>
      ) : (
        <div className='grid gap-6'>
          {courses.map((course) => (
            <div key={course._id} className='border rounded-lg p-4'>
              <CourseCard course={course} />
              <ReviewForm courseId={course._id} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
