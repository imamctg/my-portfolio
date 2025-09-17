// types/lecture.ts
export interface LectureResource {
  type: 'file' | 'link'
  name: string
  url: string
  file?: File | null
  mimeType?: string
  _id?: string // Optional for existing resources from DB
}

export interface Lecture {
  title: string
  videoUrl: string
  isFreePreview: boolean
  file: File | null
  duration?: number
  description?: string
  resources: LectureResource[]
}

export interface Section {
  title: string
  lectures: Lecture[]
}
