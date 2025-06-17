// src/lib/redux/otectplusApi.ts
import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react"
import type { RootState } from "./store"

export interface Tokens {
  accessToken: string
  refreshToken: string
  accessExpiry: string
  refreshExpiry: string
}

export interface Level {
  label: string
  value: number
}

export interface Status {
  label: string
  value: number
}

export interface PermissionType {
  label: string
  value: number
}

export interface UserPermission {
  id: number
  userId: number
  type: PermissionType
}

export interface AdminUser {
  id: number
  firstName: string
  lastName: string
  photo: string | null
  permissions: UserPermission[]
}

export interface AdminsResponse {
  data: AdminUser[]
  totalCount: number
  totalPages: number
}

export interface AdminsParams {
  pageNumber: number
  pageSize: number
}

export interface Province {
  id: number
  name: string
}

export interface Country {
  id: number
  name: string
}

export interface Merchant {
  userId: number
  name: string
  address: string
  description: string
  city: string
  province: Province
  country: Country
  status: Status
  level: Level
}

export interface BusinessUser {
  id: number
  firstName: string
  lastName: string
  photo: string | null
}

export interface Business {
  userId: number
  name: string
  address: string
  logo: string | null
  description: string
  city: string
  province: Province | null
  country: Country | null
  status: Status
  level: Level
  user: BusinessUser
}

export interface BusinessesResponse {
  data: Business[]
  totalCount: number
  totalPages: number
}

export interface BusinessesParams {
  pageNumber: number
  pageSize: number
}

export interface KycType {
  label: string
  value: number
}

export interface Kyc {
  document: string | null
  kycType: KycType
  kycStatus: KycType
  kycMessage: string | null
  documentNumber: string | null
}

export interface OtechVA {
  virtualAccountID: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  bvn: string
  bank: string
  accountName: string
  accountNumber: string
}

export interface Wallet {
  id: number
  title: string
  isMain: boolean
  balance: number
  ledgerBalance: number
}

export interface BankAccount {
  id: number
  bankName: string
  accountNumber: string
  accountName: string
  isDefault: boolean
}

export interface PayCard {
  id: number
  cardType: string
  lastFourDigits: string
  expiryDate: string
  issuer: string
  isDefault: boolean
}

export interface CustomerDetails {
  id: number
  firstName: string | null
  lastName: string | null
  phoneNumber: string
  level: Level
  photo: string | null
  referralUrl: string
  point: number
  dateOfBirth: string | null
  email: string | null
  role: string
  status: Status
  isBvnVerified: boolean
  pinSet: boolean
  merchant: Merchant | null
  otechVA: OtechVA | null
  kyc: Kyc
  wallets: Wallet[]
  payCards: PayCard[]
  banks: BankAccount[]
  permissions: string[]
}

export interface CustomerDetailsResponse {
  data: CustomerDetails
}

export interface User {
  id: number
  firstName: string | null
  lastName: string | null
  phoneNumber: string
  level: Level
  photo: string | null
  referralUrl: string
  point: number
  dateOfBirth: string | null
  email: string | null
  role: string
  status: Status
  isBvnVerified: boolean
  pinSet: boolean
  merchant: Merchant | null
  isMerchant: boolean
  kyc: Kyc
  permissions?: string[]
}

export interface TransactionUser {
  id: number
  firstName: string
  lastName: string
  photo: string | null
}

export interface TransactionType {
  label: string
  value: number
}

export interface TransactionStatus {
  label: string
  value: number
}

export interface Transaction {
  id: number
  createdAT: string
  reference: string
  amount: number
  fee: number
  type: TransactionType
  status: TransactionStatus
  comment: string
  description: string | null
  paymentOption: string | null
  color: string | null
  senderUser: TransactionUser | null
  recieverUser: TransactionUser | null
  merchant: null
}

export interface TransactionsResponse {
  data: Transaction[]
  totalCount: number
  totalPages: number
}

export interface TransactionsParams {
  pageNumber: number
  pageSize: number
}

