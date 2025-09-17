import express from 'express'
import { getCertificate } from './certificate.controller'

const router = express.Router()

router.get('/:userId/:courseId', getCertificate)

export default router
