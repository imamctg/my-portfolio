import {
  FaTachometerAlt,
  FaChartBar,
  FaEnvelope,
  FaCog,
  FaFolderOpen,
  FaEnvelopeOpenText,
  FaUserTie,
  FaBell,
  FaPhotoVideo,
  FaQuoteRight,
  FaPenFancy,
  FaDollarSign,
  FaFileAlt,
} from 'react-icons/fa'
import { IconType } from 'react-icons'

export interface MenuItem {
  name: string
  href?: string
  icon?: IconType
  subItems?: MenuItem[]
}

export const menuByRole: Record<'admin', MenuItem[]> = {
  admin: [
    {
      name: 'Dashboard',
      href: '/dashboard/admin',
      icon: FaTachometerAlt, // KPIs overview
    },

    {
      name: 'Projects',
      icon: FaFolderOpen,
      subItems: [
        { name: 'All Projects', href: '/dashboard/admin/projects' },
        { name: 'Add New', href: '/dashboard/admin/projects/create' },
        { name: 'Drafts', href: '/dashboard/admin/projects?status=draft' },
        {
          name: 'Published',
          href: '/dashboard/admin/projects?status=published',
        },
        { name: 'Archived', href: '/dashboard/admin/projects?status=archived' },
      ],
    },

    {
      name: 'Clients & Inquiries',
      icon: FaUserTie,
      subItems: [
        { name: 'Client Inquiries', href: '/dashboard/admin/inquiries' },
        { name: 'Messages', href: '/dashboard/admin/messages' },
        { name: 'Contact Form Submissions', href: '/dashboard/admin/contact' },
      ],
    },

    {
      name: 'Analytics',
      icon: FaChartBar,
      subItems: [
        {
          name: 'Traffic Overview',
          href: '/dashboard/admin/analytics/traffic',
        },
        {
          name: 'CV Downloads',
          href: '/dashboard/admin/analytics/cv-downloads',
        },
        { name: 'Project Views', href: '/dashboard/admin/analytics/projects' },
      ],
    },

    {
      name: 'Revenue',
      icon: FaDollarSign,
      subItems: [
        { name: 'Earnings Overview', href: '/dashboard/admin/revenue' },
        { name: 'Invoices', href: '/dashboard/admin/invoices' },
        { name: 'Withdrawals', href: '/dashboard/admin/withdrawals' },
      ],
    },

    {
      name: 'Media Library',
      href: '/dashboard/admin/media',
      icon: FaPhotoVideo, // Manage images, PDFs, videos
    },
    {
      name: 'Hero',
      href: '/dashboard/admin/hero',
      icon: FaQuoteRight,
    },
    {
      name: 'Testimonials',
      href: '/dashboard/admin/testimonials',
      icon: FaQuoteRight,
    },

    {
      name: 'Skills',
      href: '/dashboard/admin/skills',
      icon: FaQuoteRight,
    },
    {
      name: 'CTA',
      href: '/dashboard/admin/cta',
      icon: FaQuoteRight,
    },
    {
      name: 'Service',
      href: '/dashboard/admin/service',
      icon: FaQuoteRight,
    },

    {
      name: 'Blog',
      icon: FaPenFancy,
      subItems: [
        { name: 'All Posts', href: '/dashboard/admin/blog' },
        { name: 'New Post', href: '/dashboard/admin/blog/new' },
        { name: 'Categories', href: '/dashboard/admin/blog/categories' },
      ],
    },

    {
      name: 'CV & Documents',
      icon: FaFileAlt,
      subItems: [
        { name: 'Manage CV', href: '/dashboard/admin/cv' },
        { name: 'Other Docs', href: '/dashboard/admin/docs' },
      ],
    },

    {
      name: 'Notifications',
      href: '/dashboard/admin/notifications',
      icon: FaBell,
    },

    {
      name: 'Settings',
      icon: FaCog,
      subItems: [
        { name: 'Profile', href: '/dashboard/admin/settings/profile' },
        { name: 'Site Branding', href: '/dashboard/admin/settings/site' },
        { name: 'Social Links', href: '/dashboard/admin/settings/social' },
        { name: 'Security', href: '/dashboard/admin/settings/security' },
      ],
    },
  ],
}
