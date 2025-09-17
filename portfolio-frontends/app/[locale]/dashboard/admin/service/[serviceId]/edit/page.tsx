'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'
import { Textarea } from 'components/ui/textarea'
import { Label } from 'components/ui/label'
import { Switch } from 'components/ui/switch'
import { FiArrowLeft, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi'

// Icon mapping for selection
const iconOptions = [
  { value: 'FaLaptopCode', label: 'Laptop Code' },
  { value: 'FaServer', label: 'Server' },
  { value: 'FaProjectDiagram', label: 'Project Diagram' },
  { value: 'FaDatabase', label: 'Database' },
  { value: 'FaWordpress', label: 'WordPress' },
  { value: 'FaSearch', label: 'Search' },
  { value: 'FaLock', label: 'Lock' },
  { value: 'FaUsers', label: 'Users' },
  { value: 'FaGlobe', label: 'Globe' },
  { value: 'FaMobile', label: 'Mobile' },
]

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
export default function EditServicePage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    overview: '',
    icon: 'FaLaptopCode',
    published: false,
    technologies: [''],
    features: [''],
    deliverables: [''],
    process: [{ title: '', description: '', icon: 'FaTools', duration: '' }],
    faqs: [{ q: '', a: '' }],
  })

  useEffect(() => {
    if (params.serviceId) {
      fetchService()
    }
  }, [params.serviceId])

  const fetchService = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${baseURL}/services/${params.serviceId}`)
      if (response.ok) {
        const data = await response.json()
        setFormData(data)
      } else {
        setError('Failed to fetch service')
      }
    } catch (err) {
      setError('Failed to fetch service')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const response = await fetch(`${baseURL}/services/${params.serviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/dashboard/admin/service')
        router.refresh()
      } else {
        setError('Failed to update service')
      }
    } catch (err) {
      setError('Failed to update service')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleAddItem = (
    field: 'technologies' | 'features' | 'deliverables'
  ) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ''],
    })
  }

  const handleRemoveItem = (
    field: 'technologies' | 'features' | 'deliverables',
    index: number
  ) => {
    if (formData[field].length <= 1) return
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    })
  }

  const handleAddProcess = () => {
    setFormData({
      ...formData,
      process: [
        ...formData.process,
        { title: '', description: '', icon: 'FaTools', duration: '' },
      ],
    })
  }

  const handleRemoveProcess = (index: number) => {
    if (formData.process.length <= 1) return
    setFormData({
      ...formData,
      process: formData.process.filter((_, i) => i !== index),
    })
  }

  const handleAddFaq = () => {
    setFormData({
      ...formData,
      faqs: [...formData.faqs, { q: '', a: '' }],
    })
  }

  const handleRemoveFaq = (index: number) => {
    if (formData.faqs.length <= 1) return
    setFormData({
      ...formData,
      faqs: formData.faqs.filter((_, i) => i !== index),
    })
  }

  if (loading) {
    return (
      <div className='container mx-auto p-6'>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'></div>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto p-6'>
      <div className='mb-6'>
        <Link
          href='/dashboard/admin/service'
          className='inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        >
          <FiArrowLeft className='mr-2' />
          Back to Services
        </Link>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mt-2'>
          Edit Service
        </h1>
      </div>

      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6'>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2 space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='title'>Service Title *</Label>
                  <Input
                    id='title'
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='slug'>Slug *</Label>
                  <Input
                    id='slug'
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    required
                  />
                  <p className='text-sm text-gray-500'>
                    This will be used in the URL. Use lowercase letters,
                    numbers, and hyphens only.
                  </p>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='description'>Short Description *</Label>
                  <Textarea
                    id='description'
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='overview'>Detailed Overview</Label>
                  <Textarea
                    id='overview'
                    value={formData.overview}
                    onChange={(e) =>
                      setFormData({ ...formData, overview: e.target.value })
                    }
                    rows={5}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='icon'>Icon</Label>
                  <select
                    id='icon'
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    className='w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700'
                  >
                    {iconOptions.map((icon) => (
                      <option key={icon.value} value={icon.value}>
                        {icon.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='flex items-center space-x-2'>
                  <Switch
                    id='published'
                    checked={formData.published}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, published: checked })
                    }
                  />
                  <Label htmlFor='published'>Publish Service</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technologies</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {formData.technologies.map((tech, index) => (
                  <div key={index} className='flex gap-2'>
                    <Input
                      value={tech}
                      onChange={(e) => {
                        const newTech = [...formData.technologies]
                        newTech[index] = e.target.value
                        setFormData({ ...formData, technologies: newTech })
                      }}
                      placeholder='Technology name'
                    />
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => handleRemoveItem('technologies', index)}
                      disabled={formData.technologies.length <= 1}
                    >
                      <FiTrash2 />
                    </Button>
                  </div>
                ))}
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => handleAddItem('technologies')}
                >
                  <FiPlus className='mr-2' />
                  Add Technology
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {formData.features.map((feature, index) => (
                  <div key={index} className='flex gap-2'>
                    <Input
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...formData.features]
                        newFeatures[index] = e.target.value
                        setFormData({ ...formData, features: newFeatures })
                      }}
                      placeholder='Feature description'
                    />
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => handleRemoveItem('features', index)}
                      disabled={formData.features.length <= 1}
                    >
                      <FiTrash2 />
                    </Button>
                  </div>
                ))}
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => handleAddItem('features')}
                >
                  <FiPlus className='mr-2' />
                  Add Feature
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Process</CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                {formData.process.map((step, index) => (
                  <div key={index} className='p-4 border rounded-md space-y-4'>
                    <div className='flex justify-between items-center'>
                      <h3 className='font-medium'>Step {index + 1}</h3>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => handleRemoveProcess(index)}
                        disabled={formData.process.length <= 1}
                      >
                        <FiTrash2 />
                      </Button>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor={`process-title-${index}`}>Title</Label>
                      <Input
                        id={`process-title-${index}`}
                        value={step.title}
                        onChange={(e) => {
                          const newProcess = [...formData.process]
                          newProcess[index].title = e.target.value
                          setFormData({ ...formData, process: newProcess })
                        }}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor={`process-desc-${index}`}>
                        Description
                      </Label>
                      <Textarea
                        id={`process-desc-${index}`}
                        value={step.description}
                        onChange={(e) => {
                          const newProcess = [...formData.process]
                          newProcess[index].description = e.target.value
                          setFormData({ ...formData, process: newProcess })
                        }}
                        rows={3}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor={`process-icon-${index}`}>Icon</Label>
                      <select
                        id={`process-icon-${index}`}
                        value={step.icon}
                        onChange={(e) => {
                          const newProcess = [...formData.process]
                          newProcess[index].icon = e.target.value
                          setFormData({ ...formData, process: newProcess })
                        }}
                        className='w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700'
                      >
                        {iconOptions.map((icon) => (
                          <option key={icon.value} value={icon.value}>
                            {icon.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor={`process-duration-${index}`}>
                        Duration
                      </Label>
                      <Input
                        id={`process-duration-${index}`}
                        value={step.duration}
                        onChange={(e) => {
                          const newProcess = [...formData.process]
                          newProcess[index].duration = e.target.value
                          setFormData({ ...formData, process: newProcess })
                        }}
                        placeholder='e.g., 1-3 days'
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleAddProcess}
                >
                  <FiPlus className='mr-2' />
                  Add Process Step
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>FAQs</CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                {formData.faqs.map((faq, index) => (
                  <div key={index} className='p-4 border rounded-md space-y-4'>
                    <div className='flex justify-between items-center'>
                      <h3 className='font-medium'>FAQ {index + 1}</h3>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => handleRemoveFaq(index)}
                        disabled={formData.faqs.length <= 1}
                      >
                        <FiTrash2 />
                      </Button>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor={`faq-q-${index}`}>Question</Label>
                      <Input
                        id={`faq-q-${index}`}
                        value={faq.q}
                        onChange={(e) => {
                          const newFaqs = [...formData.faqs]
                          newFaqs[index].q = e.target.value
                          setFormData({ ...formData, faqs: newFaqs })
                        }}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor={`faq-a-${index}`}>Answer</Label>
                      <Textarea
                        id={`faq-a-${index}`}
                        value={faq.a}
                        onChange={(e) => {
                          const newFaqs = [...formData.faqs]
                          newFaqs[index].a = e.target.value
                          setFormData({ ...formData, faqs: newFaqs })
                        }}
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
                <Button type='button' variant='outline' onClick={handleAddFaq}>
                  <FiPlus className='mr-2' />
                  Add FAQ
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Publish</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Once you're done editing, save your changes or publish this
                  service.
                </p>
                <div className='flex flex-col gap-2'>
                  <Button
                    type='submit'
                    disabled={saving}
                    className='bg-indigo-600 hover:bg-indigo-700'
                  >
                    {saving ? 'Saving...' : 'Update Service'}
                    <FiSave className='ml-2' />
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deliverables</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {formData.deliverables.map((deliverable, index) => (
                  <div key={index} className='flex gap-2'>
                    <Input
                      value={deliverable}
                      onChange={(e) => {
                        const newDeliverables = [...formData.deliverables]
                        newDeliverables[index] = e.target.value
                        setFormData({
                          ...formData,
                          deliverables: newDeliverables,
                        })
                      }}
                      placeholder='Deliverable item'
                    />
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => handleRemoveItem('deliverables', index)}
                      disabled={formData.deliverables.length <= 1}
                    >
                      <FiTrash2 />
                    </Button>
                  </div>
                ))}
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => handleAddItem('deliverables')}
                >
                  <FiPlus className='mr-2' />
                  Add Deliverable
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
