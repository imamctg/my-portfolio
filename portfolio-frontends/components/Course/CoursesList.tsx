// 'use client'
// import { useEffect, useState } from 'react'
// import axios from 'axios'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { useTranslations } from 'next-intl'

// const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
// const CoursesList = () => {
//   const [courses, setCourses] = useState([])
//   const router = useRouter()
//   const t = useTranslations('courses')
//   const searchParams = useSearchParams()
//   const ref = searchParams.get('ref')

//   useEffect(() => {
//     // const instructorId = searchParams.get('ref') // or 'instructor'
//     const instructorId = ref // or 'instructor'

//     const params: any = { status: 'published' }
//     if (instructorId) {
//       params.instructor = instructorId
//     }

//     axios
//       .get(`${baseURL}/courses`, { params })
//       .then((res) => setCourses(res.data.data))
//       .catch((err) => console.error(err))
//   }, [])

//   const handleEnroll = (slug: string) => {
//     const ref = searchParams.get('ref')
//     const queryString = ref ? `?ref=${ref}` : ''
//     router.push(`/courses/${slug}${queryString}`)
//   }

//   return (
//     <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 py-8'>
//       {courses.map((course: any) => (
//         <div
//           key={course._id}
//           className='bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition duration-300'
//         >
//           <img
//             src={course.thumbnail || 'https://via.placeholder.com/400x250'}
//             alt={course.title}
//             className='w-full h-48 object-cover'
//           />
//           <div className='p-5'>
//             <h2 className='text-xl font-bold mb-2 text-gray-800'>
//               {course.title}
//             </h2>
//             <p className='text-gray-600 text-sm mb-4 line-clamp-3'>
//               {course.description}
//             </p>
//             <p className='text-sm text-gray-600 mb-2'>
//               {course.instructor?.name || t('unknownInstructor')}
//             </p>
//             <div className='flex justify-between items-center'>
//               <span className='text-blue-600 font-bold text-lg'>
//                 ${course.price}
//               </span>
//               <button
//                 onClick={() => handleEnroll(course.slug)}
//                 className='bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition'
//               >
//                 {t('enroll')}
//               </button>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   )
// }

// export default CoursesList

'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
const CoursesList = () => {
  const [courses, setCourses] = useState([])
  const [refRole, setRefRole] = useState<string | null>(null)
  const router = useRouter()
  const t = useTranslations('courses')
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref')

  useEffect(() => {
    const params: any = { status: 'published' }
    if (ref) {
      params.ref = ref // API তে পাঠাবো যাতে role চেক হয়
    }

    axios
      .get(`${baseURL}/courses`, { params })
      .then((res) => {
        setCourses(res.data.data)
        setRefRole(res.data.role || null) // role store করলাম
      })
      .catch((err) => console.error(err))
  }, [ref])

  const handleEnroll = (slug: string) => {
    // যদি affiliate হয় তাহলে ref সঙ্গে যাবে
    const queryString = ref && refRole === 'affiliate' ? `?ref=${ref}` : ''

    router.push(`/courses/${slug}${queryString}`)
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 py-8'>
      {courses.map((course: any) => (
        <div
          key={course._id}
          className='bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition duration-300'
        >
          <img
            src={course.thumbnail || 'https://via.placeholder.com/400x250'}
            alt={course.title}
            className='w-full h-48 object-cover'
          />
          <div className='p-5'>
            <h2 className='text-xl font-bold mb-2 text-gray-800'>
              {course.title}
            </h2>
            <p className='text-gray-600 text-sm mb-4 line-clamp-3'>
              {course.description}
            </p>
            <p className='text-sm text-gray-600 mb-2'>
              {course.instructor?.name || t('unknownInstructor')}
            </p>
            <div className='flex justify-between items-center'>
              <span className='text-blue-600 font-bold text-lg'>
                ${course.price}
              </span>
              <button
                onClick={() => handleEnroll(course.slug)}
                className='bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition'
              >
                {t('enroll')}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CoursesList
