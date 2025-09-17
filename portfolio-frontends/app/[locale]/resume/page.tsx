'use client'

import { motion } from 'framer-motion'

export default function Resume() {
  return (
    <main className='bg-gray-50 dark:bg-gray-900 min-h-screen py-12 px-4'>
      <div className='max-w-4xl mx-auto space-y-12'>
        {/* Header */}
        <header className='bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 flex flex-col md:flex-row md:justify-between md:items-center border-l-4 border-indigo-600'>
          <div>
            <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-1'>
              Md Imam Hossain
            </h1>
            <p className='text-indigo-600 dark:text-teal-400 font-medium text-lg'>
              Full-Stack Developer | International Client Focus
            </p>
          </div>
          <div className='mt-6 md:mt-0 flex flex-col md:flex-row md:gap-6 text-gray-600 dark:text-gray-300 text-sm'>
            <span>📧 imamhossain@yahoo.com</span>
            <span>📱 +880 123456789</span>
            <span>
              🌐{' '}
              <a
                href='https://your-portfolio.com'
                target='_blank'
                className='text-indigo-500 dark:text-teal-300 hover:underline'
              >
                Portfolio
              </a>
            </span>
            <span>
              💼{' '}
              <a
                href='https://linkedin.com/in/imamhossain'
                target='_blank'
                className='text-indigo-500 dark:text-teal-300 hover:underline'
              >
                LinkedIn
              </a>
            </span>
          </div>
        </header>

        {/* Profile */}
        <motion.section
          className='bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 border-l-4 border-teal-500'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-2'>
            Profile
          </h2>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
            Experienced Full-Stack Developer with 5+ years of building modern
            web applications. Expert in JavaScript, React, Next.js, Node.js, and
            MongoDB. Dedicated to delivering high-quality solutions for
            international clients with emphasis on performance, scalability, and
            usability.
          </p>
        </motion.section>

        {/* Skills */}
        <motion.section
          className='bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 border-l-4 border-purple-500'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
            Skills
          </h2>
          <div className='flex flex-wrap gap-3'>
            {[
              'React',
              'Next.js',
              'Node.js',
              'MongoDB',
              'MySQL',
              'TailwindCSS',
              'JavaScript',
              'HTML5',
              'CSS3',
              'REST APIs',
              'Git',
              'Figma',
              'Agile',
            ].map((skill) => (
              <span
                key={skill}
                className='bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 px-3 py-1 rounded-full text-sm font-medium shadow-sm'
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.section>

        {/* Work Experience */}
        <motion.section
          className='space-y-6'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
            Work Experience
          </h2>

          {[
            {
              title: 'Senior Full-Stack Developer',
              company: 'Freelance',
              period: '2021 - Present',
              responsibilities: [
                'Developed responsive, high-performance web applications for clients worldwide.',
                'Implemented modern frontend (React/Next.js) and backend (Node.js/Express) solutions.',
                'Integrated third-party APIs and payment gateways for international clients.',
              ],
            },
            {
              title: 'Full-Stack Developer',
              company: 'XYZ Tech Solutions',
              period: '2018 - 2021',
              responsibilities: [
                'Built and maintained SaaS applications with focus on performance and scalability.',
                'Worked in Agile teams to deliver client requirements efficiently.',
                'Optimized databases and queries to improve application speed by 30%.',
              ],
            },
          ].map((job) => (
            <div
              key={job.title}
              className='bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 border-l-4 border-indigo-500'
            >
              <h3 className='font-bold text-gray-900 dark:text-white text-lg'>
                {job.title}
              </h3>
              <p className='text-gray-600 dark:text-gray-300 text-sm mb-2'>
                {job.company} | {job.period}
              </p>
              <ul className='list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1'>
                {job.responsibilities.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </motion.section>

        {/* Education */}
        <motion.section
          className='bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 border-l-4 border-green-500'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-2'>
            Education
          </h2>
          <p className='text-gray-700 dark:text-gray-300'>
            B.Sc. in Computer Science, ABC University | 2014 - 2018
          </p>
        </motion.section>

        {/* Projects */}
        <motion.section
          className='bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 border-l-4 border-yellow-500'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-2'>
            Selected Projects
          </h2>
          <ul className='list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1'>
            {[
              {
                name: 'Project One',
                url: 'https://project1.com',
                desc: 'Full-stack marketplace platform.',
              },
              {
                name: 'Project Two',
                url: 'https://project2.com',
                desc: 'Multi-language e-learning platform.',
              },
              {
                name: 'Project Three',
                url: 'https://project3.com',
                desc: 'SaaS dashboard for analytics.',
              },
            ].map((project) => (
              <li key={project.name}>
                <a
                  href={project.url}
                  target='_blank'
                  className='text-indigo-500 dark:text-teal-300 hover:underline font-medium'
                >
                  {project.name}
                </a>{' '}
                - {project.desc}
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          className='flex flex-wrap gap-4 justify-center'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <a
            href='/resume.pdf'
            target='_blank'
            rel='noopener noreferrer'
            className='bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-bold shadow-lg transition transform hover:scale-105'
          >
            📄 Download Resume
          </a>
          <a
            href='/contact'
            className='bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-full font-bold shadow-lg transition transform hover:scale-105'
          >
            📩 Hire Me
          </a>
        </motion.section>
      </div>
    </main>
  )
}
