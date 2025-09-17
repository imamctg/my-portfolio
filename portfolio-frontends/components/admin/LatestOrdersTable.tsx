interface Order {
  orderId: string
  user: string
  course: string
  amount: number
  status: 'Paid' | 'Pending' | 'Refunded'
  date: string
}

interface Props {
  orders: Order[]
}

const LatestOrdersTable: React.FC<Props> = ({ orders }) => {
  const statusColors = {
    Paid: 'text-green-600 bg-green-100',
    Pending: 'text-yellow-600 bg-yellow-100',
    Refunded: 'text-red-600 bg-red-100',
  }

  return (
    <div className='bg-white p-6 rounded-xl shadow-md mt-6'>
      <h2 className='text-xl font-semibold mb-4'>🧾 Recent Orders</h2>
      <div className='overflow-x-auto'>
        <table className='min-w-full table-auto text-sm text-left'>
          <thead className='bg-gray-100 text-gray-600'>
            <tr>
              <th className='px-4 py-2'>Order ID</th>
              <th className='px-4 py-2'>User</th>
              <th className='px-4 py-2'>Course</th>
              <th className='px-4 py-2'>Amount</th>
              <th className='px-4 py-2'>Status</th>
              <th className='px-4 py-2'>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index} className='border-b hover:bg-gray-50'>
                <td className='px-4 py-2'>{order.orderId}</td>
                <td className='px-4 py-2'>{order.user}</td>
                <td className='px-4 py-2'>{order.course}</td>
                <td className='px-4 py-2'>${order.amount}</td>
                <td className='px-4 py-2'>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      statusColors[order.status]
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className='px-4 py-2'>{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LatestOrdersTable
