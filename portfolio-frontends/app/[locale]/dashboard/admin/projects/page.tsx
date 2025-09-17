'use client'

import { use, useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from 'components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import { toast } from 'react-hot-toast'
import { Edit, Trash, PlusCircle } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface Project {
  _id: string
  title: string
  description: string
  thumbnail?: string
  createdAt: string
}

export default function AdminProjectsPage() {
  const token = useSelector((state: RootState) => state.auth.token)
  const t = useTranslations('projects')
  const [projects, setProjects] = useState<Project[]>([])

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${baseURL}/projects`)
      console.log(res.data, 'res.data')
      setProjects(res.data)
    } catch (error) {
      console.error(error)
      toast.error(t('fetchError'))
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return
    try {
      await axios.delete(`${baseURL}/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setProjects(projects.filter((p) => p._id !== id))
      toast.success(t('deleted'))
    } catch (error) {
      console.error(error)
      toast.error(t('deleteError'))
    }
  }

  return (
    <main className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>{t('title')}</h1>
        <Link href='/dashboard/admin/projects/create'>
          <Button>
            <PlusCircle className='w-4 h-4 mr-2' /> {t('create')}
          </Button>
        </Link>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {projects.map((project) => (
          <Card key={project._id} className='shadow-md rounded-2xl'>
            <img
              src={project.thumbnail || 'https://via.placeholder.com/400x250'}
              alt={project.title}
              className='w-full h-48 object-cover rounded-t-2xl'
            />
            <CardHeader>
              <CardTitle className='line-clamp-1'>{project.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-gray-600 line-clamp-2'>
                {project.description}
              </p>
              <div className='flex justify-between mt-4'>
                <Link href={`/dashboard/admin/projects/${project._id}/edit`}>
                  <Button size='sm' variant='outline'>
                    <Edit className='w-4 h-4 mr-1' /> {t('edit')}
                  </Button>
                </Link>
                <Button
                  size='sm'
                  variant='destructive'
                  onClick={() => handleDelete(project._id)}
                >
                  <Trash className='w-4 h-4 mr-1' /> {t('delete')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
