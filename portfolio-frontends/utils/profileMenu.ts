// utils/profileMenu.ts
import {
  FaUser,
  FaBook,
  FaEnvelope,
  FaCreditCard,
  FaHistory,
  FaCog,
  FaSignOutAlt,
  FaTachometerAlt,
  FaChartLine,
  FaUsers,
  FaFileAlt,
  FaStar,
  FaQuestionCircle,
} from 'react-icons/fa'
import { IconType } from 'react-icons'

export interface ProfileMenuItem {
  name: string
  href: string
  icon: IconType
}

export const getProfileMenuByRole = (role: string): ProfileMenuItem[] => {
  const commonItems = [
    // {
    //   name: 'My Profile',
    //   href: `/dashboard/${role}/profile`,
    //   icon: FaUser,
    // },
    {
      name: 'Account Settings',
      href: `/dashboard/${role}/account-settings`,
      icon: FaCog,
    },
    {
      name: 'Logout',
      href: '#logout',
      icon: FaSignOutAlt,
    },
  ]

  const roleSpecificItems: Record<string, ProfileMenuItem[]> = {
    student: [
      {
        name: 'My Courses',
        href: '/dashboard/student/my-courses',
        icon: FaBook,
      },
      {
        name: 'Messages',
        href: '/dashboard/student/messages',
        icon: FaEnvelope,
      },
      {
        name: 'Payment Methods',
        href: '/dashboard/student/payment-method',
        icon: FaCreditCard,
      },
      {
        name: 'Purchase History',
        href: '/dashboard/student/purchase-history',
        icon: FaHistory,
      },
    ],
    instructor: [
      {
        name: 'Dashboard',
        href: '/dashboard/instructor',
        icon: FaTachometerAlt,
      },
      {
        name: 'Earnings',
        href: '/dashboard/instructor/earnings',
        icon: FaChartLine,
      },
      {
        name: 'Students',
        href: '/dashboard/instructor/students',
        icon: FaUsers,
      },
      {
        name: 'Certificates',
        href: '/dashboard/instructor/certificates',
        icon: FaFileAlt,
      },
      {
        name: 'Reviews',
        href: '/dashboard/instructor/reviews',
        icon: FaStar,
      },
    ],
    admin: [
      {
        name: 'Admin Dashboard',
        href: '/dashboard/admin',
        icon: FaTachometerAlt,
      },
      {
        name: 'User Management',
        href: '/dashboard/admin/users',
        icon: FaUsers,
      },
      {
        name: 'Revenue Reports',
        href: '/dashboard/admin/revenue',
        icon: FaChartLine,
      },
    ],
    moderator: [
      {
        name: 'Moderation Dashboard',
        href: '/dashboard/moderator',
        icon: FaTachometerAlt,
      },
      {
        name: 'Content Review',
        href: '/dashboard/moderator/content-review',
        icon: FaFileAlt,
      },
      {
        name: 'Reported Issues',
        href: '/dashboard/moderator/reported-issues',
        icon: FaQuestionCircle,
      },
    ],
  }

  return [...(roleSpecificItems[role] || []), ...commonItems]
}
