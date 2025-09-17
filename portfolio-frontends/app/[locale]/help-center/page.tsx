'use client'

import { motion } from 'framer-motion'

const helpSections = [
  {
    title: 'Account Help',
    content:
      'Learn how to manage your account, reset passwords, and secure your profile.',
  },
  {
    title: 'Payment Support',
    content:
      'Get help with transactions, payment failures, and refund policies.',
  },
  {
    title: 'Course Access',
    content:
      'Find out how to access your purchased courses and troubleshoot loading issues.',
  },
]

const HelpCenter = () => {
  return (
    <div className='max-w-4xl mx-auto py-12 px-4'>
      <h1 className='text-4xl font-bold text-center mb-10'>Help Center</h1>

      <div className='space-y-6'>
        {helpSections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
            className='bg-white shadow-md rounded-xl p-5 border'
          >
            <h2 className='text-xl font-semibold mb-2'>{section.title}</h2>
            <p className='text-gray-600'>{section.content}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default HelpCenter
