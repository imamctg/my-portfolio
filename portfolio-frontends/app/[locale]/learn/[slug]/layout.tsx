// app/learn/[courseId]/layout.tsx

import React from 'react'

export default function CoursePlayerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {/* Optional Navbar */}
      <main>{children}</main>
      {/* Optional Footer */}
    </div>
  )
}
