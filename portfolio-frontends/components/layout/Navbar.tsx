'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from 'components/common/LanguageSwitcher'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const t = useTranslations('navbar')
  const menuRef = useRef<HTMLDivElement>(null)

  // Initial theme
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (
      saved === 'dark' ||
      (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const menuItems = [
    { name: t('home'), href: '/' },
    { name: t('about'), href: '/about' },
    { name: t('services'), href: '/services' },
    { name: t('projects'), href: '/projects' },
    { name: t('blog'), href: '/blog' },
    { name: t('contact'), href: '/contact' },
  ]

  return (
    <header className='bg-white dark:bg-gray-900 shadow sticky top-0 z-50 transition-colors'>
      <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative'>
        {/* Brand */}
        <Link
          href='/'
          className='text-2xl font-bold text-teal-600 dark:text-teal-400'
        >
          My<span className='text-orange-500'>Portfolio</span>
        </Link>

        {/* Desktop Menu */}
        <nav className='hidden md:flex space-x-6 font-medium'>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className='hover:text-teal-500 dark:hover:text-orange-400 transition'
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right Buttons */}
        <div className='hidden md:flex items-center gap-4'>
          <Link
            href='/resume.pdf'
            target='_blank'
            className='bg-orange-500 text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-orange-400 transition'
          >
            {t('resume')}
          </Link>

          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label={darkMode ? t('lightMode') : t('darkMode')}
            className='p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition'
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          <LanguageSwitcher />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label='Toggle menu'
          className='md:hidden text-2xl text-teal-600 dark:text-teal-400'
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className='md:hidden px-6 pb-4 space-y-2 text-center bg-white dark:bg-gray-900 shadow transition-colors'
        >
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className='block px-4 py-2 hover:text-teal-500 dark:hover:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition'
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className='flex justify-center gap-3 mt-2'>
            <Link
              href='/resume'
              target='_blank'
              className='bg-orange-500 text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-orange-400 transition'
            >
              {t('resume')}
            </Link>
            <button
              onClick={() => setDarkMode(!darkMode)}
              aria-label={darkMode ? t('lightMode') : t('darkMode')}
              className='p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition'
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>
          <div className='mt-3 pt-3 border-t border-gray-200 dark:border-gray-700'>
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  )
}
