// import { NextRequest } from 'next/server'
// import createMiddleware from 'next-intl/middleware'
// import nextIntlConfig from './next-intl.config'

// const intlMiddleware = createMiddleware({
//   locales: nextIntlConfig.locales,
//   defaultLocale: nextIntlConfig.defaultLocale,
//   localePrefix: 'always',
// })

// export default function middleware(request: NextRequest) {
//   return intlMiddleware(request)
// }

// export const config = {
//   matcher: ['/', '/(en|bn)/:path*', '/((?!_next|_vercel|.*\\..*).*)'],
// }

// middleware.ts
// middleware.ts
import { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import nextIntlConfig from './next-intl.config'

const intlMiddleware = createMiddleware({
  locales: nextIntlConfig.locales,
  defaultLocale: nextIntlConfig.defaultLocale,
  localePrefix: 'always',
})

export function middleware(request: NextRequest) {
  return intlMiddleware(request)
}

export const config = {
  matcher: ['/', '/(en|bn)/:path*', '/((?!_next|_vercel|.*\\..*).*)'],
}
