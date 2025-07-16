import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './base.query'

export const filterApi = createApi({
  reducerPath: 'api/filters',
  baseQuery: baseQuery,
  tagTypes: ['Filter'],
  endpoints: (builder) => ({
    listFilters: builder.query({
      query: () => '/',
      providesTags: ['Filter'],
    }),

    createFilter: builder.mutation({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Filter'],
    }),

    getFilter: builder.query({
      query: (id: number | string) => `/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Filter', id }],
    }),

    updateFilter: builder.mutation({
      query: ({ id, data }) => ({
        url: `/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Filter', id },
        'Filter',
      ],
    }),

    deleteFilter: builder.mutation({
      query: (id: number | string) => ({
        url: `/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Filter'],
    }),
  }),
});

export const {
  useListFiltersQuery,
  useCreateFilterMutation,
  useGetFilterQuery,
  useUpdateFilterMutation,
  useDeleteFilterMutation,
} = filterApi;
