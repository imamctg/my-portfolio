// utils/roleUtils.ts
export const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'admin':
      return 'bg-red-100 text-red-800'
    case 'instructor':
      return 'bg-blue-100 text-blue-800'
    case 'student':
      return 'bg-green-100 text-green-800'
    case 'moderator':
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export const getRoleDisplayName = (role: string) => {
  switch (role) {
    case 'admin':
      return 'Administrator'
    case 'instructor':
      return 'Instructor'
    case 'student':
      return 'Student'
    case 'moderator':
      return 'Moderator'
    default:
      return role
  }
}
