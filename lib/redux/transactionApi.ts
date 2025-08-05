// src/lib/redux/transactionApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "./store"

export interface Transaction {
  transactionID: number
  userID: string
  customerID: number
  virtualAccountID: number
  fee: number
  currency: string
  nameVerificationRef: string
  beneficiaryAccountNumber: string
  initiatorAccountName: string
  initiatorAccountNumber: string
  transactionStatus: number
  transactionReference: string
  beneficiaryAccountName: string
  beneficiaryIssuerCode: string
  initiatorBVN: string
  transactionType: string
  transactionTime: string
  transactionAmount: number
  transactionDate: string
  postseq: string
  narration: string
  reversal: boolean
  channel: string
  batchNo: string
  clientReference: string
  electronicLevy: number
  settlementAmount: number
  vat: number
  etzReference: string
  business: null | any
  customer: null | any
  user: null | any
  businessID?: number
  hash?: string | null
  version?: string
  messageId?: string
  nibssRail?: string
  vetraAvailableBalance?: number
  initiator_BT_Balance?: number
  initiator_AT_Balance?: number
  sentEventCount?: number
}

export interface TransactionsResponse {
  data: Transaction[]
  totalRecords: number
  currentPage: number
  pageSize: number
  statusCode: string | number | null
  message: string
  succeeded: boolean
}

export interface TransactionDetailsResponse {
  data: Transaction
  totalRecords: number
  currentPage: number
  pageSize: number
  statusCode: string | number | null
  message: string
  succeeded: boolean
}

export interface DateRangeParams {
  startDate: string
  endDate: string
  pageNumber: number
  pageSize: number
}

export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://corecba.otechbank.com/",
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
    getTransactionsByDateRange: builder.query<TransactionsResponse, DateRangeParams>({
      query: ({ startDate, endDate, pageNumber, pageSize }) => ({
        url: `api/Transaction/TransactionsByDateRange`,
        params: {
          StartDate: startDate,
          EndDate: endDate,
          PageNumber: pageNumber,
          PageSize: pageSize,
        },
        method: "GET",
      }),
    }),
    getTransactionDetails: builder.query<TransactionDetailsResponse, number>({
      query: (transactionID) => ({
        url: `api/Transaction/TransactionDetails/${transactionID}`,
        method: "GET",
      }),
    }),
  }),
})

export const { useGetTransactionsByDateRangeQuery, useGetTransactionDetailsQuery } = transactionApi
