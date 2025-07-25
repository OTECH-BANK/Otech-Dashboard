// src/lib/redux/virtualAccountApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "./store"

export interface VirtualAccount {
  virtualAccountID: number
  businessID: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  amount: number

  allowOverPay: boolean
  allowUnderPay: boolean
  bank: string
  accountName: string
  accountNumber: string
  business: string
  expiryDate?: string
}

export interface VirtualAccountsResponse {
  data: VirtualAccount[]
  totalRecords: number
  currentPage: number
  pageSize: number
  statusCode: string | number | null
  message: string | null
  succeeded: boolean
}

// Updated to match the direct account response structure
export interface SingleVirtualAccountResponse extends VirtualAccount {
  statusCode?: string | number | null
  message?: string | null
  succeeded?: boolean
}

export const virtualAccountApi = createApi({
  reducerPath: "virtualAccountApi",
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
  endpoints: (builder) => ({
    getVirtualAccounts: builder.query<VirtualAccountsResponse, { pageNumber: number; pageSize: number }>({
      query: ({ pageNumber, pageSize }) => ({
        url: `api/Business/VirtualAccountList?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        method: "GET",
      }),
    }),
    getVirtualAccountById: builder.query<SingleVirtualAccountResponse, number>({
      query: (virtualAccountID) => ({
        url: `api/Business/VirtualAccountList/${virtualAccountID}`,
        method: "GET",
      }),
      transformResponse: (response: VirtualAccount) => {
        return {
          ...response,
          statusCode: 200, // Assuming success if we get here
          succeeded: true,
        }
      },
    }),
  }),
})

export const { useGetVirtualAccountsQuery, useGetVirtualAccountByIdQuery } = virtualAccountApi
