import { Blog, BlogCategory, IBlog } from './blog.model'
import slugify from 'slugify'
import { nanoid } from 'nanoid'

/**
 * Blog & Category Services
 */
export const BlogService = {
  // ---------------- BLOG ----------------
  async getAllBlogs() {
    return await Blog.find()
      .populate('category', 'name')
      .sort({ createdAt: -1 })
  },

  async getBlogBySlug(slug: string) {
    return await Blog.findOne({ slug }).populate('category', 'name')
  },

  async createBlog(data: Partial<IBlog>) {
    if (!data.title) {
      throw new Error('Title is required')
    }

    // 1. title থেকে slug বানানো
    const baseSlug = slugify(data.title, { lower: true, strict: true })

    // 2. unique slug তৈরি করা (course.service এর মতো)
    let slug = `${baseSlug}-${nanoid(6)}`
    while (await Blog.findOne({ slug })) {
      slug = `${baseSlug}-${nanoid(6)}`
    }

    data.slug = slug

    const blog = new Blog(data)
    return await blog.save()
  },

  async updateBlog(id: string, data: Partial<IBlog>) {
    // slug update করতে চাইলে title থেকে আবার slug বানানো হবে
    if (data.title) {
      const baseSlug = slugify(data.title, { lower: true, strict: true })
      let slug = `${baseSlug}-${nanoid(6)}`
      while (await Blog.findOne({ slug })) {
        slug = `${baseSlug}-${nanoid(6)}`
      }
      data.slug = slug
    }

    return await Blog.findByIdAndUpdate(id, data, { new: true }).populate(
      'category',
      'name'
    )
  },

  async deleteBlog(id: string) {
    return await Blog.findByIdAndDelete(id)
  },

  // ---------------- CATEGORY ----------------
  async getAllCategories() {
    return await BlogCategory.find().sort({ createdAt: -1 })
  },

  async createCategory(name: string) {
    const category = new BlogCategory({ name })
    return await category.save()
  },

  async deleteCategory(id: string) {
    return await BlogCategory.findByIdAndDelete(id)
  },
}
