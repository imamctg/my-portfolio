import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../user/user.model'
import { uploadToCloudinary } from '../../utils/cloudinaryUpload'
import fs from 'fs'
import { verifyCaptcha } from '../../utils/verifyCaptcha'
import * as crypto from 'crypto'
import nodemailer from 'nodemailer'
import { ReferralTracking } from '../referral/referral-tracking.model'
import { ReferralService } from '../referral/referral.service'
import mongoose, { Types } from 'mongoose'

export const handleRegister = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      role,
      bio,
      website,
      experience,
      token,
    } = req.body
    console.log(req.body, req.file, 'auth.service')
    // ✅ reCAPTCHA verification
    const isHuman = await verifyCaptcha(token)
    if (!isHuman) {
      res.status(400).json({ message: 'CAPTCHA verification failed' })
      return
    }

    if (password !== confirmPassword) {
      res.status(400).json({ message: 'Passwords do not match.' })
      return
    }

    const userExist = await User.findOne({ email })
    if (userExist) {
      res.status(400).json({ message: 'User already exists' })
      return
    }

    let nidFileUrl = ''

    if (role === 'instructor') {
      if (!req.file) {
        res
          .status(400)
          .json({ message: 'NID file is required for instructors' })
        return
      }

      const fileBuffer = req.file.buffer
      const folder = 'instructors/nid'
      const filename = `${Date.now()}-${req.file.originalname}`

      const nidUpload = await uploadToCloudinary(
        fileBuffer,
        'instructors/nid',
        `nid_${Date.now()}`,
        'image'
      )
      nidFileUrl = nidUpload.secure_url // ✅ correct
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      bio: role === 'instructor' ? bio : undefined,
      website: role === 'instructor' ? website : undefined,
      experience: role === 'instructor' ? experience : undefined,
      nidFileUrl: role === 'instructor' ? nidFileUrl : undefined,
      status: role === 'instructor' ? 'pending' : 'approved',
      referrerId: mongoose.Types.ObjectId.isValid(req.body.referrerId)
        ? req.body.referrerId
        : undefined,
    })

    // ✅ Track referral after user creation
    if (mongoose.Types.ObjectId.isValid(req.body.referrerId)) {
      await ReferralService.trackSignup(
        mongoose.Types.ObjectId.createFromHexString(req.body.referrerId),
        user._id
      )
    }

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    })
  } catch (error: any) {
    console.error('❌ Registration error:', error)
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message || error })
  }
}

export const handleLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body
  const { userId } = req.params
  console.log(userId)
  console.log('login', email, password)

  try {
    const user = await User.findOne({ email })
    console.log(user)

    if (!user) {
      res
        .status(400)
        .json({ success: false, message: 'Invalid email or password ' })
      return
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
      res
        .status(400)
        .json({ success: false, message: 'Invalid email or password' })
      return
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    })

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        token,
        role: user.role,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Something went wrong!' })
  }
}

export const handleGetProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById((req as any).user.id).select('-password')
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error })
  }
}

// FORGOT PASSWORD
export const handleForgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body
  try {
    const user = await User.findOne({ email })

    if (!user) {
      res.status(404).json({ message: 'User not found with this email' })
      return
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expireTime = Date.now() + 1000 * 60 * 60 // 1 hour

    user.resetPasswordToken = token
    user.resetPasswordExpires = new Date(expireTime)

    await user.save()

    const resetLink = `${process.env.CLIENT_URL}/auth/reset-password/${token}`
    const transporter = nodemailer.createTransport({
      service: 'gmail', // অথবা আপনার SMTP Provider
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    const mailOptions = {
      from: `"Advanced Learning" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset it:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 1 hour.</p>
      `,
    }

    await transporter.sendMail(mailOptions)

    res.status(200).json({
      success: true,
      message: 'Password reset email sent',
    })
  } catch (err: any) {
    console.error('❌ Forgot password error:', err)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

// RESET PASSWORD
export const handleResetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { token } = req.params
  const { password } = req.body

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    })

    if (!user) {
      res.status(400).json({ message: 'Invalid or expired token' })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    user.password = hashedPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    await user.save()

    res
      .status(200)
      .json({ success: true, message: 'Password updated successfully' })
  } catch (err: any) {
    console.error('❌ Reset password error:', err)
    res.status(500).json({ message: 'Something went wrong' })
  }
}
