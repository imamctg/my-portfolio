// server/src/modules/skill/skill.controller.ts
import { Request, Response } from 'express'
import { SkillService } from './skill.service'

export const SkillController = {
  async getByLocale(req: Request, res: Response) {
    try {
      const locale = (req.query.locale as string) || 'en'
      const skills = await SkillService.getByLocale(locale)
      res.json(skills)
    } catch (err: any) {
      res.status(500).json({ message: err.message })
    }
  },

  async create(req: Request, res: Response) {
    try {
      const created = await SkillService.create(req.body)
      res.status(201).json(created)
    } catch (err: any) {
      res.status(400).json({ message: err.message })
    }
  },

  async getOne(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params
      const skill = await SkillService.getOne(id)
      if (!skill) return res.status(404).json({ message: 'Not found' })
      res.json(skill)
    } catch (err: any) {
      res.status(500).json({ message: err.message })
    }
  },

  async update(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params
      const updated = await SkillService.update(id, req.body)
      if (!updated) return res.status(404).json({ message: 'Not found' })
      res.json(updated)
    } catch (err: any) {
      res.status(400).json({ message: err.message })
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const { id } = req.params
      await SkillService.remove(id)
      res.json({ message: 'Deleted' })
    } catch (err: any) {
      res.status(500).json({ message: err.message })
    }
  },
}
