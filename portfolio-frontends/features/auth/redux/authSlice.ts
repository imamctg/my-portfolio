// features/auth/redux/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  user: any | null
  token: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
}

// 🔑 localStorage থেকে user/token পড়া (reload fix)
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('user')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      initialState.user = parsed.user
      initialState.token = parsed.token
    } catch (error) {
      console.error('Invalid user data in localStorage', error)
      localStorage.removeItem('user')
    }
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ user: any; token: string }>
    ) => {
      state.user = action.payload.user
      state.token = action.payload.token
    },

    updateUser: (state, action: PayloadAction<any>) => {
      if (state.user) {
        state.user.name = action.payload.name
        state.user.email = action.payload.email
        state.user.profileImage = action.payload.profileImage
      }
    },

    logout: (state) => {
      state.user = null
      state.token = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user')
      }
    },
  },
})

export const { loginSuccess, logout, updateUser } = authSlice.actions
export default authSlice.reducer
