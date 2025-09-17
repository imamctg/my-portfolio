// src/modules/payment/bkash.service.ts

import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()
const SERVER_URL = process.env.SERVER_URL
const BKASH_BASE_URL = process.env.BKASH_BASE_URL
const BKASH_APP_KEY = process.env.BKASH_APP_KEY
const BKASH_APP_SECRET = process.env.BKASH_APP_SECRET
const BKASH_USERNAME = process.env.BKASH_USERNAME
const BKASH_PASSWORD = process.env.BKASH_PASSWORD

let token: string = ''

// ✅ Get Access Token from bKash
const getBkashToken = async () => {
  const res = await axios.post(
    `${BKASH_BASE_URL}/checkout/token/grant`,
    {
      app_key: BKASH_APP_KEY,
      app_secret: BKASH_APP_SECRET,
    },
    {
      auth: {
        username: BKASH_USERNAME!,
        password: BKASH_PASSWORD!,
      },
    }
  )

  token = res.data.id_token
  return token
}

interface BkashPayload {
  amount: number
  courseTitle: string
  userEmail: string
  userId: string
  courseId: string
  orderId: string
  transactionId: string
}

// ✅ Initiate bKash Payment
export const initiateBkash = async (payload: BkashPayload) => {
  const { amount, userId, courseId, orderId, transactionId } = payload

  if (!token) {
    await getBkashToken()
  }

  const res = await axios.post(
    `${BKASH_BASE_URL}/checkout/payment/create`,
    {
      amount: amount,
      currency: 'BDT',
      intent: 'sale',
      merchantInvoiceNumber: transactionId,
      callbackURL: `${SERVER_URL}/api/payment/bkash-success?tran_id=${transactionId}&userId=${userId}&courseId=${courseId}&orderId=${orderId}`,
    },
    {
      headers: {
        authorization: token,
        'x-app-key': BKASH_APP_KEY,
        'content-type': 'application/json',
      },
    }
  )

  return { bkashURL: res.data.bkashURL }
}
