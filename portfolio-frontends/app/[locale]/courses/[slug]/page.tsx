// 'use client'

// import { useEffect, useState } from 'react'
// import { useParams, useRouter, useSearchParams } from 'next/navigation'
// import axios from 'axios'

// const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
// const SingleCoursePage = () => {
//   // const { courseId } = useParams()
//   const { slug } = useParams()
//   const router = useRouter()
//   const [course, setCourse] = useState<any>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const searchParams = useSearchParams()

//   useEffect(() => {
//     const refId = searchParams.get('ref')
//     if (refId) {
//       localStorage.setItem(
//         'referrer',
//         JSON.stringify({
//           id: refId,
//           expires: Date.now() + 30 * 24 * 60 * 60 * 1000, // ৩০ দিন
//         })
//       )
//     }
//   }, [searchParams])

//   useEffect(() => {
//     if (slug) {
//       axios
//         .get(`${baseURL}/courses/${slug}`)
//         .then((res) => {
//           setCourse(res.data.data)
//           setLoading(false)
//         })
//         .catch((err) => {
//           setError('Course not found')
//           setLoading(false)
//         })
//     }
//   }, [slug])

//   if (loading) return <p className='p-8 text-center'>Loading...</p>
//   if (error || !course)
//     return <p className='p-8 text-center text-red-500'>Course not found</p>

//   // ✅ Enroll button handler
//   // const handleEnroll = () => {
//   //   router.push(`/courses/${slug}/checkout`)
//   // }

//   const handleEnroll = () => {
//     const referrer = localStorage.getItem('referrer')
//     const ref = referrer ? JSON.parse(referrer)?.id : null

//     const checkoutUrl = ref
//       ? `/courses/${slug}/checkout?ref=${ref}`
//       : `/courses/${slug}/checkout`

//     router.push(checkoutUrl)
//   }

//   return (
//     <div className='min-h-screen p-8'>
//       <div className='max-w-4xl mx-auto border rounded-lg p-8 shadow-lg'>
//         <h1 className='text-4xl font-bold mb-6'>{course.title}</h1>

//         <img
//           src={course.thumbnail || 'https://via.placeholder.com/600x300'}
//           alt={course.title}
//           className='w-full h-64 object-cover rounded mb-6'
//         />

//         <p className='text-gray-700 text-lg mb-4'>{course.description}</p>

//         <p className='text-2xl font-bold text-blue-600 mb-6'>${course.price}</p>

//         <button
//           className='w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded text-lg transition'
//           onClick={handleEnroll}
//         >
//           Enroll Now
//         </button>
//       </div>
//     </div>
//   )
// }

// export default SingleCoursePage
