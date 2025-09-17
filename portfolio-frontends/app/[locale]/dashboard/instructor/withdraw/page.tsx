'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'
import toast from 'react-hot-toast'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from 'components/ui/card'
import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from 'components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'components/ui/table'
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Loader2,
  Wallet2,
  CreditCard,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react'
import WithdrawalProgress from 'components/Dashboard/WithdrawalProgress'
import { Skeleton } from 'components/ui/skeleton'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

type WithdrawStatus =
  | 'pending'
  | 'approved'
  | 'processing'
  | 'completed'
  | 'rejected'

interface EarningsSummary {
  total: number
  today: number
  monthly: number
}

interface WithdrawStats {
  availableBalance: number
  totalWithdrawn: number
  pendingRequests: number
}

interface HistoryItem {
  id: string
  date: string
  amount: number
  method: 'bkash' | 'nagad' | 'bank'
  status: WithdrawStatus
}

const METHOD_LABEL: Record<'bkash' | 'nagad' | 'bank', string> = {
  bkash: 'Bkash',
  nagad: 'Nagad',
  bank: 'Bank Transfer',
}

const METHOD_PLACEHOLDER: Record<'bkash' | 'nagad' | 'bank', string> = {
  bkash: 'Enter your Bkash number (e.g. 01XXXXXXXXX)',
  nagad: 'Enter your Nagad number (e.g. 01XXXXXXXXX)',
  bank: 'Enter your Bank Account Number',
}

const MIN_WITHDRAWAL_AMOUNT = 100
const MIN_PAYOUT_THRESHOLD = 2000

const CURRENCY = (n: number) => `৳${(Number.isFinite(n) ? n : 0).toFixed(2)}`

