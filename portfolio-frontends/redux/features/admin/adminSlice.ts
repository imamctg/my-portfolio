import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// example: client/redux/slices/adminSlice.ts

const initialState = {
  summary: {
    totalUsers: 0,
    totalCourses: 0,
    monthlyRevenue: 0,
    pendingApprovals: 0,
    totalOrders: 0,
    todayOrders: 0,
  },
  topCourses: [],
  latestOrders: [],
  loading: false,
  error: null,
}
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export const fetchAdminDashboard = createAsyncThunk(
  'admin/fetchDashboard',
  async () => {
    const res = await axios.get(`${baseURL}/admin/dashboard`)
    return res.data
  }
)

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.loading = false
        state.summary = action.payload.summary
        state.topCourses = action.payload.topCourses
        state.latestOrders = action.payload.latestOrders
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Something went wrong'
      })
  },
})

export default adminSlice.reducer
