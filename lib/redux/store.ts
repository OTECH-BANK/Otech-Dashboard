// src/lib/redux/store.ts
import { configureStore } from "@reduxjs/toolkit"

// Feature imports
import authReducer from "./features/auth/authSlice"

// API imports (alphabetical order might be preferred)
import { api } from "./api"
import { customerApi } from "./customerApi"
import { customerTypeApi } from "./customerTypeApi"
import { employeeApi } from "./employeeApi"
import { feesApi } from "./feesApi"
import { otectplusApi } from "./otechplusApi"
import { transactionApi } from "./transactionApi"

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
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware)
      .concat(customerApi.middleware)
      .concat(customerTypeApi.middleware)
      .concat(employeeApi.middleware)
      .concat(feesApi.middleware)
      .concat(otectplusApi.middleware)
      .concat(transactionApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
