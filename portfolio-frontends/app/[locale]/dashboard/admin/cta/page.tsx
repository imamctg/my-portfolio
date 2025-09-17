'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Input } from 'components/ui/input'
import { Textarea } from 'components/ui/textarea'
import { Button } from 'components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import { toast } from 'react-hot-toast'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface Cta {
  title: string
  description?: string
  buttonText?: string
  buttonLink?: string
  locale: string
}

export default function AdminCtaPage() {
  const token = useSelector((s: RootState) => s.auth.token)
  const t = useTranslations('dashboard.cta')
  const params = useParams()
  const locale = (params.locale as string) || 'en'

  const [cta, setCta] = useState<Partial<Cta> | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchCta = async () => {
      try {
        const res = await axios.get(`${baseURL}/cta?locale=${locale}`)
        setCta(res.data || null)
      } catch {
        setCta(null)
      } finally {
        setLoading(false)
      }
    }
    fetchCta()
  }, [locale])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cta?.title || !cta?.description) {
      toast.error(t('fillFields'))
      return
    }
    try {
      setSaving(true)
      await axios.post(
        `${baseURL}/cta`,
        { ...cta, locale },
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
      await axios.delete(`${baseURL}/cta?locale=${locale}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCta(null)
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
            {cta ? t('editCta') : t('createCta')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <Input
              placeholder={t('title')}
              value={cta?.title || ''}
              onChange={(e) =>
                setCta((prev) => ({ ...(prev || {}), title: e.target.value }))
              }
              required
            />
            <Textarea
              placeholder={t('description')}
              value={cta?.description || ''}
              onChange={(e) =>
                setCta((prev) => ({
                  ...(prev || {}),
                  description: e.target.value,
                }))
              }
              required
            />
            <Input
              placeholder={t('buttonText')}
              value={cta?.buttonText || ''}
              onChange={(e) =>
                setCta((prev) => ({
                  ...(prev || {}),
                  buttonText: e.target.value,
                }))
              }
            />
            {/* <Input
              placeholder={t('buttonLink')}
              value={cta?.buttonLink || ''}
              onChange={(e) =>
                setCta((prev) => ({
                  ...(prev || {}),
                  buttonLink: e.target.value,
                }))
              }
            /> */}
            <div className='flex gap-2'>
              <Button type='submit' disabled={saving}>
                {saving ? t('saving') : t(cta ? 'update' : 'create')}
              </Button>
              {cta && (
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
