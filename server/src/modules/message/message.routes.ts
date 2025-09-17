import express from 'express'
import * as MessageController from './message.controller'
import authMiddleware from '../../middlewares/authMiddleware'
import { rateLimiter } from '../../middlewares/rateLimiter.middleware'

const router = express.Router()

router.use(authMiddleware)

router.get('/available-users/:id', MessageController.getAvailableUsers)
router.get('/conversation/:receiverId', MessageController.getMessages)
router.post('/', rateLimiter, MessageController.sendMessage)
// router.delete('/', MessageController.deleteMessages)

router.delete('/single/:messageId', MessageController.deleteSingleMessage)
router.delete('/all/:userId', MessageController.deleteAllMessagesWithUser)
router.put('/mark-seen/:receiverId', MessageController.markMessagesAsSeen)

export default router
