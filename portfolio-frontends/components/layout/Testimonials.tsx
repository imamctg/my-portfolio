// components/home/Testimonials.tsx
'use client'
const Testimonials = () => {
  const feedback = [
    {
      name: 'John Doe',
      comment: 'This platform helped me land my first developer job!',
    },
    {
      name: 'Aisha Khatun',
      comment: 'I loved the course structure and the instructors are amazing.',
    },
    {
      name: 'Carlos Mendez',
      comment: 'Great platform with tons of useful content!',
    },
  ]

  return (
    <section
      className='bg-white dark:bg-gray-900 py-16 px-6 data-aos="fade-up'
      data-aos='fade-up'
    >
      <h2 className='text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white'>
        What Our Students Say
      </h2>
      <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'>
        {feedback.map((item, i) => (
          <div
            key={i}
            className='bg-gray-100 dark:bg-gray-800 rounded-md p-6 shadow'
            data-aos='zoom-in'
            data-aos-delay={i * 100}
          >
            <p className='text-gray-700 dark:text-gray-200 italic mb-4'>
              “{item.comment}”
            </p>
            <h4 className='font-semibold text-indigo-700 dark:text-indigo-400'>
              {item.name}
            </h4>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Testimonials
