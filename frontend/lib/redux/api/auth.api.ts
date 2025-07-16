import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('access') || null
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
    credentials: 'include', // Include credentials for CORS requests
  }),
  endpoints: (builder) => ({
    // Example: get current user
    getCurrentUser: builder.query({
      query: () => 'auth/me/',
    }),
    // Example: login
    login: builder.mutation({
      query: (credentials) => ({
        url: 'token/',
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: 'auth/register/',
        method: 'POST',
        body: userData,
      }),
    }),
  }),
})

export const {
  useGetCurrentUserQuery,
  useLoginMutation,
  useSignupMutation,
} = apiSlice
