'use client'

import { Target, Eye } from 'lucide-react'
import { useTranslations } from 'next-intl'

const AboutPage = () => {
  const t = useTranslations('about')

  return (
    <div className='bg-gradient-to-b from-white via-blue-50 to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 min-h-screen py-16 px-4 transition-colors'>
      <div className='max-w-5xl mx-auto text-center'>
        <h1 className='text-4xl md:text-5xl font-extrabold text-blue-700 dark:text-blue-400 mb-4'>
          {t('title')}
        </h1>
        <p className='text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed'>
          {t('description')}
        </p>
      </div>

      <div className='mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-t-4 border-blue-600'>
          <div className='flex items-center mb-4'>
            <Target className='text-blue-600 dark:text-blue-400 w-6 h-6 mr-2' />
            <h2 className='text-2xl font-semibold text-gray-800 dark:text-gray-100'>
              {t('missionTitle')}
            </h2>
          </div>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
            {t('missionDescription')}
          </p>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-t-4 border-blue-600'>
          <div className='flex items-center mb-4'>
            <Eye className='text-blue-600 dark:text-blue-400 w-6 h-6 mr-2' />
            <h2 className='text-2xl font-semibold text-gray-800 dark:text-gray-100'>
              {t('visionTitle')}
            </h2>
          </div>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
            {t('visionDescription')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
