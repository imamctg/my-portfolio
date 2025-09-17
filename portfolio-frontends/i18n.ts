export const locales = ['en', 'bn'] as const
export const defaultLocale = 'en'

export type Locale = (typeof locales)[number]
