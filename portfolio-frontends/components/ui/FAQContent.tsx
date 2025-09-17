'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const faqList = [
  {
    question: 'What is Advanced Learning?',
    answer: 'It is a modern platform for interactive online learning.',
  },
  {
    question: 'How do I enroll in a course?',
    answer:
      'Just click the enroll button on the course page and complete payment.',
  },
  {
    question: 'Can I get a refund?',
    answer: 'Yes, we offer a 7-day refund policy for most courses.',
  },
]

const FAQContent = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <div className='max-w-3xl mx-auto py-12 px-4'>
      <h1 className='text-4xl font-bold text-center mb-10'>
        Frequently Asked Questions
      </h1>
      <div className='space-y-4'>
        {faqList.map((faq, i) => (
          <div key={i} className='border rounded-lg shadow-sm'>
            <button
              onClick={() => setActiveIndex(i === activeIndex ? null : i)}
              className='w-full text-left px-4 py-3 font-medium text-lg flex justify-between items-center'
            >
              {faq.question}
              <span>{activeIndex === i ? '−' : '+'}</span>
            </button>
            <AnimatePresence>
              {activeIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className='px-4 pb-4 text-gray-700'
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FAQContent
