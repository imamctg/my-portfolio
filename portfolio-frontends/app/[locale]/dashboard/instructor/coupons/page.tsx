'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'
import { Coupon } from 'types/coupon'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function CouponsPage() {
  const user = useSelector((state: RootState) => state.auth.user)
  const token = useSelector((state: RootState) => state.auth.token)

  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [courses, setCourses] = useState<{ _id: string; title: string }[]>([])
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [code, setCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [discountType, setDiscountType] = useState<'flat' | 'percentage'>(
    'flat'
  )
  const [expiresAt, setExpiresAt] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  }

  // Fetch coupons and courses
  useEffect(() => {
    if (!token || !user?.id) return
    fetchData()
  }, [token, user?.id])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [couponsRes, coursesRes] = await Promise.all([
        axios.get(`${baseURL}/coupon`, authHeader),
        axios.get(`${baseURL}/courses/${user.id}/courses`, authHeader),
      ])
      setCoupons(couponsRes.data || [])
      setCourses(coursesRes.data.courses || [])
    } catch (error) {
      toast.error('Failed to load coupons or courses')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code || !discount || !expiresAt) {
      return toast.error('All fields are required')
    }

    // ✅ percentage discount max 20%
    if (discountType === 'percentage' && discount > 20) {
      return toast.error('Maximum percentage discount allowed is 20%')
    }

    // ✅ flat discount এর জন্য validation
    if (discountType === 'flat' && selectedCourses.length > 0) {
      try {
        const coursePrices = await Promise.all(
          selectedCourses.map(async (slug) => {
            const res = await axios.get(`${baseURL}/courses/${slug}`)
            // console.log(res.data.data, 'res')
            console.log(res.data.data.price, 'res.data.price')
            return res.data.data.price
          })
        )

        const minCoursePrice = Math.min(...coursePrices)
        const maxAllowedFlatDiscount = minCoursePrice * 0.2

        if (discount > maxAllowedFlatDiscount) {
          return toast.error(
            `Flat discount cannot exceed 20% of the lowest course price. Max allowed: ৳${maxAllowedFlatDiscount}`
          )
        }
      } catch (err) {
        return toast.error('Failed to validate course prices')
      }
    }

    try {
      await axios.post(
        `${baseURL}/coupon`,
        {
          code,
          discount,
          discountType,
          expiresAt,
          applicableCourses: selectedCourses.length
            ? selectedCourses
            : undefined,
        },
        authHeader
      )
      toast.success('Coupon created')
      setCode('')
      setDiscount(0)
      setExpiresAt('')
      setSelectedCourses([])
      fetchData()
    } catch {
      toast.error('Failed to create coupon')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return
    try {
      await axios.delete(`${baseURL}/coupon/${id}`, authHeader)
      toast.success('Coupon deleted')
      fetchData()
    } catch {
      toast.error('Failed to delete coupon')
    }
  }

  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className='p-6 space-y-8'>
      <h2 className='text-2xl font-bold text-gray-800'>💸 Coupons</h2>

      {/* Create Coupon Form */}
      <form
        onSubmit={handleCreate}
        className='bg-white p-4 rounded-lg shadow flex flex-col md:flex-wrap md:flex-row items-center gap-4'
      >
        <input
          type='text'
          placeholder='Code (e.g., NEW20)'
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className='border rounded p-2 w-full md:w-1/4'
        />
        <input
          type='number'
          placeholder='Discount (%)'
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
          className='border rounded p-2 w-full md:w-1/4'
        />
        <select
          value={discountType}
          onChange={(e) =>
            setDiscountType(e.target.value as 'flat' | 'percentage')
          }
          className='border rounded p-2 w-full md:w-1/4'
        >
          <option value='flat'>Flat</option>
          <option value='percentage'>Percentage</option>
        </select>
        <input
          type='date'
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          className='border rounded p-2 w-full md:w-1/4'
        />
        <select
          multiple
          value={selectedCourses}
          onChange={(e) =>
            setSelectedCourses(
              Array.from(e.target.selectedOptions, (opt) => opt.value)
            )
          }
          className='border rounded p-2 w-full md:w-1/4'
        >
          <option disabled>-- Select courses (optional) --</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>
        <button
          type='submit'
          className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full md:w-auto'
        >
          Create
        </button>
      </form>

      {/* Search Input */}
      <input
        type='text'
        placeholder='Search coupons...'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='border p-2 rounded w-full md:w-1/3'
      />

      {/* Coupons List */}
      {loading ? (
        <p className='text-gray-500 text-sm'>Loading coupons...</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {filteredCoupons.map((coupon) => (
            <div
              key={coupon._id}
              className='bg-white p-4 rounded shadow flex flex-col justify-between'
            >
              <div>
                <h4 className='text-lg font-semibold text-gray-800'>
                  {coupon.code}
                </h4>
                <p className='text-sm text-gray-600'>
                  Discount:{' '}
                  {coupon.discountType === 'flat'
                    ? `৳${coupon.discount}`
                    : `${coupon.discount}%`}
                </p>
                <p className='text-sm text-gray-600'>
                  Expiry:{' '}
                  <span
                    className={`font-medium ${
                      new Date(coupon.expiresAt) < new Date()
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`}
                  >
                    {format(new Date(coupon.expiresAt), 'dd MMM yyyy')}
                  </span>
                </p>
              </div>
              <button
                onClick={() => handleDelete(coupon._id)}
                className='mt-4 text-red-600 hover:underline text-sm self-end'
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredCoupons.length === 0 && (
        <p className='text-gray-500 text-sm'>No coupons found.</p>
      )}
    </div>
  )
}
