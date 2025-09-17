import { Request, Response } from 'express'
import { BlogService } from './blog.service'
import { v2 as cloudinary } from 'cloudinary'
import { uploadToCloudinary } from '../../utils/cloudinaryUpload'

/**
 * Blog & Category Controllers
 */
export const BlogController = {
  // ---------------- BLOG ----------------
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const blogs = await BlogService.getAllBlogs()
      res.json(blogs)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  },

  async getBySlug(req: Request, res: Response): Promise<any> {
    try {
      const { slug } = req.params
      const blog = await BlogService.getBlogBySlug(slug)
      if (!blog) return res.status(404).json({ message: 'Blog not found' })
      res.json(blog)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  },

  async create(req: Request, res: Response) {
    try {
      const {
        title,
        content,
        category,
        draft,
        tags,
        seoTitle,
        seoDescription,
      } = req.body

      let thumbnailUrl = ''
      if (req.file) {
        const uploadResult = await uploadToCloudinary(
          req.file.buffer,
          'blogs',
          `blog-${Date.now()}`,
          'image'
        )
        thumbnailUrl = uploadResult.secure_url
      }

      const blogData = {
        title,
        content,
        category,
        draft: draft === 'true' || draft === true,
        tags: JSON.parse(tags || '[]'),
        seoTitle,
        seoDescription,
        thumbnail: thumbnailUrl,
      }

      const blog = await BlogService.createBlog(blogData)
      res.status(201).json(blog)
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
          'blogs',
          `blog-${Date.now()}`,
          'image'
        )
        updateData.thumbnail = uploadResult.secure_url
      }

      if (updateData.tags) {
        updateData.tags = JSON.parse(updateData.tags)
      }

      const blog = await BlogService.updateBlog(id, updateData)
      if (!blog) return res.status(404).json({ message: 'Blog not found' })
      res.json(blog)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  },

  async remove(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params
      const blog = await BlogService.deleteBlog(id)
      if (!blog) return res.status(404).json({ message: 'Blog not found' })
      res.json({ message: 'Blog deleted successfully' })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  },

  // ---------------- CATEGORY ----------------
  async getCategories(req: Request, res: Response) {
    try {
      const categories = await BlogService.getAllCategories()
      res.json(categories)
    } catch (error: any) {
      res
        .status(500)
        .json({ message: 'Failed to fetch categories', error: error.message })
    }
  },

  async createCategory(req: Request, res: Response): Promise<any> {
    try {
      const { name } = req.body
      if (!name)
        return res.status(400).json({ message: 'Category name required' })
      const category = await BlogService.createCategory(name)
      res.status(201).json(category)
    } catch (error: any) {
      res
        .status(500)
        .json({ message: 'Failed to create category', error: error.message })
    }
  },

  async deleteCategory(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params
      const deleted = await BlogService.deleteCategory(id)
      if (!deleted)
        return res.status(404).json({ message: 'Category not found' })
      res.json({ message: 'Category deleted successfully' })
    } catch (error: any) {
      res
        .status(500)
        .json({ message: 'Failed to delete category', error: error.message })
    }
  },
}
