// // app/[locale]/layout.tsx
// import { NextIntlClientProvider } from 'next-intl'
// import { notFound } from 'next/navigation'
// import { setRequestLocale } from 'next-intl/server'

// import { ReactNode } from 'react'
// import { Providers } from 'features/redux/provider'
// import { ReactQueryProvider } from 'components/providers/ReactQueryProvider'
// import ClientLayout from 'app/ClientLayout'

// import enMessages from 'messages/en/index'
// import bnMessages from 'messages/bn/index'

// export const dynamic = 'force-dynamic'

// export async function generateStaticParams() {
//   return [{ locale: 'en' }, { locale: 'bn' }]
// }

// const locales = ['en', 'bn']

// type Props = {
//   children: ReactNode
//   params: { locale: string }
// }

// export default async function LocaleLayout(props: Props) {
//   const { children } = props
//   const { locale } = await Promise.resolve(props.params) // ✅ সঠিকভাবে `await` ব্যবহার করা হলো

//   if (!locales.includes(locale)) {
//     notFound()
//   }

//   setRequestLocale(locale)

//   const messages = {
//     en: enMessages,
//     bn: bnMessages,
//   }[locale]

//   return (
//     <NextIntlClientProvider locale={locale} messages={messages}>
//       <Providers>
//         <ReactQueryProvider>
//           <ClientLayout>{children}</ClientLayout>
//         </ReactQueryProvider>
//       </Providers>
//     </NextIntlClientProvider>
//   )
// }

// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { ReactNode } from 'react'
import { Providers } from 'features/redux/provider'
import { ReactQueryProvider } from 'components/providers/ReactQueryProvider'
import ClientLayout from 'app/ClientLayout'

import enMessages from 'messages/en/index'
import bnMessages from 'messages/bn/index'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'bn' }]
}

const locales = ['en', 'bn']

type Props = {
  children: ReactNode
  params: { locale: string }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = params

  if (!locales.includes(locale)) {
    notFound()
  }

  // ✅ Updated (deprecated `unstable_setRequestLocale` এর পরিবর্তে)
  setRequestLocale(locale)

  const messages = locale === 'en' ? enMessages : bnMessages

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Providers>
        <ReactQueryProvider>
          <ClientLayout>{children}</ClientLayout>
        </ReactQueryProvider>
      </Providers>
    </NextIntlClientProvider>
  )
}
