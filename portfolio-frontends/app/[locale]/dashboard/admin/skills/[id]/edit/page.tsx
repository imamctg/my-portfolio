'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Input } from 'components/ui/input'
import { Button } from 'components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { useRouter, useParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface Skill {
  _id: string
  name: string
  level: string
}

export default function EditSkillPage() {
  const t = useTranslations('skills')
  const token = useSelector((state: RootState) => state.auth.token)
  const router = useRouter()
  const { id } = useParams()
  const [skill, setSkill] = useState<Skill | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const res = await axios.get(`${baseURL}/skills/${id}`)
        setSkill(res.data)
      } catch {
        toast.error(t('fetchError'))
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchSkill()
  }, [id, t])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!skill) return
    try {
      setSaving(true)
      await axios.put(
        `${baseURL}/skills/${id}`,
        { name: skill.name, level: skill.level },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      toast.success(t('updateSuccess'))
      router.push('../../')
    } catch {
      toast.error(t('updateError'))
    } finally {
      setSaving(false)
    }
  }

  if (loading)
    return (
      <div className='animate-pulse max-w-2xl mx-auto'>
        <div className='h-10 bg-gray-300 dark:bg-gray-700 rounded' />
      </div>
    )

  if (!skill) return <p className='text-center'>{t('notFound')}</p>

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className='max-w-2xl mx-auto px-4 py-8'
    >
      <Card>
        <CardHeader>
          <CardTitle>{t('editSkill')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className='space-y-4'>
            <Input
              value={skill.name}
              onChange={(e) => setSkill({ ...skill, name: e.target.value })}
              required
            />
            <Input
              value={skill.level}
              onChange={(e) => setSkill({ ...skill, level: e.target.value })}
              required
            />
            <Button type='submit' disabled={saving}>
              {saving ? t('saving') : t('update')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
