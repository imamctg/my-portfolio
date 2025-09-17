// components/ui/Select.tsx
import { useState } from 'react'

interface SelectOption {
  value: string | number
  label: string
}

interface SelectProps {
  options: {
    value: string // শুধুমাত্র string টাইপ অনুমোদিত
    label: string
  }[]
  value: string
  onChange: (value: string) => void // শুধুমাত্র string টাইপ একসেপ্ট করবে
  placeholder?: string
  className?: string
}

export function Select({
  options,
  value,
  onChange,
  placeholder,
  className = '',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = options.find((option) => option.value === value)

  return (
    <div className={`relative ${className}`}>
      <button
        type='button'
        className='w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption?.label || placeholder || 'Select...'}</span>
        <svg
          className={`h-5 w-5 text-gray-400 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
          fill='currentColor'
          aria-hidden='true'
        >
          <path
            fillRule='evenodd'
            d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
            clipRule='evenodd'
          />
        </svg>
      </button>

      {isOpen && (
        <div className='absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
          <div className='max-h-60 overflow-auto'>
            {options.map((option) => (
              <button
                key={option.value}
                className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${
                  value === option.value ? 'bg-blue-100 text-blue-800' : ''
                }`}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
