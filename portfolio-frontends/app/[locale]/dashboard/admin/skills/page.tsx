'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { Button } from 'components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { Pencil, Trash } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface Skill {
  _id: string
  name: string
  level: string
}

export default function AdminSkillsPage() {
  const token = useSelector((state: RootState) => state.auth.token)
  const t = useTranslations('skills')
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get(`${baseURL}/skills`)
        setSkills(res.data)
      } catch {
        toast.error(t('fetchError'))
      } finally {
        setLoading(false)
      }
    }
    fetchSkills()
  }, [t])

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${baseURL}/skills/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSkills((prev) => prev.filter((s) => s._id !== id))
      toast.success(t('deleteSuccess'))
    } catch {
      toast.error(t('deleteError'))
    }
  }

  if (loading)
    return (
      <div className='animate-pulse space-y-4 max-w-2xl mx-auto'>
        <div className='h-6 bg-gray-300 dark:bg-gray-700 rounded' />
        <div className='h-6 bg-gray-300 dark:bg-gray-700 rounded' />
      </div>
    )

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className='max-w-4xl mx-auto px-4 py-8'
    >
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>{t('manageSkills')}</h1>
        <Link href='./skills/create'>
          <Button>{t('addSkill')}</Button>
        </Link>
      </div>

      <Card className='shadow-lg dark:bg-gray-900'>
        <CardHeader>
          <CardTitle>{t('skillsList')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
            {skills.map((skill) => (
              <li
                key={skill._id}
                className='flex justify-between items-center py-3'
              >
                <div>
                  <p className='font-medium'>{skill.name}</p>
                  <p className='text-sm text-gray-500'>{skill.level}</p>
                </div>
                <div className='flex gap-2'>
                  <Link href={`./skills/${skill._id}/edit`}>
                    <Button size='sm' variant='outline'>
                      <Pencil className='w-4 h-4' />
                    </Button>
                  </Link>
                  <Button
                    size='sm'
                    variant='destructive'
                    onClick={() => handleDelete(skill._id)}
                  >
                    <Trash className='w-4 h-4' />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  )
}
