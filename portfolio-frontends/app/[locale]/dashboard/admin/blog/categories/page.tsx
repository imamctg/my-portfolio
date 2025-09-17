'use client'

import { useEffect, useState } from 'react'
import { Input } from 'components/ui/input'
import { Button } from 'components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface Category {
  _id: string
  name: string
}

export default function BlogCategoriesPage() {
  const t = useTranslations('blog')
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState('')
  const [loading, setLoading] = useState(false)

  // Redux থেকে token আনছি
  const token = useSelector((state: RootState) => state.auth.token)

  console.log(token, 'catetory page token')
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${baseURL}/blogs/categories/all`)
      setCategories(res.data.categories || res.data)
    } catch (error) {
      console.error(error)
      toast.error(t('fetchError'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const addCategory = async () => {
    if (!newCategory.trim()) {
      toast.error(t('fillCategoryName'))
      return
    }
    try {
      setLoading(true)
      const res = await axios.post(
        `${baseURL}/blogs/categories`,
        { name: newCategory.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setCategories([...categories, res.data])
      setNewCategory('')
      toast.success(t('categoryAdded'))
    } catch (error: any) {
      console.error(error)
      if (error.response?.status === 401) {
        toast.error(t('unauthorized'))
      } else if (error.response?.status === 403) {
        toast.error(t('forbidden'))
      } else {
        toast.error(t('addError'))
      }
    } finally {
      setLoading(false)
    }
  }

  const deleteCategory = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return
    try {
      setLoading(true)
      await axios.delete(`${baseURL}/blogs/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setCategories(categories.filter((cat) => cat._id !== id))
      toast.success(t('categoryDeleted'))
    } catch (error: any) {
      console.error(error)
      if (error.response?.status === 401) {
        toast.error(t('unauthorized'))
      } else if (error.response?.status === 403) {
        toast.error(t('forbidden'))
      } else {
        toast.error(t('deleteError'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='p-6 bg-gray-50 dark:bg-gray-900 min-h-screen'>
      <Card className='max-w-xl mx-auto shadow-lg'>
        <CardHeader>
          <CardTitle className='text-xl md:text-2xl font-bold'>
            {t('manageCategories')}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex gap-2'>
            <Input
              placeholder={t('categoryName')}
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className='bg-white dark:bg-gray-800'
              disabled={loading}
            />
            <Button onClick={addCategory} disabled={loading}>
              {t('add')}
            </Button>
          </div>

          {categories.length === 0 ? (
            <p className='text-gray-500 dark:text-gray-400'>
              {t('noCategories')}
            </p>
          ) : (
            <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
              {categories.map((cat) => (
                <li
                  key={cat._id}
                  className='flex items-center justify-between py-2'
                >
                  <span className='text-gray-800 dark:text-gray-100'>
                    {cat.name}
                  </span>
                  <Button
                    size='sm'
                    variant='destructive'
                    onClick={() => deleteCategory(cat._id)}
                    disabled={loading}
                  >
                    <Trash className='w-4 h-4' />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
