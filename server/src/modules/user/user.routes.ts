// src/modules/user/user.routes.ts
import express from 'express'
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  updateUserInfo,
  getUserCourses,
  updateInstructorStatus,
} from './user.controller'
import authMiddleware from '../../middlewares/authMiddleware'
import { requireRole } from '../../middlewares/roleMiddleware'
import upload from '../../middlewares/upload'
import validateRequest from '../../middlewares/validateRequest'
import { updateUserValidation } from './user.validation'

const router = express.Router()

// GET /api/users → all users (admin only)
router.get('/', authMiddleware, requireRole(['admin']), getAllUsers)

// PATCH /api/users/:id/role → update user role (admin only)
router.patch(
  '/:id/role',
  authMiddleware,
  requireRole(['admin']),
  updateUserRole
)

// PUT /api/users/:id → update user profile
router.put(
  '/:id',
  authMiddleware,
  validateRequest(updateUserValidation),
  upload.single('profileImage'),
  updateUserInfo
)

// DELETE /api/users/:id → delete user (admin only or later based on logic)
router.delete('/:id', authMiddleware, requireRole(['admin']), deleteUser)

// GET /api/users/:id/courses → fetch all courses of user
router.get('/:id/courses', authMiddleware, getUserCourses)

// PUT /api/users/admin/instructor/:userId/status → update instructor status
router.put(
  '/admin/instructor/:userId/status',
  authMiddleware,
  requireRole(['admin']),
  updateInstructorStatus
)

export default router
