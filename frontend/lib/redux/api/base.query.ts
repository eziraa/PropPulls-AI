
import {  fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('access') || null
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
  credentials: 'include', // Include credentials for CORS requests
})

