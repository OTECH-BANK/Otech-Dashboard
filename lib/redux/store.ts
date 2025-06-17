// src/lib/redux/store.ts
import { configureStore } from "@reduxjs/toolkit"
import { api } from "./api"
import { employeeApi } from "./employeeApi" // Import the new API
import { feesApi } from "./feesApi"
import authReducer from "./features/auth/authSlice"
import { customerTypeApi } from "./customerTypeApi"
import { customerApi } from "./customerApi"
import { transactionApi } from "./transactionApi"
import { otectplusApi } from "./otechplusApi"

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer, // Add the employee API reducer
    [feesApi.reducerPath]: feesApi.reducer,
    [customerTypeApi.reducerPath]: customerTypeApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
    [otectplusApi.reducerPath]: otectplusApi.reducer,

    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware)
      .concat(employeeApi.middleware)
      .concat(feesApi.middleware)
      .concat(customerTypeApi.middleware)
      .concat(customerApi.middleware)
      .concat(transactionApi.middleware)
      .concat(otectplusApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
