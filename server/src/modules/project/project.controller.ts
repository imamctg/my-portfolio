import { Request, Response } from 'express'
import { ProjectService } from './project.service'
import { uploadToCloudinary } from '../../utils/cloudinaryUpload'

export const ProjectController = {
  async getAll(req: Request, res: Response) {
    const projects = await ProjectService.getAll()
    res.json(projects)
  },

  // Get Single Project by ID
  async getSingle(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params
      const project = await ProjectService.getSingle(id)

      if (!project) {
        return res.status(404).json({ message: 'Project not found' })
      }

      res.status(200).json(project)
    } catch (error: any) {
      console.error('Error in getSingle:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  },

  // Get project by slug
  async getBySlug(req: Request, res: Response): Promise<any> {
    try {
      console.log(req.params, 'req.params for slug')
      const { slug } = req.params
      const project = await ProjectService.getBySlug(slug)

      if (!project) {
        return res.status(404).json({ message: 'Project not found' })
      }

      res.status(200).json(project)
    } catch (error: any) {
      console.error('Error in getBySlug:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  },

  async getFeatured(req: Request, res: Response) {
    const projects = await ProjectService.getFeatured()
    res.json(projects)
  },

  async create(req: Request, res: Response) {
    console.log(req.body, 'project controller')
    try {
      let thumbnailUrl = ''
      if (req.file) {
        const uploadResult = await uploadToCloudinary(
          req.file.buffer,
          'projects',
          `project-${Date.now()}`,
          'image'
        )
        thumbnailUrl = uploadResult.secure_url
      }

      const projectData = {
        ...req.body,
        thumbnail: thumbnailUrl,
      }

      const project = await ProjectService.create(projectData)
      res.status(201).json(project)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  },

  async update(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params
      let updateData = { ...req.body }

      if (req.file) {
        const uploadResult = await uploadToCloudinary(
          req.file.buffer,
          'projects',
          `project-${Date.now()}`,
          'image'
        )
        updateData.thumbnail = uploadResult.secure_url
      }

      const project = await ProjectService.update(id, updateData)
      if (!project)
        return res.status(404).json({ message: 'Project not found' })
      res.json(project)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  },

  async remove(req: Request, res: Response): Promise<any> {
    const { id } = req.params
    const project = await ProjectService.remove(id)
    if (!project) return res.status(404).json({ message: 'Project not found' })
    res.json({ message: 'Project deleted successfully' })
  },
}
