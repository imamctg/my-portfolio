// // components/ui/button.tsx

// import { cn } from 'lib/utils'
// import { ButtonHTMLAttributes, forwardRef } from 'react'

// export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?:
//     | 'default'
//     | 'outline'
//     | 'ghost'
//     | 'destructive'
//     | 'success'
//     | 'warning'
//   size?: 'sm' | 'md' | 'lg'
// }

// export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
//   (
//     { className, children, variant = 'default', size = 'md', ...props },
//     ref
//   ) => {
//     const base =
//       'inline-flex items-center justify-center font-medium transition-colors focus:outline-none'
//     const variants = {
//       default: 'bg-blue-600 text-white hover:bg-blue-700',
//       outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
//       ghost: 'text-gray-700 hover:bg-gray-100',
//     }
//     const sizes = {
//       sm: 'px-3 py-1 text-sm rounded',
//       md: 'px-4 py-2 text-base rounded-md',
//       lg: 'px-6 py-3 text-lg rounded-lg',
//     }

//     return (
//       <button
//         ref={ref}
//         className={cn(base, variants[variant], sizes[size], className)}
//         {...props}
//       >
//         {children}
//       </button>
//     )
//   }
// )

// Button.displayName = 'Button'

'use client'

import { cn } from 'lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import { Slot } from '@radix-ui/react-slot'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'default'
    | 'outline'
    | 'ghost'
    | 'destructive'
    | 'success'
    | 'warning'
    | 'secondary'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  isLoading?: boolean
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = 'default',
      size = 'md',
      isLoading = false,
      disabled,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'

    const base =
      'inline-flex items-center justify-center font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed rounded-md'

    const variants = {
      default: 'bg-blue-600 text-white hover:bg-blue-700',
      outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
      ghost: 'text-gray-700 hover:bg-gray-100',
      destructive: 'bg-red-600 text-white hover:bg-red-700',
      success: 'bg-green-600 text-white hover:bg-green-700',
      warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      icon: 'p-2',
    }

    return (
      <Comp
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
        {children}
      </Comp>
    )
  }
)

Button.displayName = 'Button'
