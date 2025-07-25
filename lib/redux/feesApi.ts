// src/lib/redux/feesApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "./store"

export interface DebitFee {
  debitFeeID: number
  min: number
  max: number
  bankFee: number
  switchFee: number
  vat: number
  totalFee: number
  feeWithVAT: number
}

export interface DebitFeesResponse {
  data: DebitFee[]
  totalRecords: number
  currentPage: number
  pageSize: number
  statusCode: string | number | null
  message: string
  succeeded: boolean
}

export interface CreateDebitFeeRequest {
  min: number
  max: number
  bankFee: number
  switchFee: number
}

export interface UpdateDebitFeeRequest {
  debitFeeID: number
  bankFee: number
  switchFee: number
}

export interface CalculateFeeResponse {
  data: {
    amount: number
    bankFee: number
    switchFee: number
    vat: number
    totalFee: number
    feeWithVAT: number
  }
  statusCode: string | number | null
  message: string
  succeeded: boolean
}

export interface CreateDebitFeeResponse {
  statusCode: string | number | null
  message: string
  succeeded: boolean
  data?: DebitFee
}

export interface IdentityType {
  identityTypeID: number
  identityTypeName: string
  identityTypeObject: string
}

export interface IdentityTypesResponse {
  data: IdentityType[]
  totalRecords: number
  currentPage: number
  pageSize: number
  statusCode: string | number | null
  message: string
  succeeded: boolean
}

export interface ProductType {
  productTypeID: number
  productTypeName: string
  productTypeCode: string
  accountType: number
  createBy: string
  createdate: string
  modifyBy: string
  modifydate: string
  isDeleted: boolean
}

export interface ProductTypesResponse {
  data: ProductType[]
  totalRecords: number
  currentPage: number
  pageSize: number
  statusCode: string | number | null
  message: string
  succeeded: boolean
}

export interface Channel {
  disabled: boolean
  group: string | null
  selected: boolean
  text: string
  value: string
}

export interface ChannelListResponse {
  data: Channel[]
  totalRecords: number
  currentPage: number
  pageSize: number
  statusCode: string | number | null
  message: string
  succeeded: boolean
}

export const feesApi = createApi({
  reducerPath: "feesApi",
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
  tagTypes: ["DebitFee"],
  endpoints: (builder) => ({
    getDebitFees: builder.query<DebitFeesResponse, void>({
      query: () => ({
        url: "api/Fee/DebitFee",
        method: "GET",
      }),
      providesTags: ["DebitFee"],
    }),
    createDebitFee: builder.mutation<CreateDebitFeeResponse, CreateDebitFeeRequest>({
      query: (feeData) => ({
        url: "api/Fee/DebitFee",
        method: "POST",
        body: feeData,
      }),
      invalidatesTags: ["DebitFee"],
    }),
    updateDebitFee: builder.mutation<CreateDebitFeeResponse, UpdateDebitFeeRequest>({
      query: (feeData) => ({
        url: "api/Fee/DebitFee",
        method: "PATCH",
        body: feeData,
      }),
      invalidatesTags: ["DebitFee"],
    }),
    calculateFee: builder.query<CalculateFeeResponse, number>({
      query: (amount) => ({
        url: `api/Fee/CalculateFee?amount=${amount}`,
        method: "GET",
      }),
    }),
    getIdentityTypes: builder.query<IdentityTypesResponse, void>({
      query: () => ({
        url: "api/Setup/IdentityTypes",
        method: "GET",
      }),
    }),
    getProductTypes: builder.query<ProductTypesResponse, void>({
      query: () => ({
        url: "api/Setup/ProductType",
        method: "GET",
      }),
    }),
    getChannelList: builder.query<ChannelListResponse, void>({
      query: () => ({
        url: "api/Setup/ChannelList",
        method: "GET",
      }),
    }),
  }),
})

export const {
  useGetDebitFeesQuery,
  useCreateDebitFeeMutation,
  useUpdateDebitFeeMutation,
  useLazyCalculateFeeQuery,
  useGetIdentityTypesQuery,
  useGetProductTypesQuery,
  useGetChannelListQuery,
} = feesApi
