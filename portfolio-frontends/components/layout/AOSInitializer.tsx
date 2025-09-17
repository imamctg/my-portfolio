// components/AOSInitializer.tsx

'use client'

import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

const AOSInitializer = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    })
  }, [])

  return null // UI-তে কিছু রেন্ডার করার দরকার নেই
}

export default AOSInitializer
