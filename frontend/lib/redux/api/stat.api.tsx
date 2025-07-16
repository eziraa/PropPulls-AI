import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './base.query'

export const statApi = createApi({
  reducerPath: 'api/dashboard',
  baseQuery: baseQuery,
  tagTypes: ['Dashboard'],
  endpoints: (builder) => ({
    getDashboardMetrics: builder.query({
      query: () => '/metrics/',
      providesTags: ['Dashboard'],
    }),

    getRecentDeals: builder.query({
      query: () => '/recent/',
      providesTags: ['Dashboard'],
    }),
  }),
});

export const {
  useGetDashboardMetricsQuery,
  useGetRecentDealsQuery,
} = statApi;
