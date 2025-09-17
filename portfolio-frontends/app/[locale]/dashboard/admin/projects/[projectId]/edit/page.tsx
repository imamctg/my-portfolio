'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'
import { Textarea } from 'components/ui/textarea'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function EditProjectPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const t = useTranslations('projects')
  const router = useRouter()
  const token = useSelector((state: RootState) => state.auth.token)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [link, setLink] = useState('')
  const [featured, setFeatured] = useState(false)
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`${baseURL}/projects/${projectId}`)
        setTitle(res.data.title || '')
        setDescription(res.data.description || '')
        setCategory(res.data.category || '')
        setLink(res.data.link || '')
        setFeatured(res.data.featured || false)
      } catch (error) {
        console.error(error)
        toast.error(t('fetchError'))
      }
    }
    if (projectId) fetchProject()
  }, [projectId, t])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('category', category)
      formData.append('link', link)
      formData.append('featured', String(featured))
      if (thumbnail) formData.append('thumbnail', thumbnail)

      await axios.put(`${baseURL}/projects/${projectId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success(t('updated'))
      router.push('/dashboard/admin/projects')
    } catch (error) {
      console.error(error)
      toast.error(t('updateError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='p-6 max-w-2xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>{t('edit')}</h1>
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
          {loading ? t('saving') : t('update')}
        </Button>
      </form>
    </main>
  )
}
