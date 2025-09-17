// src/validators/auth.validation.ts

import { body } from 'express-validator'

export const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[^a-zA-Z0-9]/)
    .withMessage('Password must contain at least one special character'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match')
    }
    return true
  }),
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['student', 'instructor', 'affiliate'])
    .withMessage('Role must be either student, instructor, or affiliate'),

  // Instructor-specific validation
  body('bio')
    .if(body('role').equals('instructor'))
    .notEmpty()
    .withMessage('Bio is required for instructors'),

  body('experience')
    .if(body('role').equals('instructor'))
    .notEmpty()
    .withMessage('Experience is required for instructors'),

  body('nidFile')
    .if(body('role').equals('instructor'))
    .custom((value, { req }) => {
      if (!req.file && (!req.files || !req.files.nidFile)) {
        throw new Error('NID file is required for instructor registration')
      }
      return true
    }),
]

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
]
