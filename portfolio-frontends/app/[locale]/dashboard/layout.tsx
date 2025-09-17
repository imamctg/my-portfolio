'use client'

import DashboardSidebar from 'components/Dashboard/DashboardSidebar'
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex min-h-screen bg-gray-100'>
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main content */}
      <main className='flex-1 md:ml-10 p-4 overflow-y-auto'>{children}</main>
    </div>
  )
}
