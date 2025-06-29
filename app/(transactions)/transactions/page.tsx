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
import { useGetTransactionsQuery } from "lib/redux/transactionApi"

interface PaymentAccount {
  id: number
  src: any
  name: string
  balance: string
}

export default function AllTransactions() {
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const { data: transactionsData, isLoading, isError } = useGetTransactionsQuery({ pageNumber, pageSize })

  // Calculate transaction stats
  const totalTransactions = transactionsData?.totalRecords || 0
  const totalVolume = transactionsData?.data?.reduce((sum, transaction) => sum + transaction.transactionAmount, 0) || 0

  // Updated to use DR/CR instead of INCOMING/OUTGOING
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
                <div className="flex w-full gap-3 max-lg:grid max-lg:grid-cols-2 max-sm:grid-cols-1">
                  <div className="flex w-full">
                    <div className="w-full">
                      <div className="mb-3 flex w-full cursor-pointer gap-3 max-sm:flex-col">
                        {/* Overview starts */}
                        <div className="small-card rounded-md p-2 transition duration-500 md:border">
                          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                            <InsightIcon />
                            Overview
                          </div>
                          <div className="flex flex-col items-end justify-between gap-3 pt-4">
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Transaction count:</p>
                              <p className="text-secondary font-medium">
                                {isLoading ? "Loading..." : totalTransactions.toLocaleString()}
                              </p>
                            </div>
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Total Volume:</p>
                              <p className="text-secondary font-medium">
                                {isLoading ? (
                                  "Loading..."
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
                        <div className="small-card rounded-md p-2 transition duration-500 md:border">
                          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                            <IncomingIcon />
                            Incoming
                          </div>
                          <div className="flex flex-col items-end justify-between gap-3 pt-4">
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Transaction count:</p>
                              <p className="text-secondary font-medium">
                                {isLoading ? "Loading..." : incomingTransactions.toLocaleString()}
                              </p>
                            </div>
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Total Volume:</p>
                              <p className="text-secondary font-medium">
                                {isLoading ? (
                                  "Loading..."
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
                        <div className="small-card rounded-md p-2 transition duration-500 md:border">
                          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                            <OutgoingIcon />
                            Outgoing
                          </div>
                          <div className="flex flex-col items-end justify-between gap-3 pt-4">
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Transaction count:</p>
                              <p className="text-secondary font-medium">
                                {isLoading ? "Loading..." : outgoingTransactions.toLocaleString()}
                              </p>
                            </div>
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Total Volume:</p>
                              <p className="text-secondary font-medium">
                                {isLoading ? (
                                  "Loading..."
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
                        <div className="small-card rounded-md p-2 transition duration-500 md:border">
                          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                            <UnresolvedTransactions />
                            Unresolved
                          </div>
                          <div className="flex flex-col items-end justify-between gap-3 pt-4">
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Total:</p>
                              <div className="flex gap-1">
                                <p className="text-secondary font-medium">
                                  {isLoading ? "Loading..." : unresolvedTransactions.toLocaleString()}
                                </p>
                                <ArrowIcon />
                              </div>
                            </div>
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Total Volume:</p>
                              <p className="text-secondary font-medium">
                                {isLoading ? (
                                  "Loading..."
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
