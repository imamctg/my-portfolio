// services/payment.service.ts

import SSLCommerzPayment from 'sslcommerz-lts'
import dotenv from 'dotenv'

dotenv.config()

const CLIENT_URL = process.env.CLIENT_URL
const SERVER_URL = process.env.SERVER_URL
const store_id = process.env.SSLCOMMERZ_STORE_ID as string
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWD as string
const is_live = process.env.SSLCOMMERZ_IS_LIVE === 'true'

interface PaymentPayload {
  amount: number
  courseTitle: string
  userEmail: string
  userId: string
  courseId: string
  transactionId: string
  orderId: string
}

export const initiateSSLCommerzPayment = async (payload: PaymentPayload) => {
  const {
    amount,
    courseTitle,
    userEmail,
    userId,
    courseId,
    transactionId,
    orderId,
  } = payload
  console.log(
    'payment-service',
    amount,
    courseTitle,
    userEmail,
    userId,
    courseId,
    transactionId
  )
  const data = {
    total_amount: amount,
    currency: 'BDT',
    tran_id: transactionId,
    success_url: `${SERVER_URL}/api/payment/payment-success?tran_id=${transactionId}&userId=${userId}&courseId=${courseId}&orderId=${orderId}`,

    fail_url: `${CLIENT_URL}/payment/fail`,
    cancel_url: `${CLIENT_URL}/payment/cancel`,
    ipn_url: `${SERVER_URL}/ipn`,
    shipping_method: 'NO',
    product_name: courseTitle,
    product_category: 'Education',
    product_profile: 'general',
    cus_name: 'Student',
    cus_email: userEmail,
    cus_add1: 'Dhaka',
    cus_city: 'Dhaka',
    cus_country: 'Bangladesh',
    cus_phone: '01700000000',
  }

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
  const response = await sslcz.init(data)

  return response
}
