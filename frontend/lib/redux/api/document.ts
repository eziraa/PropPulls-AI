import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './base.query'

export const documentApi = createApi({
  reducerPath: 'api/documents',
  baseQuery: baseQuery,
  tagTypes: ['Document'],
  endpoints: (builder) => ({
    uploadDealDocument: builder.mutation({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: `deals/${id}/documents/`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Document'],
    }),

    listDealDocuments: builder.query({
      query: (id: number | string) => `deals/${id}/documents/`,
      providesTags: ['Document'],
    }),
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
