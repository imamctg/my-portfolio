'use client'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'features/redux/store'
import { useState, useEffect, ComponentType } from 'react'
import {
  FaChevronDown,
  FaChevronUp,
  FaThLarge,
  FaSignOutAlt,
} from 'react-icons/fa'
import { menuByRole } from 'utils/dashboardMenu'
import { logout } from 'features/auth/redux/authSlice'

export interface MenuItem {
  name: string
  href?: string
  icon?: ComponentType<{ className?: string }>
  subItems?: MenuItem[]
}

export default function DashboardSidebar() {
  const pathname = usePathname()
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.auth.user)
  const [mounted, setMounted] = useState(false)
  const [openMenus, setOpenMenus] = useState<string[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const params = useParams()
  const courseId = params?.courseId

  // ✅ Only render on client to prevent hydration mismatch
  useEffect(() => setMounted(true), [])

  const role = user?.role as keyof typeof menuByRole
  const menuItems = role ? menuByRole[role] : []

  const toggleMenu = (menuName: string) => {
    setOpenMenus((prev) =>
      prev.includes(menuName)
        ? prev.filter((item) => item !== menuName)
        : [...prev, menuName]
    )
  }

  const handleLogout = () => {
    dispatch(logout())
    window.location.href = '/auth/login'
  }

  if (!mounted) return null // render nothing on server

  return (
    <>
      {/* Toggle Button for mobile */}
      <div className='fixed top-4 left-4 z-50 md:hidden'>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className='text-white bg-gray-900 p-2 rounded-md'
        >
          <FaThLarge className='w-5 h-5' />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-40 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:block`}
      >
        <div className='h-full flex flex-col justify-between'>
          <div className='p-4 overflow-y-auto flex-1'>
            <div className='pt-16 md:pt-0 mb-4 border-b border-gray-700 pb-4'>
              <h2 className='text-lg font-semibold'>
                {user?.name || 'Welcome'}
              </h2>
              <p className='text-sm text-gray-400'>{user?.email || ''}</p>
            </div>

            <h3 className='text-xl font-bold mb-4 capitalize'>
              {role ? `${role} Panel` : 'Panel'}
            </h3>

            <nav className='space-y-1'>
              {menuItems.map((item, index) => {
                const itemKey = `${item.name}-${index}`
                const isActive =
                  pathname === item.href ||
                  (item.subItems &&
                    item.subItems.some(
                      (sub) =>
                        sub.href === pathname ||
                        (sub.subItems &&
                          sub.subItems.some(
                            (nested) => nested.href === pathname
                          ))
                    ))

                // Nested menu rendering
                if (item.subItems) {
                  return (
                    <div key={itemKey}>
                      <button
                        onClick={() => toggleMenu(item.name)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
                          isActive ? 'bg-gray-800' : 'hover:bg-gray-800'
                        }`}
                      >
                        <div className='flex items-center gap-3'>
                          {item.icon && <item.icon className='w-5 h-5' />}
                          <span>{item.name}</span>
                        </div>
                        {openMenus.includes(item.name) ? (
                          <FaChevronUp className='w-4 h-4' />
                        ) : (
                          <FaChevronDown className='w-4 h-4' />
                        )}
                      </button>

                      {openMenus.includes(item.name) && (
                        <div className='ml-6 space-y-1'>
                          {item.subItems.map((sub, subIndex) => {
                            const subKey = `${itemKey}-${sub.name}-${subIndex}`
                            const isSubActive =
                              pathname === sub.href ||
                              (sub.subItems &&
                                sub.subItems.some(
                                  (nested) => nested.href === pathname
                                ))

                            if (sub.subItems) {
                              return (
                                <div key={subKey}>
                                  <button
                                    onClick={() => toggleMenu(sub.name)}
                                    className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition ${
                                      isSubActive
                                        ? 'bg-gray-700'
                                        : 'hover:bg-gray-700'
                                    }`}
                                  >
                                    <span>{sub.name}</span>
                                    {openMenus.includes(sub.name) ? (
                                      <FaChevronUp className='w-3 h-3' />
                                    ) : (
                                      <FaChevronDown className='w-3 h-3' />
                                    )}
                                  </button>

                                  {openMenus.includes(sub.name) && (
                                    <div className='ml-4 space-y-1'>
                                      {sub.subItems.map(
                                        (nestedSub, nestedIndex) => {
                                          const nestedKey = `${subKey}-${nestedSub.name}-${nestedIndex}`
                                          const isNestedActive =
                                            pathname === nestedSub.href
                                          return nestedSub.href ? (
                                            <Link
                                              key={nestedKey}
                                              href={nestedSub.href}
                                              className={`block px-4 py-2 rounded-lg transition ${
                                                isNestedActive
                                                  ? 'bg-indigo-800 text-white font-semibold'
                                                  : 'hover:bg-gray-600'
                                              }`}
                                            >
                                              {nestedSub.name}
                                            </Link>
                                          ) : (
                                            <span
                                              key={nestedKey}
                                              className='block px-4 py-2 text-gray-400 cursor-default'
                                            >
                                              {nestedSub.name}
                                            </span>
                                          )
                                        }
                                      )}
                                    </div>
                                  )}
                                </div>
                              )
                            }

                            return sub.href ? (
                              <Link
                                key={subKey}
                                href={sub.href}
                                className={`block px-4 py-2 rounded-lg transition ${
                                  pathname === sub.href
                                    ? 'bg-indigo-800 text-white font-semibold'
                                    : 'hover:bg-gray-700'
                                }`}
                              >
                                {sub.name}
                              </Link>
                            ) : (
                              <span
                                key={subKey}
                                className='block px-4 py-2 text-gray-400 cursor-default'
                              >
                                {sub.name}
                              </span>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                }

                return (
                  <Link
                    key={itemKey}
                    href={item.href || '#'}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      pathname === item.href
                        ? 'bg-indigo-800 text-white font-semibold'
                        : 'hover:bg-gray-800'
                    }`}
                  >
                    {item.icon && <item.icon className='w-5 h-5' />}
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Logout */}
          <div className='p-4 border-t border-gray-700'>
            <button
              onClick={handleLogout}
              className='w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition'
            >
              <FaSignOutAlt className='w-4 h-4' />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
