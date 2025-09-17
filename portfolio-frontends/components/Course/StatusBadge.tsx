// src/components/course/StatusBadge.tsx
const statusColors = {
  draft: 'bg-gray-200 text-gray-800',
  under_review: 'bg-blue-200 text-blue-800',
  approved: 'bg-green-200 text-green-800',
  published: 'bg-purple-200 text-purple-800',
  changes_requested: 'bg-yellow-200 text-yellow-800',
  rejected: 'bg-red-200 text-red-800',
  archived: 'bg-gray-400 text-gray-800',
}

const statusLabels = {
  draft: 'Draft',
  under_review: 'Under Review',
  approved: 'Approved',
  published: 'Published',
  changes_requested: 'Changes Requested',
  rejected: 'Rejected',
  archived: 'Archived',
}

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        statusColors[status] || 'bg-gray-200 text-gray-800'
      }`}
    >
      {statusLabels[status] || status}
    </span>
  )
}
