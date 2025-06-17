"use client"
import DashboardNav from "components/Navbar/DashboardNav"

import InsightIcon from "public/insight-icon"
import ExchangeRateMarquee from "components/ui/ExchangeRate/exchange-rate"
import IncomingIcon from "public/incoming-icon"
import OutgoingIcon from "public/outgoing-icon"

import UnresolvedTransactions from "public/unresolved-transactions"
import ArrowIcon from "public/arrow-icon"
import TransactionTable from "components/Tables/OtechPlus/TransactionTable"
import { useGetReportQuery } from "lib/redux/otechplusApi"
import OtechPlusDashboardNav from "components/Navbar/OtechPlusDashboardNav"

interface PaymentAccount {
  id: number
  src: any
  name: string
  balance: string
}

export default function AllTransactions() {
  const { data: reportData, isLoading, isError } = useGetReportQuery()

  // Format number with commas
  const formatNumber = (num: number) => {
    return num?.toLocaleString() || "0"
  }

  return (
    <section className="h-full w-full">
      <div className="flex min-h-screen w-full">
        <div className="flex w-full flex-col">
          <OtechPlusDashboardNav />
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b px-16 py-4">
              <p className="text-2xl font-medium">All Transactions</p>
              <ExchangeRateMarquee />
            </div>

            <div className="max-sm-my-4 flex w-full gap-6 px-16 max-md:flex-col max-md:px-0 max-sm:px-3 md:my-8">
              <div className="w-full">
                <div className="flex w-full gap-3 max-lg:grid max-lg:grid-cols-2">
                  <div className="flex w-full">
                    <div className="w-full">
                      <div className="mb-3 flex w-full cursor-pointer gap-3">
                        {/* Overview Card */}
                        <div className="small-card rounded-md p-2 transition duration-500 md:border">
                          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                            <InsightIcon />
                            Overview
                          </div>
                          {isLoading ? (
                            <div className="flex flex-col gap-3 pt-4">
                              <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
                              <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
                            </div>
                          ) : isError ? (
                            <div className="pt-4 text-red-500">Error loading data</div>
                          ) : (
                            <div className="flex flex-col items-end justify-between gap-3 pt-4">
                              <div className="flex w-full justify-between">
                                <p className="text-grey-200">Transaction count:</p>
                                <p className="text-secondary font-medium">
                                  {formatNumber(
                                    (reportData?.data.depositReport.countAllTimeDeposit || 0) +
                                      (reportData?.data.paymentReport.countAllTimePayment || 0) +
                                      (reportData?.data.withdrawalReport.countAllTimeWithdraw || 0)
                                  )}
                                </p>
                              </div>
                              <div className="flex w-full justify-between">
                                <p className="text-grey-200">Total Volume:</p>
                                <p className="text-secondary font-medium">
                                  <span className="text-grey-300 font-normal">NGN </span>
                                  {formatNumber(
                                    (reportData?.data.depositReport.totalAllTimeDeposit || 0) +
                                      (reportData?.data.paymentReport.totalAllTimePayment || 0) +
                                      (reportData?.data.withdrawalReport.totalAllTimeWithdraw || 0)
                                  )}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Incoming Card */}
                        <div className="small-card rounded-md p-2 transition duration-500 md:border">
                          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                            <IncomingIcon />
                            Incoming
                          </div>
                          {isLoading ? (
                            <div className="flex flex-col gap-3 pt-4">
                              <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
                              <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
                            </div>
                          ) : isError ? (
                            <div className="pt-4 text-red-500">Error loading data</div>
                          ) : (
                            <div className="flex flex-col items-end justify-between gap-3 pt-4">
                              <div className="flex w-full justify-between">
                                <p className="text-grey-200">Transaction count:</p>
                                <p className="text-secondary font-medium">
                                  {formatNumber(reportData?.data.depositReport.countAllTimeDeposit || 0)}
                                </p>
                              </div>
                              <div className="flex w-full justify-between">
                                <p className="text-grey-200">Total Volume:</p>
                                <p className="text-secondary font-medium">
                                  <span className="text-grey-300 font-normal">NGN </span>
                                  {formatNumber(reportData?.data.depositReport.totalAllTimeDeposit || 0)}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Outgoing Card */}
                        <div className="small-card rounded-md p-2 transition duration-500 md:border">
                          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                            <OutgoingIcon />
                            Outgoing
                          </div>
                          {isLoading ? (
                            <div className="flex flex-col gap-3 pt-4">
                              <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
                              <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
                            </div>
                          ) : isError ? (
                            <div className="pt-4 text-red-500">Error loading data</div>
                          ) : (
                            <div className="flex flex-col items-end justify-between gap-3 pt-4">
                              <div className="flex w-full justify-between">
                                <p className="text-grey-200">Transaction count:</p>
                                <p className="text-secondary font-medium">
                                  {formatNumber(reportData?.data.paymentReport.countAllTimePayment || 0)}
                                </p>
                              </div>
                              <div className="flex w-full justify-between">
                                <p className="text-grey-200">Total Volume:</p>
                                <p className="text-secondary font-medium">
                                  <span className="text-grey-300 font-normal">NGN </span>
                                  {formatNumber(reportData?.data.paymentReport.totalAllTimePayment || 0)}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Unresolved Card */}
                        <div className="small-card rounded-md p-2 transition duration-500 md:border">
                          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                            <UnresolvedTransactions />
                            Unresolved
                          </div>
                          {isLoading ? (
                            <div className="flex flex-col gap-3 pt-4">
                              <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
                              <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
                            </div>
                          ) : isError ? (
                            <div className="pt-4 text-red-500">Error loading data</div>
                          ) : (
                            <div className="flex flex-col items-end justify-between gap-3 pt-4">
                              <div className="flex w-full justify-between">
                                <p className="text-grey-200">Total:</p>
                                <div className="flex gap-1">
                                  <p className="text-secondary font-medium">0</p>
                                  <ArrowIcon />
                                </div>
                              </div>
                              <div className="flex w-full justify-between">
                                <p className="text-grey-200">Total Volume:</p>
                                <p className="text-secondary font-medium">
                                  <span className="text-grey-300 font-normal">NGN </span>0
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <TransactionTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
