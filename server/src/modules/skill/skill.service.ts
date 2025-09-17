// server/src/modules/skill/skill.service.ts
import { SkillModel, ISkill } from './skill.model'

export const SkillService = {
  async getByLocale(locale = 'en'): Promise<ISkill[]> {
    return await SkillModel.find({ locale }).sort({ order: 1 }).lean()
  },

  async create(data: Partial<ISkill>): Promise<ISkill> {
    const skill = new SkillModel(data)
    return await skill.save()
  },

  async getOne(id: string): Promise<ISkill | null> {
    return await SkillModel.findById(id).lean()
  },

  async update(id: string, data: Partial<ISkill>) {
    return await SkillModel.findByIdAndUpdate(id, data, { new: true })
  },

  async remove(id: string) {
    return await SkillModel.findByIdAndDelete(id)
  },
}
