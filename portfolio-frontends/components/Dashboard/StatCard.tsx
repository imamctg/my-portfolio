interface Props {
  title: string
  value: number | undefined
  color: string
}

export const StatCard = ({ title, value, color }: Props) => (
  <div className='flex items-center gap-4 p-5 rounded-xl shadow-md hover:shadow-xl transition transform hover:scale-105 bg-white dark:bg-gray-800'>
    <div
      className={`p-3 rounded-lg ${color} flex items-center justify-center text-xl`}
    >
      📊
    </div>
    <div>
      <p className='text-gray-500 dark:text-gray-300 font-medium'>{title}</p>
      <p className='text-2xl font-bold text-gray-900 dark:text-white'>
        {value ?? '—'}
      </p>
    </div>
  </div>
)
