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
import AllAccountsTable from "components/Tables/AllAccountsTable"

interface PaymentAccount {
  id: number
  src: any
  name: string
  balance: string
}

export default function AllTransactions() {
  return (
    <section className="h-full w-full">
      <div className="flex min-h-screen w-full">
        <div className="flex w-full flex-col">
          <DashboardNav />
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b px-16 py-4">
              <p className="text-2xl font-medium">All Accounts</p>
              {/* Replacing the previous button group with the real-time exchange rates marquee */}
              <ExchangeRateMarquee />
            </div>

            <div className="max-sm-my-4 flex w-full gap-6 px-16 max-md:flex-col max-md:px-0 max-sm:px-3 md:my-8">
              <div className="w-full">
                <div className="flex w-full gap-3 max-lg:grid max-lg:grid-cols-2">
                  <div className="flex w-full">
                    <div className="w-full">
                      <div className="mb-3 flex w-full cursor-pointer gap-3">
                        {/* Overview starts */}
                        <div className="small-card rounded-md p-2 transition duration-500 md:border">
                          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                            <InsightIcon />
                            Overview
                          </div>
                          <div className="flex flex-col items-end justify-between gap-3 pt-4">
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Accounts count:</p>
                              <p className="text-secondary font-medium">7,679</p>
                            </div>
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Total Volume:</p>
                              <p className="text-secondary font-medium">
                                <span className="text-grey-300 font-normal">NGN </span>40,453,456.26
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Overview ends */}
                        {/* Incoming starts */}
                        <div className="small-card rounded-md p-2 transition duration-500 md:border">
                          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                            <IncomingIcon />
                            Active Accounts
                          </div>
                          <div className="flex flex-col items-end justify-between gap-3 pt-4">
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Transaction count:</p>
                              <p className="text-secondary font-medium">407</p>
                            </div>
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Total Volume:</p>
                              <p className="text-secondary font-medium">
                                <span className="text-grey-300 font-normal">NGN </span>15,097,280.54
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Incoming ends */}
                        {/* Outgoing starts */}
                        <div className="small-card rounded-md p-2 transition duration-500 md:border">
                          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                            <OutgoingIcon />
                            Frozen Accounts
                          </div>
                          <div className="flex flex-col items-end justify-between gap-3 pt-4">
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Transaction count:</p>
                              <p className="text-secondary font-medium">110</p>
                            </div>
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Total Volume:</p>
                              <p className="text-secondary font-medium">
                                <span className="text-grey-300 font-normal">NGN </span>8,453,456.96
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Outgoing ends */}
                        {/* Unresolved starts */}
                        <div className="small-card rounded-md p-2 transition duration-500 md:border">
                          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                            <UnresolvedTransactions />
                            Inactive Accounts
                          </div>
                          <div className="flex flex-col items-end justify-between gap-3 pt-4">
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Total:</p>
                              <div className="flex gap-1">
                                <p className="text-secondary font-medium">110</p>
                                <ArrowIcon />
                              </div>
                            </div>
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Total Volume:</p>
                              <p className="text-secondary font-medium">
                                <span className="text-grey-300 font-normal">NGN </span>53,456.00
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Unresolved ends */}
                      </div>
                    </div>
                  </div>
                </div>
                <AllAccountsTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
