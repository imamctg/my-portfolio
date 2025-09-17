'use client'

import { useState } from 'react'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'
import { Textarea } from 'components/ui/textarea'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function CreateTestimonialPage() {
  const token = useSelector((state: RootState) => state.auth.token)
  const t = useTranslations('testimonials')
  const router = useRouter()

  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !comment) {
      toast.error(t('required'))
      return
    }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('comment', comment)
      if (profileImage) formData.append('profileImage', profileImage)

      await axios.post(`${baseURL}/testimonials`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success(t('created'))
      router.push('../testimonials')
    } catch (error) {
      console.error(error)
      toast.error(t('createError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='p-6 max-w-xl mx-auto'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold'>{t('createTitle')}</h1>
        <Link href='../testimonials'>
          <Button variant='outline'>
            <ArrowLeft className='w-4 h-4 mr-1' /> {t('back')}
          </Button>
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className='space-y-4 bg-white p-6 rounded-2xl shadow'
      >
        <Input
          placeholder={t('namePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Textarea
          placeholder={t('commentPlaceholder')}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <Input
          type='file'
          accept='image/*'
          onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
        />
        <Button type='submit' disabled={loading}>
          <Save className='w-4 h-4 mr-1' />
          {loading ? t('creating') : t('save')}
        </Button>
      </form>
    </main>
  )
}
