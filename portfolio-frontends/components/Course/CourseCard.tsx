import { Badge } from 'components/ui/badge'
interface Props {
  course: {
    _id: string
    title: string
    status: string
    thumbnail: string
  }
}

export default function CourseCard({ course }: Props) {
  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    under_review: 'bg-blue-100 text-blue-800',
    approved: 'bg-purple-100 text-purple-800',
    published: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    archived: 'bg-yellow-100 text-yellow-800',
    changes_requested: 'bg-orange-100 text-orange-800',
  }

  const statusLabels = {
    draft: 'Draft',
    under_review: 'Under Review',
    approved: 'Approved',
    published: 'Published',
    rejected: 'Rejected',
    archived: 'Archived',
    changes_requested: 'Changes Requested',
  }

  return (
    <div className='border rounded-lg overflow-hidden'>
      <img
        src={course.thumbnail}
        alt={course.title}
        className='w-full h-48 object-cover'
      />
      <div className='p-4'>
        <div className='flex justify-between items-start'>
          <h3 className='font-medium text-lg'>{course.title}</h3>
          <Badge
            className={statusColors[course.status as keyof typeof statusColors]}
          >
            {statusLabels[course.status as keyof typeof statusLabels]}
          </Badge>
        </div>
      </div>
    </div>
  )
}
