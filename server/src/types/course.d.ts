export interface Lecture {
  title: string
  videoUrl: string
  isFreePreview?: boolean
}

export interface Section {
  title: string
  lectures: Lecture[]
}

export interface CourseInput {
  title: string
  description?: string
  price?: number
  thumbnailUrl?: string
  introVideoUrl?: string
  instructor?: string
  sections?: Section[]
}
