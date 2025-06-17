"use client"
import DashboardNav from "components/Navbar/DashboardNav"
import TotalAssets from "public/total-assets"
import TransactionIcon from "public/transaction-icon"
import InsightIcon from "public/insight-icon"
import ExchangeRateMarquee from "components/ui/ExchangeRate/exchange-rate"
import TransactionTable from "components/Tables/TransactionTable"
import IncomingIcon from "public/incoming-icon"
import OutgoingIcon from "public/outgoing-icon"
import WarningIcon from "public/warning-icon"
import UnresolvedTransactions from "public/unresolved-transactions"
import ArrowIcon from "public/arrow-icon"
import AllTransactionTable from "components/Tables/AllTransactionstable"
import AllCustomersTable from "components/Tables/OtechPlus/AllCustomersTable"

import { useEffect } from "react"
import { useGetCustomerReportQuery } from "lib/redux/otechplusApi"
import { formatNumberWithCommas } from "utils/helpers"
import OtechPlusDashboardNav from "components/Navbar/OtechPlusDashboardNav"

interface PaymentAccount {
  id: number
  src: any
  name: string
  balance: string
}

// Skeleton Loader Component
const CardSkeleton = () => (
  <div className="small-card rounded-md p-2 transition duration-500 md:border">
    <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
      <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200"></div>
      <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
    </div>
    <div className="flex flex-col items-end justify-between gap-3 pt-4">
      <div className="flex w-full justify-between">
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
        <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
      </div>
      <div className="flex w-full justify-between">
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
        <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
      </div>
    </div>
  </div>
)

export default function AllTransactions() {
  const { data: customerReport, isLoading, isError, refetch } = useGetCustomerReportQuery()

  useEffect(() => {
    // Refetch data when component mounts to ensure fresh data
    refetch()
  }, [refetch])

  // Extract data from the report or provide defaults
  const reportData = customerReport?.data || {
    generatedAt: new Date().toISOString(),
    countActive: 0,
    countInactive: 0,
    countSuspended: 0,
    countBanned: 0,
    countVerified: 0,
  }

  // Calculate total accounts
  const totalAccounts =
    reportData.countActive + reportData.countInactive + reportData.countSuspended + reportData.countBanned

  return (
    <section className="h-full w-full">
      <div className="flex min-h-screen w-full">
        <div className="flex w-full flex-col">
          <OtechPlusDashboardNav />
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b px-16 py-4">
              <p className="text-2xl font-medium">All Customers</p>
              <ExchangeRateMarquee />
            </div>

            <div className="max-sm-my-4 flex w-full gap-6 px-16 max-md:flex-col max-md:px-0 max-sm:px-3 md:my-8">
              <div className="w-full">
                <div className="flex w-full gap-3 max-lg:grid max-lg:grid-cols-2">
                  <div className="flex w-full">
                    <div className="w-full">
                      <div className="mb-3 flex w-full cursor-pointer gap-3">
                        {/* Overview starts */}
                        {isLoading ? (
                          <CardSkeleton />
                        ) : (
                          <div className="small-card rounded-md p-2 transition duration-500 md:border">
                            <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                              <InsightIcon />
                              Overview
                            </div>
                            <div className="flex flex-col items-end justify-between gap-3 pt-4">
                              <div className="flex w-full justify-between">
                                <p className="text-grey-200">Accounts count:</p>
                                <p className="text-secondary font-medium">{formatNumberWithCommas(totalAccounts)}</p>
                              </div>
                              <div className="flex w-full justify-between">
                                <p className="text-grey-200">Verified Accounts:</p>
                                <p className="text-secondary font-medium">
                                  {formatNumberWithCommas(reportData.countVerified)}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        {/* Overview ends */}
                        {/* Active Accounts starts */}
                        {isLoading ? (
                          <CardSkeleton />
                        ) : (
                          <div className="small-card rounded-md p-2 transition duration-500 md:border">
                            <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                              <IncomingIcon />
                              Active Accounts
                            </div>
                            <div className="flex flex-col items-end justify-between gap-3 pt-4">
                              <div className="flex w-full justify-between">
                                <p className="text-grey-200">Count:</p>
                                <p className="text-secondary font-medium">
                                  {formatNumberWithCommas(reportData.countActive)}
                                </p>
                              </div>
                              <div className="flex w-full justify-between">
                                <p className="text-grey-200">Percentage:</p>
                                <p className="text-secondary font-medium">
                                  {totalAccounts > 0
                                    ? `${Math.round((reportData.countActive / totalAccounts) * 100)}%`
                                    : "0%"}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        {/* Active Accounts ends */}
                        {/* Suspended Accounts starts */}
                        {isLoading ? (
                          <CardSkeleton />
                        ) : (
                          <div className="small-card rounded-md p-2 transition duration-500 md:border">
                            <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                              <OutgoingIcon />
                              Suspended Accounts
                            </div>
                            <div className="flex flex-col items-end justify-between gap-3 pt-4">
                              <div className="flex w-full justify-between">
                                <p className="text-grey-200">Count:</p>
                                <p className="text-secondary font-medium">
                                  {formatNumberWithCommas(reportData.countSuspended)}
                                </p>
                              </div>
                              <div className="flex w-full justify-between">
                                <p className="text-grey-200">Percentage:</p>
                                <p className="text-secondary font-medium">
                                  {totalAccounts > 0
                                    ? `${Math.round((reportData.countSuspended / totalAccounts) * 100)}%`
                                    : "0%"}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        {/* Suspended Accounts ends */}
                        {/* Banned Accounts starts */}
                        {isLoading ? (
                          <CardSkeleton />
                        ) : (
                          <div className="small-card rounded-md p-2 transition duration-500 md:border">
                            <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                              <UnresolvedTransactions />
                              Banned Accounts
                            </div>
                            <div className="flex flex-col items-end justify-between gap-3 pt-4">
                              <div className="flex w-full justify-between">
                                <p className="text-grey-200">Count:</p>
                                <div className="flex gap-1">
                                  <p className="text-secondary font-medium">
                                    {formatNumberWithCommas(reportData.countBanned)}
                                  </p>
                                  <ArrowIcon />
                                </div>
                              </div>
                              <div className="flex w-full justify-between">
                                <p className="text-grey-200">Percentage:</p>
                                <p className="text-secondary font-medium">
                                  {totalAccounts > 0
                                    ? `${Math.round((reportData.countBanned / totalAccounts) * 100)}%`
                                    : "0%"}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        {/* Banned Accounts ends */}
                      </div>
                    </div>
                  </div>
                </div>
                <AllCustomersTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
