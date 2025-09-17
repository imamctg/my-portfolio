// server/src/utils/validation.ts
import { Types } from 'mongoose'

/**
 * Validate MongoDB ObjectId
 * @param id - The ID to validate
 * @returns boolean - True if valid, false otherwise
 */
export const validateObjectId = (id: string): boolean => {
  return Types.ObjectId.isValid(id) && new Types.ObjectId(id).toString() === id
}

/**
 * Validate email format
 * @param email - Email to validate
 * @returns boolean - True if valid, false otherwise
 */
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// অন্যান্য validation utilities যোগ করতে পারেন
