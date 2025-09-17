// // components/ui/card.tsx
// import { cn } from 'lib/utils'
// import { ReactNode } from 'react'

// interface CardProps {
//   children: ReactNode
//   className?: string
// }

// export function Card({ children, className }: CardProps) {
//   return (
//     <div className={cn('rounded-2xl border bg-white shadow-sm', className)}>
//       {children}
//     </div>
//   )
// }

// export function CardContent({
//   children,
//   className,
// }: {
//   children: ReactNode
//   className?: string
// }) {
//   return <div className={cn('p-6', className)}>{children}</div>
// }

// components/ui/card.tsx
import { cn } from 'lib/utils'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn('rounded-2xl border bg-white shadow-sm', className)}>
      {children}
    </div>
  )
}

export function CardHeader({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('border-b p-6', className)}>{children}</div>
}

export function CardTitle({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <h3 className={cn('text-lg font-semibold', className)}>{children}</h3>
}

export function CardDescription({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)}>{children}</p>
  )
}

export function CardContent({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('p-6', className)}>{children}</div>
}
