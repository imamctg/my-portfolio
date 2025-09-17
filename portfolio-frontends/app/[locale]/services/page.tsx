'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent } from 'components/ui/card'
import {
  FaLaptopCode,
  FaServer,
  FaProjectDiagram,
  FaDatabase,
  FaWordpress,
  FaSearch,
  FaLock,
  FaUsers,
  FaGlobe,
  FaMobile,
  FaRocket,
  FaCode,
} from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'

interface Service {
  slug: string
  title: string
  description: string
  icon: string
  features?: string[]
  technologies?: string[]
}

// const services: Service[] = [
//   {
//     slug: 'frontend-web-development',
//     title: 'Frontend Web Development',
//     description:
//       'Modern, responsive websites built with cutting-edge technologies ensuring optimal performance, accessibility, and user experience.',
//     icon: <FaLaptopCode className='text-indigo-500' />,
//     technologies: [
//       'React',
//       'Next.js',
//       'TypeScript',
//       'TailwindCSS',
//       'Framer Motion',
//     ],
//     features: [
//       'Responsive Design',
//       'Performance Optimization',
//       'SEO-friendly',
//       'Cross-browser Compatibility',
//     ],
//   },
//   {
//     slug: 'backend-development',
//     title: 'Backend Development & API Services',
//     description:
//       'Robust server-side solutions with secure APIs, database management, and cloud infrastructure setup.',
//     icon: <FaServer className='text-green-500' />,
//     technologies: ['Node.js', 'Express', 'Python', 'Django', 'PostgreSQL'],
//     features: [
//       'REST/GraphQL APIs',
//       'Database Design',
//       'Authentication Systems',
//       'Server Configuration',
//     ],
//   },
//   {
//     slug: 'fullstack-project',
//     title: 'Fullstack Project Development',
//     description:
//       'End-to-end development from concept to deployment with focus on scalability, maintainability and user experience.',
//     icon: <FaProjectDiagram className='text-purple-500' />,
//     technologies: ['MERN Stack', 'Next.js', 'PostgreSQL', 'AWS/Vercel'],
//     features: [
//       'Project Architecture',
//       'CI/CD Pipeline',
//       'Testing Strategy',
//       'Documentation',
//     ],
//   },
//   {
//     slug: 'role-based-dashboard',
//     title: 'Custom Dashboard Systems',
//     description:
//       'Role-based dashboards with granular permissions, analytics, and real-time data visualization.',
//     icon: <FaUsers className='text-yellow-500' />,
//     technologies: [
//       'React Admin',
//       'Chart.js',
//       'JWT',
//       'Role-based Access Control',
//     ],
//     features: [
//       'User Management',
//       'Data Visualization',
//       'Custom Reporting',
//       'Access Control',
//     ],
//   },
//   {
//     slug: 'mern-stack-development',
//     title: 'MERN Stack Applications',
//     description:
//       'Dynamic, data-driven applications using MongoDB, Express, React, and Node.js ecosystem.',
//     icon: <FaDatabase className='text-teal-500' />,
//     technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Mongoose'],
//     features: [
//       'Real-time Features',
//       'Data Management',
//       'Scalable Architecture',
//       'Cloud Integration',
//     ],
//   },
//   {
//     slug: 'wordpress-development',
//     title: 'WordPress Development & eCommerce',
//     description:
//       'Custom WordPress solutions including theme development, plugin customization, and WooCommerce setups.',
//     icon: <FaWordpress className='text-blue-500' />,
//     technologies: ['WordPress', 'PHP', 'WooCommerce', 'Elementor', 'ACF'],
//     features: [
//       'Theme Development',
//       'Plugin Customization',
//       'eCommerce Solutions',
//       'Performance Optimization',
//     ],
//   },
//   {
//     slug: 'seo-optimization',
//     title: 'SEO & Performance Optimization',
//     description:
//       'Comprehensive SEO strategies and performance optimization to increase visibility and conversion rates.',
//     icon: <FaSearch className='text-pink-500' />,
//     technologies: [
//       'Technical SEO',
//       'Core Web Vitals',
//       'Google Analytics',
//       'Structured Data',
//     ],
//     features: [
//       'SEO Audit',
//       'Keyword Strategy',
//       'Performance Optimization',
//       'Analytics Setup',
//     ],
//   },
//   {
//     slug: 'authentication-security',
//     title: 'Security & Authentication Solutions',
//     description:
//       'Enterprise-grade security implementations including authentication, authorization and data protection.',
//     icon: <FaLock className='text-red-500' />,
//     technologies: ['OAuth', 'JWT', 'NextAuth', 'Crypto', 'Security Headers'],
//     features: [
//       'Authentication Flow',
//       'Data Encryption',
//       'Security Best Practices',
//       'Vulnerability Testing',
//     ],
//   },
//   {
//     slug: 'progressive-web-apps',
//     title: 'Progressive Web Applications (PWA)',
//     description:
//       'Native-like web applications with offline functionality, push notifications and app-like experience.',
//     icon: <FaMobile className='text-orange-500' />,
//     technologies: [
//       'PWA',
//       'Service Workers',
//       'Web App Manifest',
//       'Caching Strategies',
//     ],
//     features: [
//       'Offline Functionality',
//       'Push Notifications',
//       'App-like UI',
//       'Cross-platform Compatibility',
//     ],
//   },
//   {
//     slug: 'internationalization',
//     title: 'Multi-language & Internationalization',
//     description:
//       'Websites and applications optimized for global audiences with multi-language support and localization.',
//     icon: <FaGlobe className='text-cyan-500' />,
//     technologies: [
//       'i18n',
//       'Next.js Internationalization',
//       'Localization',
//       'Translation Management',
//     ],
//     features: [
//       'Multi-language Support',
//       'RTL Compatibility',
//       'Cultural Adaptation',
//       'Local SEO',
//     ],
//   },
// ]
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const locale = useLocale()

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${baseURL}/services/all`)
        const data = await res.json()
        setServices(data)
      } catch (error) {
        console.error('Failed to fetch services:', error)
      }
    }
    fetchServices()
  }, [])

  // Icon mapping
  const iconMap: Record<string, JSX.Element> = {
    FaLaptopCode: <FaLaptopCode className='text-indigo-500' />,
    FaServer: <FaServer className='text-green-500' />,
    FaProjectDiagram: <FaProjectDiagram className='text-purple-500' />,
    FaDatabase: <FaDatabase className='text-teal-500' />,
    FaWordpress: <FaWordpress className='text-blue-500' />,
    FaSearch: <FaSearch className='text-pink-500' />,
    FaLock: <FaLock className='text-red-500' />,
    FaUsers: <FaUsers className='text-yellow-500' />,
    FaGlobe: <FaGlobe className='text-cyan-500' />,
    FaMobile: <FaMobile className='text-orange-500' />,
    FaRocket: <FaRocket className='text-indigo-500' />,
    FaCode: <FaCode className='text-gray-500' />,
  }

  return (
    <div className='container mx-auto px-4 py-16'>
      {/* Hero Section */}
      <motion.section
        className='text-center mb-16'
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className='text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white'>
          Professional{' '}
          <span className='text-indigo-600 dark:text-indigo-400'>
            Development Services
          </span>
        </h1>
        <p className='text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8'>
          Comprehensive web development solutions tailored to your business
          needs. From concept to deployment, I deliver high-quality, scalable
          applications with cutting-edge technologies.
        </p>

        <div className='flex flex-wrap justify-center gap-4 mb-12'>
          {[
            'Next.js',
            'React',
            'TypeScript',
            'Node.js',
            'MongoDB',
            'TailwindCSS',
            'AWS',
            'WordPress',
          ].map((tech) => (
            <span
              key={tech}
              className='bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-sm font-medium'
            >
              {tech}
            </span>
          ))}
        </div>
      </motion.section>

      {/* Services Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
        {services.map((service, i) => (
          <motion.div
            key={service.slug}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            onMouseEnter={() => setHoveredCard(i)}
            onMouseLeave={() => setHoveredCard(null)}
            className='relative'
          >
            <Card
              className={`rounded-2xl shadow-lg hover:shadow-2xl transform transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden 
              ${
                hoveredCard === i
                  ? '-translate-y-2 border-indigo-300 dark:border-indigo-600'
                  : ''
              }`}
            >
              {/* Decorative element */}
              <div
                className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transition-opacity ${
                  hoveredCard === i ? 'opacity-100' : 'opacity-70'
                }`}
              ></div>

              <CardContent className='p-6 space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='text-4xl p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg'>
                    {iconMap[service.icon] || (
                      <FaCode className='text-gray-400' />
                    )}
                  </div>

                  {hoveredCard === i && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className='bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded'
                    >
                      Popular
                    </motion.div>
                  )}
                </div>

                <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
                  {service.title}
                </h2>

                <p className='text-gray-600 dark:text-gray-300 text-sm'>
                  {service.description}
                </p>

                {/* Technologies and Features (shown on hover) */}
                {hoveredCard === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className='pt-2 space-y-3'
                  >
                    <div>
                      <h4 className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1'>
                        Technologies
                      </h4>
                      <div className='flex flex-wrap gap-1'>
                        {service.technologies?.map((tech, idx) => (
                          <span
                            key={idx}
                            className='bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded'
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1'>
                        Key Features
                      </h4>
                      <ul className='text-xs text-gray-600 dark:text-gray-400 space-y-1'>
                        {service.features?.map((feature, idx) => (
                          <li key={idx} className='flex items-start'>
                            <span className='text-indigo-500 mr-1'>•</span>{' '}
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}

                <div className='pt-2'>
                  <Link
                    href={`/${locale}/services/${service.slug}`}
                    className='inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-medium shadow-md transition-all transform hover:scale-105'
                  >
                    Explore Service
                    <FaRocket className='ml-2' />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <motion.section
        className='bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white mt-16'
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className='text-2xl md:text-3xl font-bold mb-4'>
          Ready to Start Your Project?
        </h2>
        <p className='text-indigo-100 max-w-2xl mx-auto mb-6'>
          Let's discuss how I can help bring your ideas to life with a custom
          solution tailored to your specific needs.
        </p>
        <div className='flex flex-col sm:flex-row justify-center gap-4'>
          <Link
            href='/en/contact'
            className='bg-white text-indigo-600 hover:bg-gray-100 px-6 py-3 rounded-full font-bold shadow-lg transition transform hover:scale-105'
          >
            Get Free Consultation
          </Link>
          <Link
            href='/en/projects'
            className='bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-full font-bold transition'
          >
            View My Projects
          </Link>
        </div>
      </motion.section>
    </div>
  )
}
