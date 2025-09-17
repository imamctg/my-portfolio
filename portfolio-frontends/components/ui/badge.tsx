import { cn } from 'lib/utils'
import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'secondary'
  className?: string
}

export function Badge({
  children,
  variant = 'default',
  className,
}: BadgeProps) {
  const base =
    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold'

  const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
    default: 'bg-gray-200 text-gray-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    secondary: 'bg-blue-100 text-blue-800', // ✅ নতুন variant
  }

  return (
    <span className={cn(base, variants[variant], className)}>{children}</span>
  )
}
