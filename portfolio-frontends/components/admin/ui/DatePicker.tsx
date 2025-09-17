// components/ui/DatePicker.tsx
import { useState } from 'react'
import { Calendar } from 'react-date-range'
import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css' // theme css file

interface CustomDateRange {
  start: Date | null
  end: Date | null
}
interface DatePickerProps {
  mode?: 'single' | 'range'
  selected?: Date | CustomDateRange
  onSelect: (date: CustomDateRange) => void // শুধুমাত্র CustomDateRange একসেপ্ট করবে
  className?: string
}

export function DatePicker({
  mode = 'single',
  selected,
  onSelect,
  className = '',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select date'
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type='button'
        className='w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
        onClick={() => setIsOpen(!isOpen)}
      >
        {mode === 'single' ? (
          <span>{formatDate(selected as Date)}</span>
        ) : (
          <span>
            {formatDate(
              (selected as { start: Date | null; end: Date | null })?.start
            )}{' '}
            -{' '}
            {formatDate(
              (selected as { start: Date | null; end: Date | null })?.end
            )}
          </span>
        )}
        <svg
          className='h-5 w-5 text-gray-400'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
          fill='currentColor'
          aria-hidden='true'
        >
          <path
            fillRule='evenodd'
            d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
            clipRule='evenodd'
          />
        </svg>
      </button>

      {isOpen && (
        <div className='absolute z-10 mt-1 bg-white shadow-lg rounded-md p-2 border border-gray-200'>
          {mode === 'single' ? (
            <Calendar
              date={selected as Date}
              onChange={(date) => {
                onSelect(date)
                setIsOpen(false)
              }}
            />
          ) : (
            <div>
              <div className='flex justify-between mb-2'>
                <span className='font-medium'>Start Date</span>
                <span className='font-medium'>End Date</span>
              </div>
              <div className='flex space-x-4'>
                <Calendar
                  date={
                    (selected as { start: Date | null; end: Date | null })
                      ?.start || new Date()
                  }
                  onChange={(date) =>
                    onSelect({
                      ...(selected as { start: Date | null; end: Date | null }),
                      start: date,
                    })
                  }
                />
                <Calendar
                  date={
                    (selected as { start: Date | null; end: Date | null })
                      ?.end || new Date()
                  }
                  onChange={(date) =>
                    onSelect({
                      ...(selected as { start: Date | null; end: Date | null }),
                      end: date,
                    })
                  }
                />
              </div>
              <div className='flex justify-end mt-2'>
                <button
                  type='button'
                  className='px-4 py-2 bg-blue-600 text-white rounded-md text-sm'
                  onClick={() => setIsOpen(false)}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
