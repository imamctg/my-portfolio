// import axios from 'axios'

// export const verifyCaptcha = async (token: string): Promise<boolean> => {
//   try {
//     const secretKey = process.env.RECAPTCHA_SECRET_KEY
//     const response = await axios.post(
//       `https://www.google.com/recaptcha/api/siteverify`,
//       null,
//       {
//         params: {
//           secret: secretKey,
//           response: token,
//         },
//       }
//     )

//     return response.data.success === true && response.data.score !== 0
//   } catch (error) {
//     console.error('CAPTCHA verification failed:', error)
//     return false
//   }
// }

// src/utils/verifyCaptcha.ts
import axios from 'axios'

export const verifyCaptcha = async (token: string): Promise<boolean> => {
  try {
    const secret = process.env.RECAPTCHA_SECRET_KEY as string
    console.log(secret, 'secret')
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      new URLSearchParams({
        secret,
        response: token,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )
    console.log('🧪 Google reCAPTCHA response:', response.data)
    return response.data.success
  } catch (error) {
    console.error('Captcha verification error:', error)
    return false
  }
}
