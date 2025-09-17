import { Request, Response } from 'express'
import {
  deleteMessageById,
  getMessagesPaginated,
  saveMessage,
} from './contact.service'

import axios from 'axios'

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY as string

export const submitContactForm = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    console.log(req.body, 'body')
    const { name, email, message, token } = req.body
    // const token = recaptchaToken

    const isSignedIn = !!req.user

    if (!message || (!isSignedIn && (!name || !email || !token))) {
      return res.status(400).json({
        success: false,
        message: 'All fields and CAPTCHA token are required',
      })
    }

    // ✅ reCAPTCHA validation (only for guests)
    if (!isSignedIn) {
      const verifyURL = `https://www.google.com/recaptcha/api/siteverify`
      const response = await axios.post(
        verifyURL,
        new URLSearchParams({
          secret: RECAPTCHA_SECRET_KEY,
          response: token,
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      )

      if (!response.data.success) {
        return res.status(403).json({
          success: false,
          message: 'reCAPTCHA verification failed. Please try again.',
        })
      }
    }

    // ✅ Ensure name/email for signed-in users
    const finalName = req.user?.name || name
    const finalEmail = req.user?.email || email

    // ✅ Save with userId if logged in
    const saved = await saveMessage({
      name: finalName,
      email: finalEmail,
      message,
      userId: req.user?._id,
    })

    return res.status(200).json({
      success: true,
      message: 'Your message has been received!',
      data: saved,
    })
  } catch (error) {
    console.error('❌ Contact form submission error:', error)
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    })
  }
}

export const getAllContactMessages = async (req: Request, res: Response) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query

    const { messages, total } = await getMessagesPaginated(
      String(search),
      Number(page),
      Number(limit)
    )

    res.status(200).json({
      success: true,
      data: messages,
      total,
      page: Number(page),
      limit: Number(limit),
    })
  } catch (error) {
    console.error('❌ Fetch contact messages error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
    })
  }
}

// DELETE /api/contact/:id
export const deleteContactMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await deleteMessageById(id)
    res.status(200).json({ success: true, message: 'Message deleted' })
  } catch (error) {
    console.error('❌ Delete contact message error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete message',
    })
  }
}