export interface Customer {
  id: number
  firstName: string | null
  lastName: string | null
  phoneNumber: string
  level: Level
  photo: string | null
  referralUrl: string
  point: number
  dateOfBirth: string | null
  email: string | null
  role: string
  status: Status
  isBvnVerified: boolean
  pinSet: boolean
  isMerchant: boolean
}

export interface CustomersResponse {
  data: Customer[]
  totalCount: number
  totalPages: number
}

export interface CustomersParams {
  pageNumber: number
  pageSize: number
}

export interface ReportData {
  generatedAt: string
  totalDaily: number
  countDaily: number
  totalWeekly: number
  countWeekly: number
  totalMonthly: number
  countMonthly: number
  totalYearly: number
  countYearly: number
  totalAllTime: number
  countAllTime: number
}

export interface DepositReport extends ReportData {
  totalDailyDeposit: number
  countDailyDeposit: number
  totalWeeklyDeposit: number
  countWeeklyDeposit: number
  totalMonthlyDeposit: number
  countMonthlyDeposit: number
  totalYearlyDeposit: number
  countYearlyDeposit: number
  totalAllTimeDeposit: number
  countAllTimeDeposit: number
}

export interface PaymentReport extends ReportData {
  totalDailyPayment: number
  countDailyPayment: number
  totalWeeklyPayment: number
  countWeeklyPayment: number
  totalMonthlyPayment: number
  countMonthlyPayment: number
  totalYearlyPayment: number
  countYearlyPayment: number
  totalAllTimePayment: number
  countAllTimePayment: number
}

export interface WithdrawalReport extends ReportData {
  totalDailyWithdraw: number
  countDailyWithdraw: number
  totalWeeklyWithdraw: number
  countWeeklyWithdraw: number
  totalMonthlyWithdraw: number
  countMonthlyWithdraw: number
  totalYearlyWithdraw: number
  countYearlyWithdraw: number
  totalAllTimeWithdraw: number
  countAllTimeWithdraw: number
}

export interface CustomerReportData {
  generatedAt: string
  countActive: number
  countInactive: number
  countSuspended: number
  countBanned: number
  countVerified: number
}

export interface MerchantReportData {
  generatedAt: string
  countActive: number
  countInactive: number
  countSuspended: number
  countBanned: number
  countVerified: number
}

export interface CustomerReportResponse {
  isSuccess: boolean
  data: CustomerReportData
}

export interface MerchantReportResponse {
  isSuccess: boolean
  data: MerchantReportData
}

export interface ReportResponse {
  isSuccess: boolean
  data: {
    depositReport: DepositReport
    paymentReport: PaymentReport
    withdrawalReport: WithdrawalReport
  }
}

export interface LoginResponse {
  tokens: Tokens
  user: User
  permissions: string[]
  message: string
}

export interface LoginPayload {
  username: string
  password: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  tokens: Tokens
  message: string
}

export interface MakeAdminRequest {
  userId: number
  permissions: number[]
}

