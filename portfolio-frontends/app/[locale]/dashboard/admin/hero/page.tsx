// // app/[locale]/dashboard/admin/hero/page.tsx
// 'use client'

// import { useEffect, useState } from 'react'
// import axios from 'axios'
// import { useTranslations } from 'next-intl'
// import Link from 'next/link'
// import { Button } from 'components/ui/button'
// import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
// import { toast } from 'react-hot-toast'
// import { useSelector } from 'react-redux'
// import { RootState } from 'features/redux/store'

// const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

// export default function AdminHeroPage() {
//   const t = useTranslations('dashboard.hero')
//   const [heroList, setHeroList] = useState<any[]>([])
//   const token = useSelector((s: RootState) => s.auth.token)

//   const fetch = async () => {
//     try {
//       const res = await axios.get(`${baseURL}/hero/all`)
//       setHeroList(res.data)
//     } catch (err) {
//       console.error(err)
//       toast.error(t('fetchError'))
//     }
//   }

//   useEffect(() => {
//     fetch()
//   }, [])

//   const handleDelete = async (id: string) => {
//     if (!confirm(t('confirmDelete'))) return
//     try {
//       await axios.delete(`${baseURL}/hero/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       setHeroList((p) => p.filter((h) => h._id !== id))
//       toast.success(t('deleted'))
//     } catch (err) {
//       console.error(err)
//       toast.error(t('deleteError'))
//     }
//   }

//   return (
//     <main className='p-6'>
//       <div className='flex items-center justify-between mb-6'>
//         <h1 className='text-2xl font-bold'>{t('title')}</h1>
//         <Link href='/dashboard/admin/hero/create'>
//           <Button>{t('create')}</Button>
//         </Link>
//       </div>

//       <div className='grid gap-4'>
//         {heroList.map((h) => (
//           <Card key={h._id}>
//             <CardHeader>
//               <CardTitle>{h.title}</CardTitle>
//               <CardTitle>{h.role}</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className='text-sm text-muted'>{h.description}</p>
//               <div className='mt-3 flex gap-2'>
//                 <Link href={`/dashboard/admin/hero/${h._id}/edit`}>
//                   <Button variant='outline'>{t('edit')}</Button>
//                 </Link>
//                 <Button
//                   variant='destructive'
//                   onClick={() => handleDelete(h._id)}
//                 >
//                   {t('delete')}
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </main>
//   )
// }

'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Input } from 'components/ui/input'
import { Textarea } from 'components/ui/textarea'
import { Button } from 'components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import { toast } from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface Hero {
  title: string
  role: string
  description: string
  locale: string
}

export default function AdminHeroPage() {
  const token = useSelector((s: RootState) => s.auth.token)
  const t = useTranslations('dashboard.hero')
  const router = useRouter()
  const [hero, setHero] = useState<Partial<Hero> | null>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const params = useParams()
  const locale = params.locale || 'en'

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await axios.get(`${baseURL}/hero?locale=${locale}`)
        setHero(res.data)
      } catch {
        setHero(null)
      } finally {
        setLoading(false)
      }
    }
    fetchHero()
  }, [locale])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hero?.title && !hero?.role && !hero?.description) {
      toast.error(t('fillFields'))
      return
    }
    try {
      setSaving(true)
      await axios.post(
        `${baseURL}/hero`,
        { ...hero, locale },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success(t('saveSuccess'))
    } catch {
      toast.error(t('saveError'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(t('confirmDelete'))) return
    try {
      await axios.delete(`${baseURL}/hero?locale=${locale}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setHero(null)
      toast.success(t('deleted'))
    } catch {
      toast.error(t('deleteError'))
    }
  }

  if (loading)
    return (
      <div className='animate-pulse max-w-3xl mx-auto px-4 py-8'>
        <div className='h-6 bg-gray-300 dark:bg-gray-700 rounded mb-4' />
        <div className='h-10 bg-gray-300 dark:bg-gray-700 rounded mb-4' />
        <div className='h-24 bg-gray-300 dark:bg-gray-700 rounded' />
      </div>
    )

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className='max-w-3xl mx-auto px-4 py-8'
    >
      <Card className='shadow-lg dark:bg-gray-900'>
        <CardHeader>
          <CardTitle className='text-xl font-semibold'>
            {hero ? t('editHero') : t('createHero')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <Input
              placeholder={t('title')}
              value={hero?.title || ''}
              onChange={(e) =>
                setHero((prev) => ({ ...(prev || {}), title: e.target.value }))
              }
              required
            />
            <Input
              placeholder={t('role')}
              value={hero?.role || ''}
              onChange={(e) =>
                setHero((prev) => ({ ...(prev || {}), role: e.target.value }))
              }
              required
            />
            <Textarea
              placeholder={t('description')}
              value={hero?.description || ''}
              onChange={(e) =>
                setHero((prev) => ({
                  ...(prev || {}),
                  description: e.target.value,
                }))
              }
              required
            />
            <div className='flex gap-2'>
              <Button type='submit' disabled={saving}>
                {saving ? t('saving') : t(hero ? 'update' : 'create')}
              </Button>
              {hero && (
                <Button
                  type='button'
                  variant='destructive'
                  onClick={handleDelete}
                >
                  {t('delete')}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
