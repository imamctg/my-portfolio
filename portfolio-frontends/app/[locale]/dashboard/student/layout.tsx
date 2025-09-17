// app/dashboard/user/layout.tsx
import DashboardSidebar from 'components/Dashboard/DashboardSidebar'

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex'>
      {/* <DashboardSidebar /> */}
      <main className='flex-1 p-4'>{children}</main>
    </div>
  )
}
