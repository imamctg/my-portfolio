'use client'

import { Mail, Phone, MapPin } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import ReCAPTCHA from 'react-google-recaptcha'
import axios from 'axios'
import { useTranslations } from 'next-intl'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

const ContactPage = () => {
  const t = useTranslations('contact')

  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
    recaptchaToken: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  const handleCaptcha = (value: string | null) => {
    setForm((prev) => ({ ...prev, recaptchaToken: value || '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await axios.post(`${baseURL}/contact`, form)

      if (res.data.success) {
        toast.success(t('success'))
        setForm({ name: '', email: '', message: '', recaptchaToken: '' })
      } else {
        toast.error(res.data.message || t('error'))
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t('error'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='max-w-5xl mx-auto px-6 py-12'>
      <h1 className='text-4xl font-bold text-center text-indigo-700 dark:text-indigo-400 mb-4'>
        {t('title')}
      </h1>
      <p className='text-center text-gray-600 dark:text-gray-300 mb-12'>
        {t('description')}
      </p>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700'>
        <div className='space-y-6'>
          <div className='flex items-center gap-4'>
            <Mail className='text-indigo-600 dark:text-indigo-400' />
            <span className='text-gray-800 dark:text-gray-100'>
              {t('contactEmail')}
            </span>
          </div>
          <div className='flex items-center gap-4'>
            <Phone className='text-indigo-600 dark:text-indigo-400' />
            <span className='text-gray-800 dark:text-gray-100'>
              {t('phone')}
            </span>
          </div>
          <div className='flex items-center gap-4'>
            <MapPin className='text-indigo-600 dark:text-indigo-400' />
            <span className='text-gray-800 dark:text-gray-100'>
              {t('address')}
            </span>
          </div>
          <p className='text-gray-500 dark:text-gray-400 mt-6'>
            {t('responseTime')}
          </p>
        </div>

        <form className='space-y-4' onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700 dark:text-gray-200'
            >
              {t('name')}
            </label>
            <input
              type='text'
              id='name'
              value={form.name}
              onChange={handleChange}
              required
              className='mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
              placeholder={t('name')}
            />
          </div>

          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700 dark:text-gray-200'
            >
              {t('email')}
            </label>
            <input
              type='email'
              id='email'
              value={form.email}
              onChange={handleChange}
              required
              className='mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
              placeholder={t('email')}
            />
          </div>

          <div>
            <label
              htmlFor='message'
              className='block text-sm font-medium text-gray-700 dark:text-gray-200'
            >
              {t('message')}
            </label>
            <textarea
              id='message'
              rows={5}
              value={form.message}
              onChange={handleChange}
              required
              className='mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
              placeholder={t('messagePlaceholder')}
            />
          </div>

          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={handleCaptcha}
          />

          <button
            type='submit'
            disabled={submitting}
            className='bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-md transition disabled:opacity-50'
          >
            {submitting ? t('sending') : t('send')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ContactPage
