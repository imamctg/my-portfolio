// components/shared/DarkModeToggle.tsx

'use client'
import { useEffect, useState } from 'react'

const DarkModeToggle = () => {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])

  return (
    <button
      onClick={() => setDark(!dark)}
      className='px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded'
    >
      {dark ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}

export default DarkModeToggle
