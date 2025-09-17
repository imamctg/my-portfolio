'use client'

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'
import { Textarea } from 'components/ui/textarea'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'
import { setTech } from 'video.js/dist/types/tech/middleware'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function CreateProjectPage() {
  const t = useTranslations('projects')
  const router = useRouter()
  const token = useSelector((state: RootState) => state.auth.token)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [technology, setTechnology] = useState('')
  const [link, setLink] = useState('')
  const [featured, setFeatured] = useState(false)
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('category', category)
      formData.append('technology', technology)
      formData.append('link', link)
      formData.append('featured', String(featured))
      if (thumbnail) formData.append('thumbnail', thumbnail)

      await axios.post(`${baseURL}/projects`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success(t('created'))
      router.push('/dashboard/admin/projects')
    } catch (error) {
      console.error(error)
      toast.error(t('createError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='p-6 max-w-2xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>{t('create')}</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Input
          placeholder={t('titlePlaceholder')}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Textarea
          placeholder={t('descriptionPlaceholder')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Input
          placeholder={t('categoryPlaceholder')}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <Input
          placeholder={t('technologyPlaceholder')}
          value={technology}
          onChange={(e) => setTechnology(e.target.value)}
          required
        />
        <Input
          placeholder={t('linkPlaceholder')}
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            id='featured'
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          <label htmlFor='featured' className='text-sm text-gray-700'>
            {t('featured')}
          </label>
        </div>
        <Input
          type='file'
          accept='image/*'
          onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
        />
        <Button type='submit' disabled={loading} className='w-full'>
          {loading ? t('saving') : t('create')}
        </Button>
      </form>
    </main>
  )
}
