import { configureStore } from '@reduxjs/toolkit'
import { authApi } from './api/auth.api'
import { filterApi } from './api/filter.api'
import { statApi } from './api/stat.api'
import { dealApi } from './api/analysis.api'
import { documentApi } from './api/document'
import { analysisApi } from './api/deal.api'

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [filterApi.reducerPath]: filterApi.reducer,
    [statApi.reducerPath]: statApi.reducer,
    [dealApi.reducerPath]: dealApi.reducer,
    [documentApi.reducerPath]: documentApi.reducer,
    [analysisApi.reducerPath]: analysisApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