const baseQuery = retry(
  fetchBaseQuery({
    baseUrl: "https://otechpaygo-dev.otechcloud.com/api/",
    prepareHeaders: (headers, { getState }) => {
      // First try to get token from Redux state
      const token = (getState() as RootState).auth.token

      if (token) {
        const authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`
        headers.set("Authorization", authToken)
        return headers
      }

      // Only try to access localStorage on client side
      if (typeof window !== "undefined") {
        const authData = localStorage.getItem("authData")
        if (authData) {
          const parsedAuthData = JSON.parse(authData) as any
          if (parsedAuthData.tokens?.accessToken) {
            headers.set("Authorization", `Bearer ${parsedAuthData.tokens.accessToken}`)
          }
        }
      }

      headers.set("accept", "*/*")
      return headers
    },
  }),
  {
    maxRetries: 2,
  }
)

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result?.error?.status === 401) {
    // Only try to refresh token on client side
    if (typeof window !== "undefined") {
      const authData = localStorage.getItem("authData")
      if (!authData) {
        window.location.href = "/signin/otech-plus"
        return result
      }

      const parsedAuthData = JSON.parse(authData) as any
      const refreshToken = parsedAuthData.tokens?.refreshToken

      if (!refreshToken) {
        window.location.href = "/signin/otech-plus"
        return result
      }

      const refreshResult = await baseQuery(
        {
          url: "Admin/refresh-token",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      )

      if (refreshResult.data) {
        const newTokens = (refreshResult.data as RefreshTokenResponse).tokens
        parsedAuthData.tokens = newTokens
        localStorage.setItem("authData", JSON.stringify(parsedAuthData))

        result = await baseQuery(
          {
            ...args,
            headers: {
              ...args.headers,
              Authorization: `Bearer ${newTokens.accessToken}`,
            },
          },
          api,
          extraOptions
        )
      } else {
        localStorage.removeItem("authData")
        window.location.href = "/signin/otech-plus"
      }
    }
  }

  return result
}

export const otectplusApi = createApi({
  reducerPath: "otectplusApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["CustomerDetails", "Admins"],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (credentials) => ({
        url: "Admin/login",
        method: "POST",
        body: credentials,
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: LoginResponse) => {
        if (typeof window !== "undefined") {
          const authData = {
            tokens: response.tokens,
            user: {
              ...response.user,
              permissions: response.permissions || [],
            },
          }
          localStorage.setItem("authData", JSON.stringify(authData))
        }
        return response
      },
    }),

    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest>({
      query: ({ refreshToken }) => ({
        url: "Admin/refresh-token",
        method: "POST",
        body: { refreshToken },
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: RefreshTokenResponse) => {
        if (typeof window !== "undefined") {
          const authData = localStorage.getItem("authData")
          if (authData) {
            const parsedAuthData = JSON.parse(authData) as any
            parsedAuthData.tokens = response.tokens
            localStorage.setItem("authData", JSON.stringify(parsedAuthData))
          }
        }
        return response
      },
    }),
    getAdmins: builder.query<AdminsResponse, AdminsParams>({
      query: ({ pageNumber, pageSize }) => ({
        url: "Admin",
        params: { pageNumber, pageSize },
      }),
      providesTags: ["Admins"],
    }),
    getTransactions: builder.query<TransactionsResponse, TransactionsParams>({
      query: ({ pageNumber, pageSize }) => ({
        url: "Admin/Transactions",
        params: { pageNumber, pageSize },
      }),
    }),
    getCustomers: builder.query<CustomersResponse, CustomersParams>({
      query: ({ pageNumber, pageSize }) => ({
        url: "Admin/Customers",
        params: { pageNumber, pageSize },
      }),
    }),
    getBusinesses: builder.query<BusinessesResponse, BusinessesParams>({
      query: ({ pageNumber, pageSize }) => ({
        url: "Admin/Businesses",
        params: { pageNumber, pageSize },
      }),
    }),
    getCustomerDetails: builder.query<CustomerDetailsResponse, number>({
      query: (customerId) => `Admin/Customer/${customerId}`,
      providesTags: ["CustomerDetails"],
    }),
    getReport: builder.query<ReportResponse, void>({
      query: () => "Admin/Report",
    }),
    getCustomerReport: builder.query<CustomerReportResponse, void>({
      query: () => "Admin/Report/Customer",
    }),
    getMerchantReport: builder.query<MerchantReportResponse, void>({
      query: () => "Admin/Report/Merchant",
    }),
    updateAdminPermissions: builder.mutation<void, { userId: number; permissions: number[] }>({
      query: (body) => ({
        url: "Admin",
        method: "POST",
        body,
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
      }),
    }),
    makeAdmin: builder.mutation<void, MakeAdminRequest>({
      query: (body) => ({
        url: "Admin",
        method: "PATCH",
        body,
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["CustomerDetails", "Admins"],
    }),
  }),
})

export const {
  useLoginMutation,
  useRefreshTokenMutation,
  useGetAdminsQuery,
  useGetTransactionsQuery,
  useGetCustomersQuery,
  useGetBusinessesQuery,
  useGetCustomerDetailsQuery,
  useGetReportQuery,
  useGetCustomerReportQuery,
  useGetMerchantReportQuery,
  useUpdateAdminPermissionsMutation,
  useMakeAdminMutation,
} = otectplusApi
