// import Course from '../models/course.model'
// import User from '../models/user.model'

// export const addCourseToUser = async (userId: string, courseId: string) => {
//   const user = await User.findById(userId)
//   const course = await Course.findById(courseId)

//   if (!user || !course) {
//     throw new Error('User or Course not found')
//   }

//   const alreadyPurchased = user.purchasedCourses.includes(course._id)
//   if (!alreadyPurchased) {
//     user.purchasedCourses.push(course._id)
//     await user.save()
//   }

//   return user
// }
