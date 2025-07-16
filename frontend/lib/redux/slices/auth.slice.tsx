import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.accessToken
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
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
    // Example: get deals
    getDeals: builder.query({
      query: () => 'deals/',
    }),
  }),
})

export const {
  useGetCurrentUserQuery,
  useLoginMutation,
  useGetDealsQuery,
} = apiSlice
