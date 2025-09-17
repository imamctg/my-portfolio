'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import axios from 'axios'
import { motion, Variants } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaWordpress,
  FaBootstrap,
  FaBullhorn,
  FaChartLine,
  FaEye,
  FaHandshake,
  FaCode,
  FaRocket,
  FaLaptopCode,
  FaServer,
  FaProjectDiagram,
  FaSearch,
  FaLock,
  FaUsers,
  FaGlobe,
  FaMobile,
} from 'react-icons/fa'
import { SiNextdotjs, SiMongodb, SiTailwindcss, SiMysql } from 'react-icons/si'
import { FiEye } from 'react-icons/fi'
import { TypeAnimation } from 'react-type-animation'

interface Service {
  _id: string
  slug: string
  title: string
  description: string
  icon: string
  features?: string[]
  technologies?: string[]
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function Homepage() {
  const t = useTranslations('home')
  const locale = useLocale()
  const [hero, setHero] = useState<any>(null)
  const [skills, setSkills] = useState<any[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [cta, setCta] = useState<any>(null)

  // Fetch projects & testimonials
  useEffect(() => {
    axios
      .get(`${baseURL}/hero?locale=${locale}`)
      .then((res) => setHero(res.data))
      .catch(() => setHero(null))

    axios
      .get(`${baseURL}/skills`)
      .then((res) => setSkills(res.data))
      .catch((err) => console.error(err))
    axios
      .get(`${baseURL}/services/all`)
      .then((res) => setServices(res.data))
      .catch((err) => console.error(err))
    axios
      .get(`${baseURL}/projects`)
      .then((res) => setProjects(res.data))
      .catch((err) => console.error(err))

    axios
      .get(`${baseURL}/testimonials`)
      .then((res) => setTestimonials(res.data))
      .catch((err) => console.error(err))

    axios
      .get(`${baseURL}/cta?locale=${locale}`)
      .then((res) => setCta(res.data))
      .catch((err) => console.error(err))
  }, [])

  const skillIcons: Record<string, JSX.Element> = {
    React: <FaReact className='text-cyan-500' />,
    'Next.js': <SiNextdotjs className='text-black dark:text-white' />,
    'Node.js': <FaNodeJs className='text-green-500' />,
    MongoDB: <SiMongodb className='text-green-600' />,
    MySQL: <SiMysql className='text-blue-500' />,
    TailwindCSS: <SiTailwindcss className='text-sky-500' />,
    JavaScript: <FaJs className='text-yellow-500' />,
    HTML5: <FaHtml5 className='text-orange-500' />,
    CSS3: <FaCss3Alt className='text-blue-600' />,
    Database: <FaDatabase className='text-indigo-500' />,
    WordPress: <FaWordpress className='text-blue-600' />,
    SEO: <FaChartLine className='text-green-500' />,
    Bootstrap: <FaBootstrap className='text-purple-600' />,
    'Digital Marketing': <FaBullhorn className='text-pink-500' />,
  }

  const [servicesRef, servicesInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })
  const sectionVariant: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: 'easeOut' },
    },
  }
  const listVariant: Variants = {
    visible: { transition: { staggerChildren: 0.15 } },
  }
  const itemVariant: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  // InView triggers
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.2 })
  const [skillsRef, skillsInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })
  const [projectsRef, projectsInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })
  const [testimonialsRef, testimonialsInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.2 })

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
    <main
      className='bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800
      text-gray-900 dark:text-gray-200 overflow-x-hidden selection:bg-teal-500 selection:text-white'
    >
      {/* HERO */}

      <section
        ref={heroRef}
        className='relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white overflow-hidden'
      >
        {/* Animated background elements */}
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]'></div>
        <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent'></div>

        {/* Floating particles animation */}
        <div className='absolute inset-0 opacity-20'>
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className='absolute rounded-full bg-teal-500 opacity-30'
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 20 + 5}px`,
                height: `${Math.random() * 20 + 5}px`,
                animation: `float ${
                  Math.random() * 10 + 10
                }s infinite ease-in-out`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>

        <motion.div
          className='relative z-10 max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12'
          initial='hidden'
          animate={heroInView ? 'visible' : 'hidden'}
          variants={sectionVariant}
        >
          {/* Text Content */}
          <div className='text-center lg:text-left lg:w-1/2'>
            <motion.div
              className='inline-flex items-center px-4 py-2 rounded-full bg-blue-800/30 border border-blue-500/30 text-sm mb-6'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className='w-2 h-2 bg-teal-400 rounded-full mr-2 animate-pulse'></span>
              {t('hero.availability') || 'Available for new projects'}
            </motion.div>

            <motion.h1
              className='text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400'
              variants={itemVariant}
            >
              <span className='text-white'> {t('hero.greeting')}</span>
              <br />
              <span className='text-5xl md:text-6xl lg:text-7xl'>
                {t('hero.name')}
              </span>
            </motion.h1>

            <motion.div
              className='text-xl md:text-2xl font-semibold mb-6 text-blue-200'
              variants={itemVariant}
            >
              <TypeAnimation
                sequence={[
                  'Full-Stack Developer',
                  2000,
                  'Frontend Expert',
                  2000,
                  'Web Solutions Expert',
                  2000,
                ]}
                wrapper='span'
                speed={50}
                repeat={Infinity}
              />
            </motion.div>

            <motion.p
              className='text-lg md:text-xl text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0'
              variants={itemVariant}
            >
              {hero?.description ||
                'I craft high-performing, scalable web applications with cutting-edge technologies that drive business growth and deliver exceptional user experiences.'}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10 lg:mb-0'
              variants={itemVariant}
            >
              <Link
                href='#projects'
                className='group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-teal-500 to-blue-600 rounded-full shadow-2xl hover:shadow-teal-500/30 transition-all duration-300 hover:-translate-y-1'
              >
                <span>View My Work</span>
                <svg
                  className='w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M14 5l7 7m0 0l-7 7m7-7H3'
                  />
                </svg>
              </Link>

              <Link
                href='/contact'
                className='group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-transparent border-2 border-blue-500 rounded-full hover:bg-blue-500/10 transition-all duration-300 hover:-translate-y-1'
              >
                <span>Hire Me</span>
                <svg
                  className='w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 8l4 4m0 0l-4 4m4-4H3'
                  />
                </svg>
              </Link>
            </motion.div>

            {/* Social proof/trust indicators */}
            <motion.div
              className='flex items-center justify-center lg:justify-start gap-6 text-gray-400 text-sm'
              variants={itemVariant}
            >
              <div className='flex items-center'>
                <div className='flex -space-x-2 mr-2'>
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className='w-6 h-6 rounded-full bg-blue-500 border-2 border-slate-900'
                    ></div>
                  ))}
                </div>
                <span>Trusted by 50+ clients</span>
              </div>
              <div className='flex items-center'>
                <svg
                  className='w-4 h-4 text-yellow-400 mr-1'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                </svg>
                <span>5.0 (120+ reviews)</span>
              </div>
            </motion.div>
          </div>

          {/* Profile Image */}
          <motion.div
            className='relative lg:w-1/2 flex justify-center'
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <div className='relative'>
              <div className='absolute -inset-4 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full opacity-20 blur-xl'></div>
              <div className='relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl'>
                <img
                  src='/imam.jpg'
                  alt='Md Imam Hossain - Professional Web Developer'
                  className='w-full h-full object-cover'
                />
              </div>

              {/* Floating tech badges */}
              <div className='absolute -top-4 -right-4 w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center shadow-lg border border-slate-700 animate-float'>
                <FaReact className='text-3xl text-cyan-400' />
              </div>

              <div
                className='absolute -bottom-4 -left-4 w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center shadow-lg border border-slate-700 animate-float'
                style={{ animationDelay: '2s' }}
              >
                <SiNextdotjs className='text-2xl text-white' />
              </div>

              <div
                className='absolute top-1/2 -left-8 w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center shadow-lg border border-slate-700 animate-float'
                style={{ animationDelay: '4s' }}
              >
                <FaNodeJs className='text-2xl text-green-500' />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className='absolute bottom-8 left-1/2 transform -translate-x-1/2'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className='animate-bounce flex flex-col items-center text-sm text-blue-300'>
            <span className='mb-2'>Scroll down</span>
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 14l-7 7m0 0l-7-7m7 7V3'
              />
            </svg>
          </div>
        </motion.div>

        {/* Add to your global CSS */}
        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
        `}</style>
      </section>

      {/* SKILLS */}
      <section
        ref={skillsRef}
        className='py-20 px-6 bg-gray-50 dark:bg-gray-900'
      >
        <motion.h2
          className='text-3xl md:text-4xl font-bold text-center mb-12'
          initial='hidden'
          animate={skillsInView ? 'visible' : 'hidden'}
          variants={sectionVariant}
        >
          {t('skills.title')}
        </motion.h2>
        <motion.div
          className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 max-w-6xl mx-auto'
          initial='hidden'
          animate={skillsInView ? 'visible' : 'hidden'}
          variants={listVariant}
        >
          {skills.map((skill) => (
            <motion.div
              key={skill._id}
              className='bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col items-center justify-center hover:shadow-lg transition-all duration-300'
              variants={itemVariant}
            >
              <div className='text-5xl mb-3'>
                {skillIcons[skill.name] || (
                  <FaDatabase className='text-gray-400' />
                )}
              </div>
              <p className='font-semibold text-gray-800 dark:text-white'>
                {skill.name}
              </p>
              {skill.level && (
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  {skill.level}
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* SERVICES */}
      <section
        ref={servicesRef}
        className='relative py-24 px-6 bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden'
      >
        {/* Background decorative elements */}
        <div className='absolute top-0 left-0 w-full h-72 bg-gradient-to-r from-teal-500/5 to-indigo-600/5 transform -skew-y-3 -translate-y-16'></div>

        <div className='max-w-7xl mx-auto relative z-10'>
          {/* Section Header */}
          <motion.div
            className='text-center mb-16'
            initial='hidden'
            animate={servicesInView ? 'visible' : 'hidden'}
            variants={sectionVariant}
          >
            <div className='inline-flex items-center px-4 py-2 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 text-sm font-medium mb-6'>
              <FaRocket className='mr-2' />
              {t('services.subtitle') || 'What I Offer'}
            </div>

            <motion.h2
              className='text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white'
              variants={itemVariant}
            >
              {t('services.title1') || 'Professional'}{' '}
              <span className='bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-indigo-600'>
                {t('services.title2') || 'Services'}
              </span>
            </motion.h2>

            <motion.p
              className='text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'
              variants={itemVariant}
            >
              {t('services.description') ||
                'Comprehensive solutions tailored to transform your ideas into high-performing digital experiences that drive business growth.'}
            </motion.p>
          </motion.div>

          {/* Services Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {services.map((service, index) => (
              <motion.div
                key={service._id}
                className='group relative'
                initial='hidden'
                animate={servicesInView ? 'visible' : 'hidden'}
                variants={itemVariant}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className='absolute inset-0 bg-gradient-to-br from-teal-500/10 to-indigo-600/10 rounded-2xl transform group-hover:scale-105 transition duration-300 opacity-0 group-hover:opacity-100'></div>

                <div className='relative h-full bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 group-hover:shadow-xl transition-all duration-300'>
                  {/* Icon */}
                  <div className='inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 text-white text-2xl mb-6 transform group-hover:scale-110 transition duration-300'>
                    {iconMap[service.icon] || <FaCode />}
                  </div>

                  {/* Title */}
                  <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className='text-gray-600 dark:text-gray-300 mb-5'>
                    {service.description}
                  </p>

                  {/* Hover Content */}
                  <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    {/* Technologies */}
                    {service.technologies &&
                      service.technologies.length > 0 && (
                        <div className='mb-4'>
                          <h4 className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2'>
                            Technologies
                          </h4>
                          <div className='flex flex-wrap gap-1'>
                            {service.technologies
                              .slice(0, 3)
                              .map((tech, idx) => (
                                <span
                                  key={idx}
                                  className='bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded'
                                >
                                  {tech}
                                </span>
                              ))}
                            {service.technologies.length > 3 && (
                              <span className='text-xs text-gray-500 dark:text-gray-400'>
                                +{service.technologies.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                    {/* CTA */}
                    <Link
                      href={`/${locale}/services/${service.slug}`}
                      className='inline-flex items-center text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors'
                    >
                      Explore service
                      <svg
                        className='w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M14 5l7 7m0 0l-7 7m7-7H3'
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section
        id='projects'
        ref={projectsRef}
        className='py-20 px-6 bg-gradient-to-b from-white to-gray-100 dark:from-gray-800 dark:to-gray-900'
      >
        <motion.h2
          className='text-3xl md:text-4xl font-bold text-center mb-12'
          initial='hidden'
          animate={projectsInView ? 'visible' : 'hidden'}
          variants={sectionVariant}
        >
          {t('projects.title')}
        </motion.h2>
        <motion.div
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'
          initial='hidden'
          animate={projectsInView ? 'visible' : 'hidden'}
          variants={listVariant}
        >
          {projects.map((project, i) => (
            <motion.div
              key={i}
              className='relative bg-white dark:bg-gray-800 rounded-2xl shadow-md
              hover:shadow-2xl overflow-hidden border dark:border-gray-700
              group transform hover:scale-105 transition'
              variants={itemVariant}
            >
              <img
                src={project.thumbnail || 'https://via.placeholder.com/600x400'}
                alt={project.title}
                className='w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110'
              />
              {/* Hover Overlay */}
              <div
                className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent
                opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center'
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className='inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold
                  bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg
                  hover:from-indigo-600 hover:to-purple-600 transition'
                >
                  <FiEye className='w-5 h-5' />
                  {t('projects.view')}
                </Link>
              </div>
              <div className='p-6 space-y-2'>
                <span
                  className='inline-block text-xs font-semibold px-3 py-1 rounded-full
                  bg-gradient-to-r from-teal-400 to-cyan-500 text-white'
                >
                  {project.category}
                </span>
                <h3 className='text-xl font-bold line-clamp-1'>
                  {project.title}
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-300 line-clamp-2'>
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* TESTIMONIALS */}
      <section
        ref={testimonialsRef}
        className='py-20 px-6 bg-gray-50 dark:bg-gray-900'
      >
        <motion.h2
          className='text-3xl md:text-4xl font-bold text-center mb-12'
          initial='hidden'
          animate={testimonialsInView ? 'visible' : 'hidden'}
          variants={sectionVariant}
        >
          {t('testimonials.title')}
        </motion.h2>
        <motion.div
          className='max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'
          initial='hidden'
          animate={testimonialsInView ? 'visible' : 'hidden'}
          variants={listVariant}
        >
          {testimonials.map((tItem, i) => (
            <motion.div
              key={i}
              className='bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md
              flex flex-col items-center text-center space-y-4
              hover:shadow-xl transition transform hover:scale-105'
              variants={itemVariant}
            >
              <img
                src={tItem.profileImage || '/users/default.jpg'}
                alt={tItem.name}
                className='w-20 h-20 rounded-full object-cover border-4
                border-teal-500 dark:border-orange-400 shadow-lg'
              />
              <p className='text-gray-700 dark:text-gray-300 italic'>
                “{tItem.comment}”
              </p>
              <p className='text-sm font-semibold text-gray-600 dark:text-gray-400'>
                — {tItem.name}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section
        ref={ctaRef}
        className='w-full px-6 py-20 text-center
        bg-gradient-to-r from-teal-600 via-indigo-600 to-orange-500 text-white'
      >
        <motion.div
          className='max-w-3xl mx-auto space-y-6'
          initial='hidden'
          animate={ctaInView ? 'visible' : 'hidden'}
          variants={sectionVariant}
        >
          <h2 className='text-3xl md:text-4xl font-extrabold drop-shadow-lg'>
            {cta?.title}
          </h2>
          <p className='text-lg md:text-xl text-gray-100'>{cta?.description}</p>
          <Link
            href='/contact'
            className='inline-block bg-yellow-400 text-gray-900 px-8 py-3 rounded-full
            font-bold shadow-lg hover:bg-yellow-300 transition transform hover:scale-105'
          >
            📩 {t('cta.button')}
          </Link>
        </motion.div>
      </section>
    </main>
  )
}
