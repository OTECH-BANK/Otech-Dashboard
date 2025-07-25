import { configureStore } from "@reduxjs/toolkit"

import authReducer from "./features/auth/authSlice"

import { api } from "./api"
import { customerApi } from "./customerApi"
import { customerTypeApi } from "./customerTypeApi"
import { employeeApi } from "./employeeApi"
import { feesApi } from "./feesApi"
import { otectplusApi } from "./otechplusApi"
import { transactionApi } from "./transactionApi"
import { virtualAccountApi } from "./virtualAccountApi"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [customerTypeApi.reducerPath]: customerTypeApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer,
    [feesApi.reducerPath]: feesApi.reducer,
    [otectplusApi.reducerPath]: otectplusApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
    [virtualAccountApi.reducerPath]: virtualAccountApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware)
      .concat(customerApi.middleware)
      .concat(customerTypeApi.middleware)
      .concat(employeeApi.middleware)
      .concat(feesApi.middleware)
      .concat(otectplusApi.middleware)
      .concat(virtualAccountApi.middleware)
      .concat(transactionApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
