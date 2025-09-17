import { Request, Response } from 'express'
import {
  handleLogin,
  handleRegister,
  handleGetProfile,
  handleForgotPassword,
  handleResetPassword,
} from './auth.service'

export const register = async (req: Request, res: Response): Promise<void> => {
  console.log(req.body, req.file, 'auth.controller')
  await handleRegister(req, res)
}

export const login = async (req: Request, res: Response): Promise<void> => {
  await handleLogin(req, res)
}

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  await handleGetProfile(req, res)
}

export const forgotPassword = async (req: Request, res: Response) => {
  await handleForgotPassword(req, res)
}

export const resetPassword = async (req: Request, res: Response) => {
  await handleResetPassword(req, res)
}
