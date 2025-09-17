import { Types } from 'mongoose'
import { IProject, ProjectModel } from './project.model'
import slugify from 'slugify'
import { nanoid } from 'nanoid'

export const ProjectService = {
  async getAll(): Promise<IProject[]> {
    return await ProjectModel.find().sort({ createdAt: -1 })
  },

  // Get Single Project by ID
  async getSingle(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      return null // Invalid MongoDB ID
    }
    return await ProjectModel.findById(id).lean()
  },

  // Get project by slug
  async getBySlug(slug: string) {
    if (!slug) return null
    return await ProjectModel.findOne({ slug }).lean()
  },

  async getFeatured(): Promise<IProject[]> {
    return await ProjectModel.find({ featured: true }).sort({ createdAt: -1 })
  },

  async create(data: Partial<IProject>): Promise<IProject> {
    if (!data.title) {
      throw new Error('Title is required')
    }

    // 1. title থেকে slug বানানো
    const baseSlug = slugify(data.title, { lower: true, strict: true })

    // 2. unique slug তৈরি করা
    let slug = `${baseSlug}-${nanoid(6)}`
    while (await ProjectModel.findOne({ slug })) {
      slug = `${baseSlug}-${nanoid(6)}`
    }

    data.slug = slug

    const project = new ProjectModel(data)
    return await project.save()
  },

  async update(id: string, data: Partial<IProject>): Promise<IProject | null> {
    if (data.title) {
      const baseSlug = slugify(data.title, { lower: true, strict: true })
      let slug = `${baseSlug}-${nanoid(6)}`
      while (await ProjectModel.findOne({ slug })) {
        slug = `${baseSlug}-${nanoid(6)}`
      }
      data.slug = slug
    }

    return await ProjectModel.findByIdAndUpdate(id, data, { new: true })
  },

  async remove(id: string): Promise<IProject | null> {
    return await ProjectModel.findByIdAndDelete(id)
  },
}
