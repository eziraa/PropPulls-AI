import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './base.query'

export const documentApi = createApi({
  reducerPath: 'api/documents',
  baseQuery: baseQuery,
  tagTypes: ['Document'],
  endpoints: (builder) => ({

    getDocument: builder.query({
      query: (docId: number | string) => `/${docId}/`,
    }),

    deleteDocument: builder.mutation({
      query: (docId: number | string) => ({
        url: `/${docId}/delete/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Document'],
    }),
  }),
});

export const {
  useGetDocumentQuery,
  useDeleteDocumentMutation,
} = documentApi;
