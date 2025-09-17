'use client'

import { Withdrawal } from 'types/withdrawal'
import { Card, CardContent } from 'components/ui/card'
import { Badge } from 'components/ui/badge'
import { format } from 'date-fns'
import { Copy } from 'lucide-react'
import axios from 'axios'
import { useState } from 'react'
import WithdrawalProgress from './WithdrawalProgress'
// import WithdrawalProgress from './WithdrawalProgress'

interface Props {
  withdrawals: Withdrawal[]
  token: string
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function WithdrawalsTable({ withdrawals, token }: Props) {
  const [localWithdrawals, setLocalWithdrawals] = useState(withdrawals)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Account details copied!')
  }

  if (!localWithdrawals.length) {
    return (
      <Card>
        <CardContent className='p-6 text-center text-muted-foreground'>
          No withdrawals found.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='overflow-x-auto rounded-lg border'>
      <table className='w-full border-collapse text-sm'>
        <thead className='bg-muted'>
          <tr>
            <th className='p-3 text-left'>User</th>
            <th className='p-3 text-left'>Email</th>
            <th className='p-3 text-left'>Amount</th>
            <th className='p-3 text-left'>Method</th>
            <th className='p-3 text-left'>Account</th>
            <th className='p-3 text-left'>Status</th>
            <th className='p-3 text-left'>Date</th>
            <th className='p-3 text-left'>Progress</th>
          </tr>
        </thead>
        <tbody>
          {localWithdrawals.map((w) => (
            <tr key={w._id} className='border-t hover:bg-muted/30'>
              <td className='p-3 font-medium'>{w.user?.name || 'N/A'}</td>
              <td className='p-3'>{w.user?.email}</td>
              <td className='p-3'>৳{w.amount.toFixed(2)}</td>
              <td className='p-3'>{w.method}</td>
              <td className='p-3 flex items-center gap-2'>
                {w.accountDetails || 'N/A'}
                {w.accountDetails && (
                  <button
                    className='p-1 rounded hover:bg-muted/50'
                    onClick={() => handleCopy(w.accountDetails)}
                  >
                    <Copy className='h-4 w-4 text-muted-foreground' />
                  </button>
                )}
              </td>
              <td className='p-3'>
                <select
                  value={w.status}
                  onChange={async (e) => {
                    const newStatus = e.target.value as Withdrawal['status']
                    if (!token) return
                    try {
                      await axios.put(
                        `${baseURL}/withdraw/${w._id}/status`,
                        { status: newStatus },
                        { headers: { Authorization: `Bearer ${token}` } }
                      )
                      setLocalWithdrawals((prev) =>
                        prev.map((item) =>
                          item._id === w._id
                            ? { ...item, status: newStatus }
                            : item
                        )
                      )
                    } catch (err) {
                      console.error(err)
                      alert('Failed to update status')
                    }
                  }}
                  className='border rounded px-2 py-1 text-sm'
                >
                  <option value='pending'>Pending</option>
                  <option value='approved'>Approved</option>
                  <option value='processing'>Processing</option>
                  <option value='completed'>Completed</option>
                  <option value='rejected'>Rejected</option>
                </select>
              </td>
              <td className='p-3'>
                {format(new Date(w.createdAt), 'dd MMM yyyy, hh:mm a')}
              </td>
              <td className='p-3 align-top'>
                <WithdrawalProgress currentStatus={w.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// export default function WithdrawalsTable({ withdrawals, token }: Props) {
//   const [localWithdrawals, setLocalWithdrawals] = useState(withdrawals)

//   const handleCopy = (text: string) => {
//     navigator.clipboard.writeText(text)
//     alert('Account details copied!')
//   }

//   if (!localWithdrawals.length) {
//     return (
//       <Card>
//         <CardContent className='p-6 text-center text-muted-foreground'>
//           No withdrawals found.
//         </CardContent>
//       </Card>
//     )
//   }

//   return (
//     <div className='overflow-x-auto rounded-lg border'>
//       <table className='w-full border-collapse text-sm'>
//         <thead className='bg-muted'>
//           <tr>
//             <th className='p-3 text-left'>Amount</th>
//             <th className='p-3 text-left'>Method</th>
//             <th className='p-3 text-left'>Request Date</th>
//             <th className='p-3 text-left'>Status</th>
//             <th className='p-3 text-left'>Progress</th>
//           </tr>
//         </thead>
//         <tbody>
//           {localWithdrawals.map((w) => (
//             <tr key={w._id} className='border-t hover:bg-muted/30'>
//               <td className='p-3'>৳{w.amount.toFixed(2)}</td>
//               <td className='p-3'>{w.method}</td>
//               <td className='p-3'>
//                 {format(new Date(w.createdAt), 'dd MMM yyyy')}
//               </td>
//               <td className='p-3'>
//                 <Badge
//                   variant={
//                     w.status === 'completed'
//                       ? 'success'
//                       : w.status === 'rejected'
//                       ? 'danger'
//                       : 'secondary'
//                   }
//                 >
//                   {w.status}
//                 </Badge>
//               </td>
//               <td className='p-3 min-w-[300px]'>
//                 <WithdrawalProgress currentStatus={w.status} />
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }
