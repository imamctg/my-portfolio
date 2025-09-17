interface TopCourse {
  title: string
  totalSales: number
  instructor: string
  price: number
}

interface Props {
  courses: TopCourse[]
}

const TopCoursesTable: React.FC<Props> = ({ courses }) => {
  return (
    <div className='bg-white p-6 rounded-xl shadow-md mt-6'>
      <h2 className='text-xl font-semibold mb-4'>🔥 Top Selling Courses</h2>
      <div className='overflow-x-auto'>
        <table className='min-w-full table-auto text-sm text-left'>
          <thead className='bg-gray-100 text-gray-600'>
            <tr>
              <th className='px-4 py-2'>Course Title</th>
              <th className='px-4 py-2'>Instructor</th>
              <th className='px-4 py-2'>Price</th>
              <th className='px-4 py-2'>Total Sales</th>
              <th className='px-4 py-2'>Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={index} className='border-b hover:bg-gray-50'>
                <td className='px-4 py-2 font-medium'>{course.title}</td>
                <td className='px-4 py-2'>{course.instructor}</td>
                <td className='px-4 py-2'>${course.price}</td>
                <td className='px-4 py-2'>{course.totalSales}</td>
                <td className='px-4 py-2'>
                  ${course.totalSales * course.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export {}
