'use client'

import { useState, useEffect } from 'react'
import { Input } from 'components/ui/input'
import { Textarea } from 'components/ui/textarea'
import { Button } from 'components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface Category {
  _id: string
  name: string
}

export default function NewBlogPage() {
  const router = useRouter()
  const t = useTranslations('blog')
  const token = useSelector((state: RootState) => state.auth.token)

  // Form states
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [draft, setDraft] = useState(true)
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${baseURL}/blogs/categories/all`)
        console.log(res.data, 'new blog page categories')
        setCategories(res.data)
        if (res.data.length > 0) setCategory(res.data[0]._id)
      } catch (err) {
        console.error(err)
        toast.error(t('fetchCategoriesError'))
      }
    }
    fetchCategories()
  }, [])

  // Handle tags input
  const handleTagAdd = () => {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
      setTagInput('')
    }
  }

  const handleTagRemove = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  // Handle image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  // Submit
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !category) {
      toast.error(t('fillAllFields'))
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('title', title.trim())
      formData.append('content', content.trim())
      formData.append('category', category)
      formData.append('draft', JSON.stringify(draft))
      formData.append('tags', JSON.stringify(tags))
      formData.append('seoTitle', seoTitle)
      formData.append('seoDescription', seoDescription)

      if (image) formData.append('image', image)

      await axios.post(`${baseURL}/blogs`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success(t('blogCreated'))
      router.push('/dashboard/admin/blog')
    } catch (error: any) {
      console.error(error)
      if (error.response?.status === 401) toast.error(t('unauthorized'))
      else if (error.response?.status === 403) toast.error(t('forbidden'))
      else toast.error(t('createError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex justify-center items-start'>
      <Card className='w-full max-w-5xl shadow-xl rounded-lg border border-gray-200 dark:border-gray-700'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-gray-900 dark:text-white'>
            {t('addNewBlog')}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Title */}
          <Input
            placeholder={t('title')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='bg-white dark:bg-gray-800'
          />

          {/* Content */}
          <Textarea
            placeholder={t('content')}
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className='bg-white dark:bg-gray-800'
          />

          {/* Category */}
          <div>
            <label className='block mb-1 font-medium text-gray-700 dark:text-gray-300'>
              {t('category')}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className='w-full p-2 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700'
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className='block mb-1 font-medium text-gray-700 dark:text-gray-300'>
              {t('tags')}
            </label>
            <div className='flex gap-2 flex-wrap'>
              {tags.map((tag) => (
                <span
                  key={tag}
                  className='px-2 py-1 bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-white rounded-full cursor-pointer'
                  onClick={() => handleTagRemove(tag)}
                  title={t('clickToRemove')}
                >
                  {tag} &times;
                </span>
              ))}
            </div>
            <div className='flex gap-2 mt-2'>
              <Input
                placeholder={t('addTag')}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleTagAdd()
                  }
                }}
                className='flex-1 bg-white dark:bg-gray-800'
              />
              <Button onClick={handleTagAdd}>{t('add')}</Button>
            </div>
          </div>

          {/* Draft / Publish */}
          <div className='flex items-center gap-4'>
            <label className='text-gray-700 dark:text-gray-300 font-medium'>
              {t('status')}:
            </label>
            <select
              value={draft ? 'draft' : 'publish'}
              onChange={(e) => setDraft(e.target.value === 'draft')}
              className='p-2 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700'
            >
              <option value='draft'>{t('draft')}</option>
              <option value='publish'>{t('publish')}</option>
            </select>
          </div>

          {/* SEO Fields */}
          <div className='space-y-2'>
            <Input
              placeholder={t('seoTitle')}
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className='bg-white dark:bg-gray-800'
            />
            <Textarea
              placeholder={t('seoDescription')}
              rows={3}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              className='bg-white dark:bg-gray-800'
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className='block mb-1 font-medium text-gray-700 dark:text-gray-300'>
              {t('image')}
            </label>
            <input
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              className='block w-full text-gray-700 dark:text-gray-200'
            />
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt='Preview'
                className='mt-2 max-h-48 rounded-lg shadow-sm object-cover'
              />
            )}
          </div>

          {/* Submit */}
          <Button
            className='w-full mt-4 text-lg font-semibold'
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? t('creating') + '...' : t('createBlog')}
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
