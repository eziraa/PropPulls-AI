import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './base.query'

export const dealApi = createApi({
  reducerPath: 'api/analysis',
  baseQuery: baseQuery,
  tagTypes: ['Analysis', 'Deal'],
  endpoints: (builder) => ({
    getAnalysis: builder.query({
      query: (id) => `/${id}/`,
      providesTags: ['Analysis'],
    }),
    createAnalysis: builder.mutation({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Analysis'],
    }),
    updateAnalysis: builder.mutation({
      query: ({ id, data }) => ({
        url: `/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Analysis'],
    }),   
  }),
})

export const {
  useGetAnalysisQuery,
  useCreateAnalysisMutation,
  useUpdateAnalysisMutation,
} = dealApi
