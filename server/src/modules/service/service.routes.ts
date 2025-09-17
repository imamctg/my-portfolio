import { Router } from 'express'
import * as serviceController from './service.controller'

const router = Router()

// GET all services
router.get('/all', serviceController.getAll)

// GET service by id
router.get('/:id', serviceController.getById)

// GET service by slug
router.get('/slug/:slug', serviceController.getBySlug)

// POST create service
router.post('/create', serviceController.create)

// PUT update service
router.put('/:id', serviceController.update)

// DELETE service
router.delete('/:id', serviceController.remove)

export default router
