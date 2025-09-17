import axios from 'axios'
import { RootState } from 'features/redux/store'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { EarningsData } from 'types/earnings'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
export function useEarnings() {
  const token = useSelector((state: RootState) => state.auth.token)
  const [data, setData] = useState<EarningsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Only fetch if token exists
    if (!token) {
      setIsLoading(false)
      return
    }

    const fetchEarnings = async () => {
      try {
        const res = await axios.get(`${baseURL}/earnings/instructor`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setData(res.data)
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Failed to load earnings')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEarnings()
  }, [token])

  return { data, isLoading, error }
}
