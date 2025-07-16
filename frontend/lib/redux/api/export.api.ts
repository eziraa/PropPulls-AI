import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './base.query'

export const exportApi = createApi({
  reducerPath: 'api/export',
  baseQuery: baseQuery,
  tagTypes: ['Export'],
  endpoints: (builder) => ({
    listDealExports: builder.query({
      query: (id: number | string) => `deals/${id}/exports/`,
      providesTags: ['Export'],
    }),

    exportPdf: builder.query({
      query: (id: number | string) => `deals/${id}/export/pdf/`,
    }),

    exportExcel: builder.query({
      query: (id: number | string) => `deals/${id}/export/excel/`,
    }),

    exportLoi: builder.query({
      query: (id: number | string) => `deals/${id}/export/loi/`,
    }),
  }),
});

export const {
  useListDealExportsQuery,
  useExportPdfQuery,
  useExportExcelQuery,
  useExportLoiQuery,
} = exportApi;
