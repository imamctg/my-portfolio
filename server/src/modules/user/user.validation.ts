// src/validators/user.validation.ts

import { body } from 'express-validator'

export const updateUserValidation = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),

  body('email').optional().isEmail().withMessage('Valid email is required'),

  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[^a-zA-Z0-9]/)
    .withMessage('Password must contain at least one special character'),

  body('confirmPassword')
    .optional()
    .custom((value, { req }) => {
      if (req.body.password && value !== req.body.password) {
        throw new Error('Passwords do not match')
      }
      return true
    }),
]