const statusPill = (s: WithdrawStatus) => {
  switch (s) {
    case 'completed':
      return 'bg-emerald-100 text-emerald-700'
    case 'approved':
      return 'bg-blue-100 text-blue-700'
    case 'processing':
      return 'bg-indigo-100 text-indigo-700'
    case 'pending':
      return 'bg-amber-100 text-amber-800'
    case 'rejected':
      return 'bg-rose-100 text-rose-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export default function InstructorWithdrawPage() {
  const token = useSelector((s: RootState) => s.auth.token)
  const user = useSelector((s: RootState) => s.auth.user)

  const [stats, setStats] = useState<WithdrawStats>({
    availableBalance: 0,
    totalWithdrawn: 0,
    pendingRequests: 0,
  })
  const [earnings, setEarnings] = useState<EarningsSummary>({
    total: 0,
    today: 0,
    monthly: 0,
  })
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [method, setMethod] = useState<'bkash' | 'nagad' | 'bank' | ''>('')
  const [amount, setAmount] = useState('')
  const [accountDetails, setAccountDetails] = useState('')
  const [error, setError] = useState<string | null>(null)

  const controllerRef = useRef<AbortController | null>(null)

  const amountNum = useMemo(() => parseFloat(amount || '0'), [amount])
  const canSubmit =
    !!method &&
    !!accountDetails.trim() &&
    Number.isFinite(amountNum) &&
    amountNum >= MIN_WITHDRAWAL_AMOUNT &&
    amountNum <= stats.availableBalance &&
    !!token

  const fetchData = async () => {
    if (!token || !user?.id) {
      setLoading(false)
      setError('Please login to access this page')
      return
    }

    const controller = new AbortController()
    controllerRef.current = controller

    setLoading(true)
    setError(null)

    try {
      const [statsRes, earningsRes] = await Promise.all([
        fetch(`${baseURL}/instructor/stats`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        }),
        fetch(`${baseURL}/instructor/earnings`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        }),
      ])

      if (!statsRes.ok)
        throw new Error(`Failed to load stats (${statsRes.status})`)
      if (!earningsRes.ok)
        throw new Error(`Failed to load earnings (${earningsRes.status})`)

      const statsData = await statsRes.json()
      const earningsData = await earningsRes.json()

      setStats({
        availableBalance:
          (statsData?.totalEarnings || 0) - (statsData?.totalWithdrawn || 0),
        totalWithdrawn: statsData?.totalWithdrawn || 0,
        pendingRequests: statsData?.pendingRequests || 0,
      })

      setEarnings(earningsData?.summary || { total: 0, today: 0, monthly: 0 })

      const normalized: HistoryItem[] = (earningsData?.history || []).map(
        (h: any) => {
          let dateStr = ''
          if (h.createdAt) {
            // যদি already Date object না হয়, convert
            const d = new Date(h.createdAt)
            dateStr = isNaN(d.getTime())
              ? new Date().toISOString()
              : d.toISOString()
          } else {
            dateStr = new Date().toISOString()
          }

          return {
            id: h._id || `${dateStr}-${h.amount}`,
            date: dateStr,
            amount: Number(h.amount) || 0,
            method: (h.method || 'bkash') as 'bkash' | 'nagad' | 'bank',
            status: (h.status || 'pending') as WithdrawStatus,
          }
        }
      )
      setHistory(normalized)
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        console.error('Fetch error:', e)
        setError(e?.message || 'Failed to load data')
        toast.error(e?.message || 'Failed to load data')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    return () => {
      controllerRef.current?.abort()
    }
  }, [token, user?.id])

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error('Please fill all fields correctly.')
      return
    }

    const toastId = toast.loading('Submitting withdrawal request...')
    setSubmitting(true)

    try {
      const res = await fetch(`${baseURL}/instructor/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          method,
          amount: amountNum,
          accountDetails: accountDetails.trim(),
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || 'Withdrawal request failed')
      }

      toast.success('Withdrawal request submitted successfully!', {
        id: toastId,
      })
      resetForm()
      await fetchData()
    } catch (e: any) {
      console.error('Submission error:', e)
      toast.error(e?.message || 'Transaction failed', { id: toastId })
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setMethod('')
    setAmount('')
    setAccountDetails('')
  }

  if (loading) {
    return (
      <div className='p-6'>
        <Skeleton className='h-8 w-40' />
        <Skeleton className='h-40 w-full mt-4' />
      </div>
    )
  }
  if (error) {
    return (
      <div className='p-6'>
        <p className='text-red-500'>{error}</p>
        <Button onClick={fetchData}>Retry</Button>
      </div>
    )
  }

  return (
    <div className='p-6 space-y-8 max-w-6xl mx-auto'>
      {/* Header */}
      <header className='space-y-2'>
        <h1 className='text-2xl md:text-3xl font-bold tracking-tight'>
          Instructor Withdraw Earnings
        </h1>
        <p className='text-sm text-muted-foreground'>
          Track your payouts, request withdrawals, and follow progress in real
          time.
        </p>
      </header>

      {/* KPI Cards */}
      <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <Wallet2 className='h-5 w-5 text-primary' />
              <p className='text-sm text-muted-foreground'>Total Earnings</p>
            </div>
            <p className='mt-2 text-2xl font-semibold'>
              {CURRENCY(earnings.total)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <ShieldCheck className='h-5 w-5 text-blue-500' />
              <p className='text-sm text-muted-foreground'>Available Balance</p>
            </div>
            <p className='mt-2 text-2xl font-semibold text-blue-600'>
              {CURRENCY(stats.availableBalance)}
            </p>
            <p className='mt-2 text-xs text-muted-foreground'>
              Minimum payout: {CURRENCY(MIN_PAYOUT_THRESHOLD)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <TrendingUp className='h-5 w-5 text-purple-500' />
              <p className='text-sm text-muted-foreground'>Total Withdrawn</p>
            </div>
            <p className='mt-2 text-2xl font-semibold text-purple-600'>
              {CURRENCY(stats.totalWithdrawn)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <Clock3 className='h-5 w-5 text-amber-500' />
              <p className='text-sm text-muted-foreground'>Pending Requests</p>
            </div>
            <p className='mt-2 text-2xl font-semibold text-amber-600'>
              {stats.pendingRequests}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Withdraw Form */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Request Withdrawal</CardTitle>
            <CardDescription>
              Choose a method, enter amount and account details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 md:grid-cols-3'>
              <div className='space-y-2'>
                <label className='text-sm font-medium'>Method</label>
                <Select
                  value={method}
                  onValueChange={(v) => setMethod(v as any)}
                  disabled={submitting}
                >
                  <SelectTrigger>
                    <CreditCard className='mr-2 h-4 w-4' />
                    <SelectValue placeholder='Select Method' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='bkash'>{METHOD_LABEL.bkash}</SelectItem>
                    <SelectItem value='nagad'>{METHOD_LABEL.nagad}</SelectItem>
                    <SelectItem value='bank'>{METHOD_LABEL.bank}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium'>Amount</label>
                <Input
                  type='number'
                  inputMode='decimal'
                  min={MIN_WITHDRAWAL_AMOUNT}
                  step={100}
                  placeholder='e.g., 2000'
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={submitting}
                />
                <p className='text-xs text-muted-foreground'>
                  Minimum {CURRENCY(MIN_WITHDRAWAL_AMOUNT)} • Available:{' '}
                  {CURRENCY(stats.availableBalance)}
                </p>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium'>Account Details</label>
                <Input
                  type='text'
                  placeholder={
                    method ? METHOD_PLACEHOLDER[method] : 'Account Details'
                  }
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  disabled={submitting || !method}
                />
              </div>
            </div>

            <div className='mt-6 flex items-center justify-between flex-wrap gap-3'>
              <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                <AlertTriangle className='h-4 w-4' />
                <span>
                  Minimum payout threshold: {CURRENCY(MIN_PAYOUT_THRESHOLD)}
                </span>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                className='min-w-[180px]'
              >
                {submitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Processing...
                  </>
                ) : (
                  'Submit Request'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* History Table */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal History</CardTitle>
            <CardDescription>
              See status and progress for each request.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className='py-12 text-center'>
                <p className='text-muted-foreground'>
                  No withdrawal history yet.
                </p>
                <Button variant='outline' className='mt-4' onClick={fetchData}>
                  <RefreshCw className='mr-2 h-4 w-4' />
                  Refresh
                </Button>
              </div>
            ) : (
              <div className='rounded-md border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {item.date
                            ? new Date(item.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            : '-'}
                        </TableCell>

                        <TableCell>{CURRENCY(item.amount)}</TableCell>
                        <TableCell>{METHOD_LABEL[item.method]}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusPill(
                              item.status
                            )}`}
                          >
                            {item.status.charAt(0).toUpperCase() +
                              item.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className='max-w-[340px]'>
                          <WithdrawalProgress currentStatus={item.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
