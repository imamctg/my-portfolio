import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
export const addLectureToSection = createAsyncThunk(
  'course/addLectureToSection',
  async (
    {
      courseId,
      sectionId,
      title,
      video,
      isFreePreview,
    }: {
      courseId: string
      sectionId: string
      title: string
      video: File
      isFreePreview: boolean
    },
    thunkAPI
  ) => {
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('video', video)
      formData.append('isFreePreview', String(isFreePreview))

      const res = await axios.post(
        `${baseURL}/courses/${courseId}/sections/${sectionId}/lectures`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true, // যদি কুকি/অথ ব্যবহার করেন
        }
      )

      return res.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Upload failed'
      )
    }
  }
)
