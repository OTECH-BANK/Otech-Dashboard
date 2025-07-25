// src/lib/redux/customerTypeApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "./store"

export interface CustomerType {
  customerTypeID: number
  customerTypeName: string
  customerTypeCode: string
}

export interface CustomerTypesResponse {
  data: CustomerType[]
  totalRecords: number
  currentPage: number
  pageSize: number
  statusCode: string | number | null
  message: string
  succeeded: boolean
}

export interface CreateCustomerTypeRequest {
  customerTypeName: string
  customerTypeCode: string
}

export interface CreateCustomerTypeResponse {
  statusCode: string | number | null
  message: string
  succeeded: boolean
  data?: CustomerType
}

export const customerTypeApi = createApi({
  reducerPath: "customerTypeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://cba-dev.otechbank.com/",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
      headers.set("accept", "*/*")
      return headers
    },
  }),
  tagTypes: ["CustomerType"],
  endpoints: (builder) => ({
    getCustomerTypes: builder.query<CustomerTypesResponse, void>({
      query: () => ({
        url: "api/CustomerType/CustomerTypeList",
        method: "GET",
      }),
      providesTags: ["CustomerType"],
    }),
    createCustomerType: builder.mutation<CreateCustomerTypeResponse, CreateCustomerTypeRequest>({
      query: (customerTypeData) => ({
        url: "api/CustomerType/NewCustomerType",
        method: "POST",
        body: customerTypeData,
      }),
      invalidatesTags: ["CustomerType"],
    }),
  }),
})

export const { useGetCustomerTypesQuery, useCreateCustomerTypeMutation } = customerTypeApi
