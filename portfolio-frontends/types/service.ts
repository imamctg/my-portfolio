export interface Service {
  _id?: string
  id?: string
  slug: string
  title: string
  description: string
  icon: string // icon name as string
  technologies: string[]
  features: string[]
  overview: string
  deliverables: string[]
  process: Array<{
    title: string
    description: string
    icon: string
    duration: string
  }>
  faqs: Array<{
    q: string
    a: string
  }>
  published: boolean
  createdAt?: Date
  updatedAt?: Date
}
