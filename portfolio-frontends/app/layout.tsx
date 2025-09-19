// app/layout.tsx
import './globals.css'

export const metadata = {
  title: 'Md Imam Hossain Portfolio',
  description: 'Full-Stack Web Developer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      {/* dark class এখানে dynamically যোগ হবে JS দিয়ে */}
      <body className='bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300'>
        {children}
      </body>
    </html>
  )
}
