// src/lib/redux/metricApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "./store"

export interface RecentActivity {
  date: string
  transactions: number
  amount: number
}

export interface Last30DaysTransaction {
  date: string
  transactionCount: number
  totalAmount: number
  depositCount: number
  depositAmount: number
  withdrawalCount: number
  withdrawalAmount: number
}

export interface MonthlyCustomerGrowth {
  year: number
  month: number
  newCustomers: number
  closedAccounts: number
  growthRate: number
}

export interface DashboardMetricsResponse {
  totalCustomers: number
  activeAccounts: number
  totalAssets: number
  totalLiabilities: number
  netPosition: number
  transactionsToday: number
  volumeToday: number
  alerts: number
  accountTypeDistribution: Record<string, number>
  recentActivity: RecentActivity[]
  transactionTypeDistribution: any[]
  newCustomersThisMonth: number
  activeCustomers: number
  inactiveCustomers: number
  customerGrowthRate: number
  totalAccounts: number
  closedAccounts: number
  dormatAccounts: number
  inactiveAccounts: number
  onLienAccounts: number
  accountsByType: Record<string, number>
  totalTransactionVolume: number
  totalTransactionCount: number
  transactionsByType: Record<string, number>
  averageTransactionAmount: number
  totalDeposits: number
  totalWithdrawals: number
  totalTransfers: number
  totalFeesCollected: number
  currentLiability: number
  currentAssets: number
  pendingApprovals: number
  flaggedTransactions: number
  supportTicketsOpen: number
  fraudAlerts: number
  last30DaysTransactions: Last30DaysTransaction[]
  monthlyCustomerGrowth: MonthlyCustomerGrowth[]
}

export interface DashboardMetricsParams {
  startDate: string
  endDate: string
  includeDetailedMetrics?: boolean
  includeFinancials?: boolean
  includeCustomerMetrics?: boolean
  includeTransactionMetrics?: boolean
}

export const metricApi = createApi({
  reducerPath: "metricApi",
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
    getDashboardMetrics: builder.query<DashboardMetricsResponse, DashboardMetricsParams>({
      query: ({
        startDate,
        endDate,
        includeDetailedMetrics = true,
        includeFinancials = true,
        includeCustomerMetrics = true,
        includeTransactionMetrics = true,
      }) => ({
        url: `api/auth/Dashboard`,
        params: {
          StartDate: startDate,
          EndDate: endDate,
          IncludeDetailedMetrics: includeDetailedMetrics,
          IncludeFinancials: includeFinancials,
          IncludeCustomerMetrics: includeCustomerMetrics,
          IncludeTransactionMetrics: includeTransactionMetrics,
        },
        method: "GET",
      }),
    }),
  }),
})

export const { useGetDashboardMetricsQuery } = metricApi
