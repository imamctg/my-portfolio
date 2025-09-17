'use client'

import React from 'react'

interface PasswordHintsProps {
  password: string
}

const PasswordHints: React.FC<PasswordHintsProps> = ({ password }) => {
  const rules = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'One number', valid: /\d/.test(password) },
    { label: 'One special character', valid: /[!@#$%^&*]/.test(password) },
  ]

  return (
    <div className='text-sm text-gray-600 mt-2'>
      <p className='font-medium'>Password must include:</p>
      <ul className='ml-4 list-disc'>
        {rules.map((rule, idx) => (
          <li
            key={idx}
            className={rule.valid ? 'text-green-600' : 'text-red-500'}
          >
            {rule.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PasswordHints
