import { Request, Response } from 'express'
import { TestimonialService } from './testimonial.service'
import { uploadToCloudinary } from '../../utils/cloudinaryUpload'

export const TestimonialController = {
  async getAll(req: Request, res: Response) {
    const testimonials = await TestimonialService.getAll()
    res.json(testimonials)
  },

  async create(req: Request, res: Response) {
    try {
      let profileImageUrl = ''

      if (req.file) {
        const uploadResult = await uploadToCloudinary(
          req.file.buffer,
          'testimonials',
          `testimonial-${Date.now()}`,
          'image'
        )
        profileImageUrl = uploadResult.secure_url
      }

      const testimonialData = {
        ...req.body,
        profileImage: profileImageUrl,
      }

      const testimonial = await TestimonialService.create(testimonialData)
      res.status(201).json(testimonial)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  },

  async remove(req: Request, res: Response): Promise<any> {
    const { id } = req.params
    const testimonial = await TestimonialService.remove(id)
    if (!testimonial)
      return res.status(404).json({ message: 'Testimonial not found' })
    res.json({ message: 'Testimonial deleted successfully' })
  },
}
