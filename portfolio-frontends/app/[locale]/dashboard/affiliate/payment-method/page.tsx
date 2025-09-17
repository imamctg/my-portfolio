'use client'

import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'
import { toast, Toaster } from 'react-hot-toast'
import {
  Plus,
  Pencil,
  Trash2,
  Wallet,
  Star,
  Loader2,
  ShieldCheck,
} from 'lucide-react'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

type MethodType = 'bkash' | 'nagad' | 'bank'

type PaymentMethod = {
  _id?: string
  type: MethodType
  isDefault?: boolean
  // common
  mobileNumber?: string
  // bank
  accountName?: string
  accountNumber?: string
  branchName?: string
  routingNumber?: string
}

const initialForm: PaymentMethod = {
  type: 'bkash',
  mobileNumber: '',
  accountName: '',
  accountNumber: '',
  branchName: '',
  routingNumber: '',
}

const bnToEnMap: Record<string, string> = {
  '০': '0',
  '১': '1',
  '২': '2',
  '৩': '3',
  '৪': '4',
  '৫': '5',
  '৬': '6',
  '৭': '7',
  '৮': '8',
  '৯': '9',
  '–': '-',
  '—': '-',
  '−': '-',
  ' ': '',
}

function bnToEnDigits(input: string) {
  return input
    ?.split('')
    .map((ch) => (bnToEnMap[ch] !== undefined ? bnToEnMap[ch] : ch))
    .join('')
    .trim()
}

function maskMobile(num?: string) {
  if (!num) return ''
  const clean = bnToEnDigits(num).replace(/[^\d-]/g, '')
  const digits = clean.replace(/-/g, '')
  if (digits.length < 4) return num
  return `${num.slice(0, Math.max(0, num.length - 4))}${'•'.repeat(4)}`
}

function labelOf(type: MethodType) {
  if (type === 'bkash') return 'bKash'
  if (type === 'nagad') return 'Nagad'
  return 'Bank'
}

