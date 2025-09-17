import { Request, Response } from 'express'
import { CtaService } from './cta.service'

export const CtaController = {
  async getByLocale(req: Request, res: Response): Promise<any> {
    try {
      const locale = (req.query.locale as string) || 'en'
      const cta = await CtaService.getByLocale(locale)
      if (!cta) return res.status(404).json({ message: 'CTA not found' })
      res.json(cta)
    } catch (err: any) {
      res.status(500).json({ message: err.message })
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const list = await CtaService.getAll()
      res.json(list)
    } catch (err: any) {
      res.status(500).json({ message: err.message })
    }
  },

  async createOrUpdate(req: Request, res: Response): Promise<any> {
    try {
      const { locale, title, description, buttonText, buttonLink } = req.body
      if (!locale || !title) {
        return res
          .status(400)
          .json({ message: 'Locale and title are required' })
      }

      const cta = await CtaService.createOrUpdate({
        locale,
        title,
        description,
        buttonText,
        buttonLink,
      })

      res.status(200).json(cta)
    } catch (err: any) {
      res.status(400).json({ message: err.message })
    }
  },

  async removeByLocale(req: Request, res: Response): Promise<any> {
    try {
      const { locale } = req.query
      if (!locale)
        return res.status(400).json({ message: 'Locale is required' })

      const removed = await CtaService.removeByLocale(locale as string)
      if (!removed) return res.status(404).json({ message: 'Not found' })
      res.json({ message: 'Deleted successfully' })
    } catch (err: any) {
      res.status(500).json({ message: err.message })
    }
  },
}
