// app/store.ts
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../auth/redux/authSlice'
import courseStatusReducer from '../../features/course/redux/courseStatusSlice' // ইম্পোর্ট যোগ করুন

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courseStatus: courseStatusReducer, // সঠিক reducer যোগ করুন
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
