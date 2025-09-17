// ✅ 9. LanguageSwitcher component
// 📁 client/components/common/LanguageSwitcher.tsx

'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const switchTo = locale === 'en' ? 'bn' : 'en'

  const handleSwitch = () => {
    const pathWithoutLocale = pathname.replace(/^\/(en|bn)/, '')
    router.push(`/${switchTo}${pathWithoutLocale}`)
  }

  return (
    <button onClick={handleSwitch} className='border px-3 py-1 rounded'>
      {switchTo === 'en' ? 'English' : 'বাংলা'}
    </button>
  )
}
