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

import { useEffect, useState } from "react"
import { useGetTransactionsByDateRangeQuery } from "lib/redux/transactionApi"
import { subYears, format } from "date-fns"
import { ButtonModule } from "components/ui/Button/Button"

interface PaymentAccount {
  id: number
  src: any
  name: string
  balance: string
}

export default function AllTransactions() {
  const [startDate, setStartDate] = useState<Date>(subYears(new Date(), 1))
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(1000)

  // Format date as MM/DD/YYYY for API request
  const formatDateForApi = (date: Date) => {
    return format(date, "MM/dd/yyyy")
  }

  const {
    data: transactionsData,
    isLoading,
    isError,
    refetch,
  } = useGetTransactionsByDateRangeQuery({
    startDate: formatDateForApi(startDate),
    endDate: formatDateForApi(endDate),
    pageNumber,
    pageSize,
  })

  // Calculate transaction stats
  const totalTransactions = transactionsData?.totalRecords || 0
  const totalVolume = transactionsData?.data?.reduce((sum, transaction) => sum + transaction.transactionAmount, 0) || 0

  const incomingTransactions = transactionsData?.data?.filter((t) => t.transactionType === "CR").length || 0
  const incomingVolume =
    transactionsData?.data
      ?.filter((t) => t.transactionType === "CR")
      .reduce((sum, t) => sum + t.transactionAmount, 0) || 0
  const outgoingTransactions = transactionsData?.data?.filter((t) => t.transactionType === "DR").length || 0
  const outgoingVolume =
    transactionsData?.data
      ?.filter((t) => t.transactionType === "DR")
      .reduce((sum, t) => sum + t.transactionAmount, 0) || 0
  const unresolvedTransactions = transactionsData?.data?.filter((t) => t.transactionStatus === 0).length || 0
  const unresolvedVolume =
    transactionsData?.data?.filter((t) => t.transactionStatus === 0).reduce((sum, t) => sum + t.transactionAmount, 0) ||
    0

  // Handle date range changes
  const handleApplyDateRange = () => {
    refetch()
  }

  const handleResetDateRange = () => {
    setStartDate(subYears(new Date(), 1))
    setEndDate(new Date())
    setPageNumber(1)
  }

  return (
    <section className="h-full w-full">
      <div className="flex min-h-screen w-full">
        <div className="flex w-full flex-col">
          <DashboardNav />
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b px-3 py-4 md:px-16">
              <p className="text-2xl font-medium">All Transactions</p>
              <ExchangeRateMarquee />
            </div>

            <div className="flex w-full gap-6 px-16 max-md:flex-col max-md:px-0 max-sm:my-4 max-sm:px-3 md:my-8">
              <div className="w-full">
                {/* Date Range Filter */}
                <div className="mb-4 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Date Range:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={startDate.toISOString().split("T")[0]}
                        onChange={(e) => {
                          const newDate = e.target.value ? new Date(e.target.value) : subYears(new Date(), 1)
                          setStartDate(newDate)
                          if (newDate > endDate) setEndDate(newDate)
                        }}
                        className="rounded border p-2 text-sm"
                        max={endDate.toISOString().split("T")[0]}
                      />
                      <span>to</span>
                      <input
                        type="date"
                        value={endDate.toISOString().split("T")[0]}
                        onChange={(e) => {
                          const newDate = e.target.value ? new Date(e.target.value) : new Date()
                          setEndDate(newDate)
                          if (newDate < startDate) setStartDate(newDate)
                        }}
                        className="rounded border p-2 text-sm"
                        min={startDate.toISOString().split("T")[0]}
                        max={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>
                  <ButtonModule variant="primary" size="sm" onClick={handleApplyDateRange}>
                    Apply
                  </ButtonModule>
                  <ButtonModule variant="outline" size="sm" onClick={handleResetDateRange}>
                    Reset
                  </ButtonModule>
                </div>

                <div className="flex w-full gap-3 max-lg:grid max-lg:grid-cols-2 max-sm:grid-cols-1">
                  <div className="flex w-full">
                    <div className="w-full">
                      <div className="mb-3 flex w-full cursor-pointer gap-3 max-sm:flex-col">
                        {/* Overview starts */}
                        <div
                          className={`small-card rounded-md p-2 transition duration-500 md:border ${
                            isLoading ? "animate-pulse" : ""
                          }`}
                        >
                          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                            <InsightIcon />
                            <span className={isLoading ? "rounded bg-gray-200 text-transparent" : ""}>Overview</span>
                          </div>
                          <div className="flex flex-col items-end justify-between gap-3 pt-4">
                            <div className="flex w-full justify-between">
                              <p className={`text-grey-200 ${isLoading ? "rounded bg-gray-200 text-transparent" : ""}`}>
                                Transaction count:
                              </p>
                              <p
                                className={`text-secondary font-medium ${
                                  isLoading ? "rounded bg-gray-200 text-transparent" : ""
                                }`}
                              >
                                {isLoading ? " " : totalTransactions.toLocaleString()}
                              </p>
                            </div>
                            <div className="flex w-full justify-between">
                              <p className={`text-grey-200 ${isLoading ? "rounded bg-gray-200 text-transparent" : ""}`}>
                                Total Volume:
                              </p>
                              <p
                                className={`text-secondary font-medium ${
                                  isLoading ? "rounded bg-gray-200 text-transparent" : ""
                                }`}
                              >
                                {isLoading ? (
                                  " "
                                ) : (
                                  <>
                                    <span className="text-grey-300 font-normal">NGN </span>
                                    {totalVolume.toLocaleString("en-NG", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                  </>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Overview ends */}
                        {/* Incoming starts */}
                        <div
                          className={`small-card rounded-md p-2 transition duration-500 md:border ${
                            isLoading ? "animate-pulse" : ""
                          }`}
                        >
                          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                            <IncomingIcon />
                            <span className={isLoading ? "rounded bg-gray-200 text-transparent" : ""}>Incoming</span>
                          </div>
                          <div className="flex flex-col items-end justify-between gap-3 pt-4">
                            <div className="flex w-full justify-between">
                              <p className={`text-grey-200 ${isLoading ? "rounded bg-gray-200 text-transparent" : ""}`}>
                                Transaction count:
                              </p>
                              <p
                                className={`text-secondary font-medium ${
                                  isLoading ? "rounded bg-gray-200 text-transparent" : ""
                                }`}
                              >
                                {isLoading ? " " : incomingTransactions.toLocaleString()}
                              </p>
                            </div>
                            <div className="flex w-full justify-between">
                              <p className={`text-grey-200 ${isLoading ? "rounded bg-gray-200 text-transparent" : ""}`}>
                                Total Volume:
                              </p>
                              <p
                                className={`text-secondary font-medium ${
                                  isLoading ? "rounded bg-gray-200 text-transparent" : ""
                                }`}
                              >
                                {isLoading ? (
                                  " "
                                ) : (
                                  <>
                                    <span className="text-grey-300 font-normal">NGN </span>
                                    {incomingVolume.toLocaleString("en-NG", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                  </>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Incoming ends */}
                        {/* Outgoing starts */}
                        <div
                          className={`small-card rounded-md p-2 transition duration-500 md:border ${
                            isLoading ? "animate-pulse" : ""
                          }`}
                        >
                          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                            <OutgoingIcon />
                            <span className={isLoading ? "rounded bg-gray-200 text-transparent" : ""}>Outgoing</span>
                          </div>
                          <div className="flex flex-col items-end justify-between gap-3 pt-4">
                            <div className="flex w-full justify-between">
                              <p className={`text-grey-200 ${isLoading ? "rounded bg-gray-200 text-transparent" : ""}`}>
                                Transaction count:
                              </p>
                              <p
                                className={`text-secondary font-medium ${
                                  isLoading ? "rounded bg-gray-200 text-transparent" : ""
                                }`}
                              >
                                {isLoading ? " " : outgoingTransactions.toLocaleString()}
                              </p>
                            </div>
                            <div className="flex w-full justify-between">
                              <p className={`text-grey-200 ${isLoading ? "rounded bg-gray-200 text-transparent" : ""}`}>
                                Total Volume:
                              </p>
                              <p
                                className={`text-secondary font-medium ${
                                  isLoading ? "rounded bg-gray-200 text-transparent" : ""
                                }`}
                              >
                                {isLoading ? (
                                  " "
                                ) : (
                                  <>
                                    <span className="text-grey-300 font-normal">NGN </span>
                                    {outgoingVolume.toLocaleString("en-NG", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                  </>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Outgoing ends */}
                        {/* Unresolved starts */}
                        <div
                          className={`small-card rounded-md p-2 transition duration-500 md:border ${
                            isLoading ? "animate-pulse" : ""
                          }`}
                        >
                          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                            <UnresolvedTransactions />
                            <span className={isLoading ? "rounded bg-gray-200 text-transparent" : ""}>Unresolved</span>
                          </div>
                          <div className="flex flex-col items-end justify-between gap-3 pt-4">
                            <div className="flex w-full justify-between">
                              <p className={`text-grey-200 ${isLoading ? "rounded bg-gray-200 text-transparent" : ""}`}>
                                Total:
                              </p>
                              <div className="flex gap-1">
                                <p
                                  className={`text-secondary font-medium ${
                                    isLoading ? "rounded bg-gray-200 text-transparent" : ""
                                  }`}
                                >
                                  {isLoading ? " " : unresolvedTransactions.toLocaleString()}
                                </p>
                                {!isLoading && <ArrowIcon />}
                              </div>
                            </div>
                            <div className="flex w-full justify-between">
                              <p className={`text-grey-200 ${isLoading ? "rounded bg-gray-200 text-transparent" : ""}`}>
                                Total Volume:
                              </p>
                              <p
                                className={`text-secondary font-medium ${
                                  isLoading ? "rounded bg-gray-200 text-transparent" : ""
                                }`}
                              >
                                {isLoading ? (
                                  " "
                                ) : (
                                  <>
                                    <span className="text-grey-300 font-normal">NGN </span>
                                    {unresolvedVolume.toLocaleString("en-NG", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                  </>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <AllTransactionTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