export default function AffiliatePaymentMethodPage() {
  const token =
    useSelector((s: RootState) => s.auth.token) ||
    (typeof window !== 'undefined' && localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')!).token
      : null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [list, setList] = useState<PaymentMethod[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<PaymentMethod>(initialForm)
  const [filter, setFilter] = useState<'all' | MethodType>('all')

  const filteredList = useMemo(() => {
    if (filter === 'all') return list
    return list.filter((i) => i.type === filter)
  }, [list, filter])

  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${baseURL}/affiliate/payment-methods`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setList(res.data?.methods || [])
      } catch (e) {
        console.error(e)
        toast.error('Failed to load payment methods')
      } finally {
        setLoading(false)
      }
    }
    fetchList()
  }, [token])

  const openAdd = () => {
    setEditingId(null)
    setForm({ ...initialForm })
    setShowModal(true)
  }

  const openEdit = (pm: PaymentMethod) => {
    setEditingId(pm._id || null)
    setForm({
      _id: pm._id,
      type: pm.type,
      isDefault: pm.isDefault,
      mobileNumber: pm.mobileNumber || '',
      accountName: pm.accountName || '',
      accountNumber: pm.accountNumber || '',
      branchName: pm.branchName || '',
      routingNumber: pm.routingNumber || '',
    })
    setShowModal(true)
  }

  const validate = (): string[] => {
    const errs: string[] = []
    if (form.type === 'bkash' || form.type === 'nagad') {
      const mobile = bnToEnDigits(form.mobileNumber || '')
      if (!mobile) errs.push('Mobile number is required.')
      // allow patterns like 01816-155711 or 01816155711 (11 digits), optional hyphen
      if (!/^\d{5}-?\d{6}$/.test(mobile) && !/^\d{11}$/.test(mobile)) {
        errs.push(
          'Provide a valid 11-digit mobile number. Example: 01816-155711'
        )
      }
    } else if (form.type === 'bank') {
      if (!form.accountName?.trim()) errs.push('Account Name is required.')
      const accNum = bnToEnDigits(form.accountNumber || '')
      if (!accNum || !/^\d{6,20}$/.test(accNum)) {
        errs.push('Account Number must be 6-20 digits.')
      }
      if (!form.branchName?.trim()) errs.push('Branch Name is required.')
      if (form.routingNumber) {
        const rn = bnToEnDigits(form.routingNumber)
        if (rn && !/^\d{6,9}$/.test(rn)) {
          errs.push('Routing Number should be 6-9 digits (optional).')
        }
      }
      if (form.mobileNumber) {
        const m = bnToEnDigits(form.mobileNumber)
        if (m && !/^\d{11}$/.test(m)) {
          errs.push('Bank Mobile Number must be 11 digits (optional field).')
        }
      }
    }
    return errs
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (errs.length) {
      toast.error(errs[0])
      return
    }

    const payload: PaymentMethod = {
      type: form.type,
      mobileNumber:
        form.type !== 'bank'
          ? bnToEnDigits(form.mobileNumber || '').replace(/[^\d-]/g, '')
          : bnToEnDigits(form.mobileNumber || '').replace(/[^\d]/g, ''),
      accountName: form.type === 'bank' ? form.accountName?.trim() : undefined,
      accountNumber:
        form.type === 'bank'
          ? bnToEnDigits(form.accountNumber || '').replace(/[^\d]/g, '')
          : undefined,
      branchName: form.type === 'bank' ? form.branchName?.trim() : undefined,
      routingNumber:
        form.type === 'bank'
          ? bnToEnDigits(form.routingNumber || '').replace(/[^\d]/g, '')
          : undefined,
    }

    try {
      setSaving(true)
      if (editingId) {
        const res = await axios.put(
          `${baseURL}/affiliate/payment-methods/${editingId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const updated: PaymentMethod = res.data?.method
        setList((prev) => prev.map((i) => (i._id === editingId ? updated : i)))
        toast.success('Payment method updated')
      } else {
        const res = await axios.post(
          `${baseURL}/affiliate/payment-methods`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const created: PaymentMethod = res.data?.method
        setList((prev) => [created, ...prev])
        toast.success('Payment method added')
      }
      setShowModal(false)
      setEditingId(null)
      setForm({ ...initialForm })
    } catch (e) {
      console.error(e)
      toast.error('Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id?: string) => {
    if (!id) return
    const ok = window.confirm('Delete this payment method?')
    if (!ok) return
    try {
      await axios.delete(`${baseURL}/affiliate/payment-methods/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setList((prev) => prev.filter((i) => i._id !== id))
      toast.success('Deleted')
    } catch (e) {
      console.error(e)
      toast.error('Delete failed')
    }
  }

  const setDefault = async (id?: string) => {
    if (!id) return
    try {
      await axios.patch(
        `${baseURL}/affiliate/payment-methods/${id}/default`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setList((prev) => prev.map((i) => ({ ...i, isDefault: i._id === id })))
      toast.success('Set as default')
    } catch (e) {
      console.error(e)
      toast.error('Failed to set default')
    }
  }

  const MethodCard: React.FC<{ item: PaymentMethod }> = ({ item }) => {
    const isBank = item.type === 'bank'
    return (
      <div className='rounded-2xl border p-4 hover:shadow-md transition bg-white'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center'>
              <Wallet className='h-5 w-5' />
            </div>
            <div>
              <div className='font-semibold'>
                {labelOf(item.type)}
                {item.isDefault && (
                  <span className='ml-2 inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700'>
                    <ShieldCheck className='h-3 w-3 mr-1' /> Default
                  </span>
                )}
              </div>
              <div className='text-sm text-gray-600'>
                {isBank ? (
                  <>
                    {item.accountName} • A/C {item.accountNumber}
                    {item.branchName ? ` • ${item.branchName}` : ''}
                    {item.routingNumber ? ` • RN ${item.routingNumber}` : ''}
                    {item.mobileNumber
                      ? ` • M ${maskMobile(item.mobileNumber)}`
                      : ''}
                  </>
                ) : (
                  <>
                    {labelOf(item.type)} Number: {maskMobile(item.mobileNumber)}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            {!item.isDefault && (
              <button
                onClick={() => setDefault(item._id)}
                className='inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border hover:bg-gray-50'
              >
                <Star className='h-4 w-4' /> Set Default
              </button>
            )}
            <button
              onClick={() => openEdit(item)}
              className='inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border hover:bg-gray-50'
            >
              <Pencil className='h-4 w-4' /> Edit
            </button>
            <button
              onClick={() => handleDelete(item._id)}
              className='inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-red-600 hover:bg-red-50'
            >
              <Trash2 className='h-4 w-4' /> Delete
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-4xl mx-auto p-6 mt-10'>
      <Toaster position='top-right' />
      <div className='mb-6'>
        <h1 className='text-3xl font-semibold'>💳 Affiliate Payment Methods</h1>
        <p className='text-gray-600 mt-1'>
          আপনার আয় **withdraw** করার মাধ্যম যোগ করুন: bKash, Nagad, অথবা Bank.
        </p>
      </div>

      {/* Actions / Filters */}
      <div className='flex flex-wrap items-center gap-3 mb-6'>
        <button
          onClick={openAdd}
          className='inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700'
        >
          <Plus className='h-4 w-4' /> Add Method
        </button>

        <div className='ml-auto flex items-center gap-2'>
          <span className='text-sm text-gray-600'>Filter:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className='border rounded-lg px-3 py-2'
          >
            <option value='all'>All</option>
            <option value='bkash'>bKash</option>
            <option value='nagad'>Nagad</option>
            <option value='bank'>Bank</option>
          </select>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className='flex items-center gap-2 text-gray-600'>
          <Loader2 className='h-5 w-5 animate-spin' /> Loading methods...
        </div>
      ) : filteredList.length === 0 ? (
        <div className='rounded-2xl border p-8 text-center text-gray-600 bg-white'>
          কোনো পেমেন্ট মেথড নেই। <br />
          <button onClick={openAdd} className='mt-3 underline text-green-700'>
            এখনই একটি যোগ করুন
          </button>
        </div>
      ) : (
        <div className='grid gap-3'>
          {filteredList.map((item) => (
            <MethodCard key={item._id} item={item} />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30'>
          <div className='w-full max-w-xl bg-white rounded-2xl p-6 shadow-lg'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-semibold'>
                {editingId ? 'Edit Payment Method' : 'Add Payment Method'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className='px-3 py-1 rounded-lg border hover:bg-gray-50'
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSave} className='space-y-4'>
              {/* Type */}
              <div className='grid sm:grid-cols-3 gap-2'>
                {(['bkash', 'nagad', 'bank'] as MethodType[]).map((t) => (
                  <button
                    type='button'
                    key={t}
                    onClick={() => setForm((prev) => ({ ...prev, type: t }))}
                    className={`px-3 py-2 rounded-xl border text-sm ${
                      form.type === t
                        ? 'bg-green-600 text-white border-green-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {labelOf(t)}
                  </button>
                ))}
              </div>

              {/* Fields for bkash/nagad */}
              {(form.type === 'bkash' || form.type === 'nagad') && (
                <div className='space-y-2'>
                  <label className='block text-sm font-medium'>
                    {labelOf(form.type)} Number
                  </label>
                  <input
                    type='text'
                    inputMode='numeric'
                    className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                    placeholder='উদাহরণ: 01711123456'
                    value={form.mobileNumber || ''}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        mobileNumber: e.target.value,
                      }))
                    }
                  />
                  <p className='text-xs text-gray-500'>
                    11 Digits Mobile Number (ex: 01711123456)
                  </p>
                </div>
              )}

              {/* Fields for bank */}
              {form.type === 'bank' && (
                <div className='grid gap-4'>
                  <div>
                    <label className='block text-sm font-medium'>
                      Account Name
                    </label>
                    <input
                      type='text'
                      className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                      value={form.accountName || ''}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          accountName: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium'>
                      Account Number
                    </label>
                    <input
                      type='text'
                      inputMode='numeric'
                      className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                      value={form.accountNumber || ''}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          accountNumber: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium'>
                      Branch Name
                    </label>
                    <input
                      type='text'
                      className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                      value={form.branchName || ''}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          branchName: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className='grid sm:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium'>
                        Routing Number{' '}
                        <span className='text-gray-400'>(optional)</span>
                      </label>
                      <input
                        type='text'
                        inputMode='numeric'
                        className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                        value={form.routingNumber || ''}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            routingNumber: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium'>
                        Mobile Number{' '}
                        <span className='text-gray-400'>(optional)</span>
                      </label>
                      <input
                        type='text'
                        inputMode='numeric'
                        className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                        value={form.mobileNumber || ''}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            mobileNumber: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className='flex items-center justify-end gap-3 pt-2'>
                <button
                  type='button'
                  onClick={() => setShowModal(false)}
                  className='px-4 py-2 rounded-xl border hover:bg-gray-50'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={saving}
                  className='px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:opacity-60 inline-flex items-center gap-2'
                >
                  {saving && <Loader2 className='h-4 w-4 animate-spin' />}
                  {editingId ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
