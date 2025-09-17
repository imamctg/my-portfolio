import { CtaModel, ICta } from './cta.model'

export const CtaService = {
  async getByLocale(locale = 'en'): Promise<ICta | null> {
    return await CtaModel.findOne({ locale }).lean()
  },

  async getAll(): Promise<ICta[]> {
    return await CtaModel.find().sort({ createdAt: -1 }).lean()
  },

  async createOrUpdate(
    data: Partial<ICta> & { locale: string }
  ): Promise<ICta> {
    const existing = await CtaModel.findOne({ locale: data.locale })
    if (existing) {
      Object.assign(existing, data)
      return await existing.save()
    }
    const item = new CtaModel(data)
    return await item.save()
  },

  async removeByLocale(locale: string): Promise<ICta | null> {
    return await CtaModel.findOneAndDelete({ locale })
  },
}
