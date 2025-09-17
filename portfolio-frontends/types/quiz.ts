export interface Question {
  // question: string
  questionText: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

export interface Quiz {
  _id: string
  title: string
  course: string
  questions: Question[]
  lecture?: string
  section?: string
}

export interface Lecture {
  _id: string
  title: string
  description: string
  videoUrl: string
  duration: number
  isFreePreview: boolean
  completed?: boolean
  resources: { type: string; name: string; url: string; mimeType: string }[]
  resourceUrl?: string
  resourcePublicId?: string
  resourceType?: string // 'link' or MIME type like 'application/pdf'
}

export interface Section {
  _id: string
  title: string
  lectures: Lecture[]
}
