'use client'

import { cn } from 'lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  if (totalPages <= 1) return null

  const pages = []
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i)
  }

  return (
    <div className='flex justify-center'>
      <nav className='inline-flex items-center border border-gray-300 rounded-md shadow-sm'>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className='px-3 py-1.5 text-sm bg-white border-r border-gray-300 hover:bg-gray-100 disabled:opacity-50'
        >
          <ChevronLeft className='w-4 h-4' />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              'px-4 py-1.5 text-sm font-medium border-r border-gray-300',
              page === currentPage
                ? 'bg-indigo-600 text-white'
                : 'bg-white hover:bg-gray-100 text-gray-700'
            )}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className='px-3 py-1.5 text-sm bg-white hover:bg-gray-100 disabled:opacity-50'
        >
          <ChevronRight className='w-4 h-4' />
        </button>
      </nav>
    </div>
  )
}
