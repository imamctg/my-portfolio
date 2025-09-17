import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

interface CourseStatusState {
  loading: boolean
  error: string | null
  lastStatusChange: {
    // নতুন প্রপার্টি যোগ করুন
    newStatus: string
    courseTitle: string
    adminNotes?: string
  } | null
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
const initialState: CourseStatusState = {
  loading: false,
  error: null,
  lastStatusChange: null, // initialState এ যোগ করুন
}

export const submitForReview = createAsyncThunk(
  'courseStatus/submitForReview',
  async (courseId: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseURL}/courses/${courseId}/submit`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data.message)
    }
  }
)

export const reviewCourse = createAsyncThunk(
  'courseStatus/reviewCourse',
  async (
    {
      courseId,
      decision,
      notes,
    }: {
      courseId: string
      decision: 'approved' | 'rejected' | 'changes_requested'
      notes?: string
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${baseURL}/courses/${courseId}/review`,
        {
          decision,
          notes,
        }
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data.message)
    }
  }
)

const courseStatusSlice = createSlice({
  name: 'courseStatus',
  initialState,
  reducers: {
    // নতুন reducer যোগ করুন status change ট্র্যাক করার জন্য
    setStatusChange: (state, action) => {
      state.lastStatusChange = action.payload
    },
    clearStatusChange: (state) => {
      state.lastStatusChange = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitForReview.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(submitForReview.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(submitForReview.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(reviewCourse.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(reviewCourse.fulfilled, (state, action) => {
        state.loading = false
        // action payload থেকে status change সেট করুন
        state.lastStatusChange = {
          newStatus: action.meta.arg.decision,
          courseTitle: action.payload.title, // আপনার API রেস্পন্স অনুযায়ী আপডেট করুন
          adminNotes: action.meta.arg.notes,
        }
      })
      .addCase(reviewCourse.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setStatusChange, clearStatusChange } = courseStatusSlice.actions

export default courseStatusSlice.reducer
