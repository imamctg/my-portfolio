import { Request, Response } from 'express'
import { HeroService } from './hero.service'

export const HeroController = {
  async getByLocale(req: Request, res: Response): Promise<any> {
    try {
      const locale = (req.query.locale as string) || 'en'
      const hero = await HeroService.getByLocale(locale)
      if (!hero) return res.status(404).json({ message: 'Hero not found' })
      res.json(hero)
    } catch (err: any) {
      res.status(500).json({ message: err.message })
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const list = await HeroService.getAll()
      res.json(list)
    } catch (err: any) {
      res.status(500).json({ message: err.message })
    }
  },

  async createOrUpdate(req: Request, res: Response): Promise<any> {
    try {
      const {
        locale,
        title,
        subtitle,
        role,
        description,
        ctaText,
        ctaLink,
        heroImage,
      } = req.body
      if (!locale || !title)
        return res
          .status(400)
          .json({ message: 'Locale and title are required' })

      const hero = await HeroService.createOrUpdate({
        locale,
        title,
        subtitle,
        role,
        description,
        ctaText,
        ctaLink,
        heroImage,
      })
      res.status(200).json(hero)
    } catch (err: any) {
      res.status(400).json({ message: err.message })
    }
  },

  async removeByLocale(req: Request, res: Response): Promise<any> {
    try {
      const { locale } = req.query
      if (!locale)
        return res.status(400).json({ message: 'Locale is required' })
      const removed = await HeroService.removeByLocale(locale as string)
      if (!removed) return res.status(404).json({ message: 'Not found' })
      res.json({ message: 'Deleted successfully' })
    } catch (err: any) {
      res.status(500).json({ message: err.message })
    }
  },
}
