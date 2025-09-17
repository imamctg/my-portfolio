export interface CourseWithProgress {
  _id: string
  title: string
  slug: string
  thumbnail: string
  instructor:
    | {
        _id: string
        name: string
      }
    | string
  progress: number
  totalLectures: number
  completedLectures: number
}
