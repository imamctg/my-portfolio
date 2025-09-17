// import { RootState } from 'features/redux/store'
// import { useSelector } from 'react-redux'

// const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
// export async function fetchPendingReviews() {
//   const token = useSelector((state: RootState) => state.auth.token)

//   try {
//     const response = await fetch(`${baseURL}/courses/pending-reviews`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       // Next.js 13/14-এ cache এবং revalidate অপশন ব্যবহার করুন
//       cache: 'no-store', // এটি ডাটা সর্বদা ফ্রেশ করতে সাহায্য করে
//       // next: { revalidate: 3600 } // প্রতি ঘন্টায় ডাটা revalidate করবে (ঐচ্ছিক)
//     })

//     if (!response.ok) {
//       throw new Error('Failed to fetch pending reviews')
//     }

//     const courses = await response.json()
//     return courses
//   } catch (error) {
//     console.error('Error fetching pending reviews:', error)
//     return []
//   }
// }
