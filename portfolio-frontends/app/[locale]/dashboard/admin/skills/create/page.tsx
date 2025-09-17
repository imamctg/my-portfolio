'use client'

import { use, useState } from 'react'
import axios from 'axios'
import { Input } from 'components/ui/input'
import { Button } from 'components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function CreateSkillPage() {
  const token = useSelector((state: RootState) => state.auth.token)
  const t = useTranslations('skills')
  const router = useRouter()
  const [name, setName] = useState('')
  const [level, setLevel] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      await axios.post(
        `${baseURL}/skills`,
        { name, level },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      toast.success(t('createSuccess'))
      router.push('../')
    } catch {
      toast.error(t('createError'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className='max-w-2xl mx-auto px-4 py-8'
    >
      <Card>
        <CardHeader>
          <CardTitle>{t('addSkill')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <Input
              placeholder={t('name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              placeholder={t('level')}
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              required
            />
            <Button type='submit' disabled={saving}>
              {saving ? t('saving') : t('create')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
