import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './base.query'


export const dealApi = createApi({
  reducerPath: 'api/deals',
  baseQuery: baseQuery,
  tagTypes: ['Deal', 'Deals','Analysis', 'Document', 'Export'],
  endpoints: (builder) => ({
    analyzeDeal: builder.mutation({
      query: (id: number | string) => ({
        url: `deals/${id}/analyze/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Deal', id },
        { type: 'Analysis', id },
      ],
    }),

    getDealAnalysis: builder.query({
      query: (id: number | string) => `deals/${id}/analysis/`,
      providesTags: (result, error, id) => [{ type: 'Analysis', id }],
    }),

    getDealRecommendations: builder.query({
      query: (id: number | string) => `deals/${id}/recommendations/`,
    }),
     listDeals: builder.query({
      query: () => 'deals/',
      providesTags: ['Deals'],
    }),
    createDeal: builder.mutation({
      query: (data) => ({
        url: 'deals/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Deal'],
    }),
    getDeal: builder.query({
      query: (id) => `deals/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Deal', id }],
    }),
    updateDeal: builder.mutation({
      query: ({ id, data }) => ({
        url: `deals/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Deal', id }],
    }),
    deleteDeal: builder.mutation({
      query: (id) => ({
        url: `deals/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Deal'],
    }),
    fetchDealData: builder.mutation({
      query: (id) => ({
        url: `deals/${id}/fetch-data/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Deal', id }],
    }),
    uploadDealDocument: builder.mutation({
      query: ({ id, data }) => {

        return {
          url: `deals/${id}/documents/`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['Document'],
    }),

    listDealDocuments: builder.query({
      query: (id: number | string) => `/${id}/documents/`,
      providesTags: ['Document'],
    }),

    // Export Endpoints
    listDealExports: builder.query({
      query: (id: number | string) => `deals/${id}/exports/`,
      providesTags: ['Export'],
    }),

    exportPdf: builder.query({
      query: (id: number | string) => `deals/export/pdf/`,
    }),

    exportExcel: builder.query({
      query: (id: number | string) => `deals/export/excel/`,
    }),

    exportLoi: builder.query({
      query: (id: number | string) => `/${id}/export/loi/`,
    }),
  }),
})

export const {
  useAnalyzeDealMutation,
  useGetDealAnalysisQuery,
  useGetDealRecommendationsQuery,
  useListDealsQuery,
  useCreateDealMutation,
  useGetDealQuery,  
  useUpdateDealMutation,
  useDeleteDealMutation,
  useFetchDealDataMutation,
  useUploadDealDocumentMutation,
  useListDealDocumentsQuery,
  useListDealExportsQuery,
  useExportPdfQuery,  
  useExportExcelQuery,
  useExportLoiQuery,
  useLazyListDealsQuery
} = dealApi
