import { Request, Response } from 'express'
import * as serviceService from './service.service'

export const getAll = async (req: Request, res: Response) => {
  try {
    const services = await serviceService.getAllServices()
    res.json(services)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch services' })
  }
}

export const getById = async (req: Request, res: Response): Promise<any> => {
  try {
    const service = await serviceService.getServiceById(req.params.id)
    if (!service) return res.status(404).json({ message: 'Service not found' })
    res.json(service)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch service' })
  }
}

export const getBySlug = async (req: Request, res: Response): Promise<any> => {
  try {
    const service = await serviceService.getServiceBySlug(req.params.slug)
    if (!service) return res.status(404).json({ message: 'Service not found' })
    res.json(service)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch service by slug' })
  }
}

export const create = async (req: Request, res: Response) => {
  try {
    const service = await serviceService.createService(req.body)
    res.status(201).json(service)
  } catch (err) {
    res.status(500).json({ message: 'Failed to create service' })
  }
}

export const update = async (req: Request, res: Response): Promise<any> => {
  try {
    const service = await serviceService.updateService(req.params.id, req.body)
    if (!service) return res.status(404).json({ message: 'Service not found' })
    res.json(service)
  } catch (err) {
    res.status(500).json({ message: 'Failed to update service' })
  }
}

export const remove = async (req: Request, res: Response): Promise<any> => {
  try {
    const service = await serviceService.deleteService(req.params.id)
    if (!service) return res.status(404).json({ message: 'Service not found' })
    res.json({ message: 'Service deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete service' })
  }
}
