import { ITestimonial, TestimonialModel } from './testimonial.model'

export const TestimonialService = {
  async getAll(): Promise<ITestimonial[]> {
    return await TestimonialModel.find().sort({ createdAt: -1 })
  },

  async create(data: Partial<ITestimonial>): Promise<ITestimonial> {
    const testimonial = new TestimonialModel(data)
    return await testimonial.save()
  },

  async remove(id: string): Promise<ITestimonial | null> {
    return await TestimonialModel.findByIdAndDelete(id)
  },
}
