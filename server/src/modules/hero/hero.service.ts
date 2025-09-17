import { HeroModel, IHero } from './hero.model'

export const HeroService = {
  async getByLocale(locale = 'en'): Promise<IHero | null> {
    return await HeroModel.findOne({ locale }).lean()
  },

  async createOrUpdate(
    data: Partial<IHero> & { locale: string }
  ): Promise<IHero> {
    // If hero for locale exists, update it; otherwise create new
    const existing = await HeroModel.findOne({ locale: data.locale })
    if (existing) {
      Object.assign(existing, data)
      return await existing.save()
    }
    const hero = new HeroModel(data)
    return await hero.save()
  },

  async removeByLocale(locale: string): Promise<IHero | null> {
    return await HeroModel.findOneAndDelete({ locale })
  },

  async getAll(): Promise<IHero[]> {
    return await HeroModel.find().sort({ createdAt: -1 }).lean()
  },
}
