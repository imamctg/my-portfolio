// import axios from 'axios'

// const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

// // Common headers config
// const getAuthConfig = (token: string) => ({
//   headers: {
//     Authorization: `Bearer ${token}`,
//     'Content-Type': 'multipart/form-data',
//   },
// })

// // Course Status Management
// export const submitForReview = async (courseId: string, token: string) => {
//   return axios.post(
//     `${baseURL}/courses/${courseId}/submit`,
//     {},
//     getAuthConfig(token)
//   )
// }

// export const reviewCourse = async (
//   courseId: string,
//   decision: string,
//   token: string,
//   notes?: string
// ) => {
//   return axios.post(
//     `${baseURL}/courses/${courseId}/review`,
//     {
//       decision,
//       notes: notes || '',
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     }
//   )
// }

// export const publishCourse = async (courseId: string, token: string) => {
//   return axios.post(
//     `${baseURL}/courses/${courseId}/publish`,
//     {},
//     getAuthConfig(token)
//   )
// }

// export const archiveCourse = async (courseId: string, token: string) => {
//   return axios.post(`${baseURL}/${courseId}/archive`, {}, getAuthConfig(token))
// }

// export const getCoursesByStatus = async (status: string, token: string) => {
//   return axios.get(`${baseURL}/courses/status/${status}`, getAuthConfig(token))
// }

// // Other course operations
// export const getInstructorCourses = async (
//   instructorId: string,
//   token: string
// ) => {
//   return axios.get(
//     `${baseURL}/courses/${instructorId}/courses`,
//     getAuthConfig(token)
//   )
// }

// export const getCourseDetails = async (courseId: string, token: string) => {
//   return axios.get(
//     `${baseURL}/courses/${courseId}/details`,
//     getAuthConfig(token)
//   )
// }

// export const updateCourse = async (
//   courseId: string,
//   data: any,
//   token: string
// ) => {
//   return axios.put(`${baseURL}/courses/${courseId}`, data, getAuthConfig(token))
// }

// export const getAdminNotes = async (courseId: string, token: string) => {
//   return axios.get(
//     `${baseURL}/courses/${courseId}/admin-notes`,
//     getAuthConfig(token)
//   )
// }

// export const resubmitCourse = async (
//   courseId: string,
//   responseNote: string,
//   token: string
// ) => {
//   return axios.post(
//     `${baseURL}/courses/${courseId}/resubmit`,
//     { responseNote },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     }
//   )
// }
