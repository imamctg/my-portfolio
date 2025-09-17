// i18n/request.ts

// import { getRequestConfig } from 'next-intl/server'

// export default getRequestConfig(async ({ locale }) => {
//   return {
//     messages: (await import(`../messages/${locale}.json`)).default,
//     locale,
//   }
// })

// client/i18n/request.ts
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => {
  try {
    const messages = (await import(`../messages/${locale}.json`)).default

    return {
      messages,
      locale,
    }
  } catch (error) {
    console.error(`❌ Failed to load locale "${locale}"`, error)
    return {
      messages: {},
      locale,
    }
  }
})
