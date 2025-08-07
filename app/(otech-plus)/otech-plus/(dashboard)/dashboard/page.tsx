"use client"
import { useState } from "react"
import DashboardNav from "components/Navbar/DashboardNav"
import FinanceChart from "components/Chart/FinanceChart"
import TotalAssets from "public/total-assets"
import TransactionIcon from "public/transaction-icon"
import AccountIcon from "public/accounts-icon"
import WarningIcon from "public/warning-icon"
import CustomerIcon from "public/customer-icon"
import { ButtonModule } from "components/ui/Button/Button"
import InsightIcon from "public/insight-icon"
import ExchangeRateMarquee from "components/ui/ExchangeRate/exchange-rate"
import OtechPlusDashboardNav from "components/Navbar/OtechPlusDashboardNav"

import { useGetCustomerReportQuery, useGetMerchantReportQuery, useGetReportQuery } from "lib/redux/otechplusApi"
import { formatCurrency } from "utils/formatCurrency"
import TransactionTable from "components/Tables/OtechPlus/TransactionTable"

interface SmallCardProps {
  icon: React.ReactNode
  title: string
  value: string
  subValue?: string
  currency?: string
  isLoading?: boolean
}

const SmallCard: React.FC<SmallCardProps> = ({ icon, title, value, subValue, currency = "NGN", isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="small-card rounded-md p-2 transition duration-500 md:border">
        <div className="flex items-center gap-1 border-b pb-4 max-sm:mb-2">
          <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200"></div>
          <span className="ml-1 h-4 w-20 animate-pulse rounded bg-gray-200"></span>
        </div>
        <div className="flex items-end justify-between pt-6">
          <div>
            <h5 className="text-secondary max-sm:text-lg">
              <span className="h-6 w-24 animate-pulse rounded bg-gray-200"></span>
            </h5>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="small-card rounded-md p-2 transition duration-500 md:border">
      <div className="flex items-center gap-1 border-b pb-4 max-sm:mb-2">
        {icon}
        <span className="text-grey-400 ml-1">{title}</span>
      </div>
      <div className="flex items-end justify-between pt-6">
        <div>
          <h5 className="text-secondary text-xl font-semibold max-sm:text-lg">
            {currency && <span className="text-grey-300 font-normal">{currency}</span>} {value}
            {subValue && <span className="text-grey-300 text-sm">.{subValue}</span>}
          </h5>
        </div>
      </div>
    </div>
  )
}

const StatsCard: React.FC<{ title: string; value: number; comparison?: string; isLoading?: boolean }> = ({
  title,
  value,
  comparison,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="new-card rounded-md transition duration-500 md:border">
        <div className="flex items-center gap-1 border-b pb-4 max-sm:mb-2">
          <span className="h-4 w-24 animate-pulse rounded bg-gray-200"></span>
        </div>
        <div className="flex items-end justify-between pt-6">
          <div>
            <h5 className="text-secondary max-sm:text-lg">
              <span className="h-6 w-16 animate-pulse rounded bg-gray-200"></span>
              {comparison && <span className="ml-2 h-4 w-12 animate-pulse rounded bg-gray-200"></span>}
            </h5>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="new-card rounded-md  transition duration-500 md:border">
      <div className="flex items-center gap-1 border-b pb-4 max-sm:mb-2">
        <span className="text-grey-400">{title}</span>
      </div>
      <div className="flex items-end justify-between pt-6">
        <div>
          <h5 className="text-secondary text-xl font-semibold max-sm:text-lg">
            {value.toLocaleString()}
            {comparison && <span className="text-grey-300 ml-2 text-sm">({comparison})</span>}
          </h5>
        </div>
      </div>
    </div>
  )
}

type TimePeriod = "daily" | "weekly" | "monthly" | "yearly"

export default function Dashboard() {
  const { data: reportData, isLoading: isReportLoading } = useGetReportQuery()
  const { data: customerReportData, isLoading: isCustomerReportLoading } = useGetCustomerReportQuery()
  const { data: merchantReportData, isLoading: isMerchantReportLoading } = useGetMerchantReportQuery()
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("daily")

  const depositReport = reportData?.data?.depositReport
  const paymentReport = reportData?.data?.paymentReport
  const withdrawalReport = reportData?.data?.withdrawalReport

  const getPeriodData = (report: any, period: TimePeriod) => {
    if (!report) return { count: 0, total: 0 }

    switch (period) {
      case "weekly":
        return {
          count: report.countWeeklyDeposit || report.countWeeklyPayment || report.countWeeklyWithdraw || 0,
          total: report.totalWeeklyDeposit || report.totalWeeklyPayment || report.totalWeeklyWithdraw || 0,
        }
      case "monthly":
        return {
          count: report.countMonthlyDeposit || report.countMonthlyPayment || report.countMonthlyWithdraw || 0,
          total: report.totalMonthlyDeposit || report.totalMonthlyPayment || report.totalMonthlyWithdraw || 0,
        }
      case "yearly":
        return {
          count: report.countYearlyDeposit || report.countYearlyPayment || report.countYearlyWithdraw || 0,
          total: report.totalYearlyDeposit || report.totalYearlyPayment || report.totalYearlyWithdraw || 0,
        }
      default: // daily
        return {
          count: report.countDailyDeposit || report.countDailyPayment || report.countDailyWithdraw || 0,
          total: report.totalDailyDeposit || report.totalDailyPayment || report.totalDailyWithdraw || 0,
        }
    }
  }

  return (
    <section className="h-full w-full">
      <div className="flex min-h-screen w-full">
        <div className="flex w-full flex-col">
          <OtechPlusDashboardNav />
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b px-16 py-4">
              <p className="text-2xl font-medium">Dashboard</p>
              <ExchangeRateMarquee />
            </div>

            <div className="max-sm-my-4 flex w-full gap-6 px-16 max-md:flex-col max-md:px-0 max-sm:px-3 md:my-8">
              <div className="w-full">
                <div className="flex w-full gap-3 max-lg:grid max-lg:grid-cols-2">
                  <div className="flex w-3/4">
                    <div className="w-full">
                      <div className="mb-3 flex w-full cursor-pointer gap-3">
                        <SmallCard
                          icon={<TotalAssets />}
                          title="Total Deposits"
                          value={depositReport ? formatCurrency(depositReport.totalAllTimeDeposit) : "0"}
                          subValue={
                            depositReport ? formatCurrency(depositReport.totalAllTimeDeposit).split(".")[1] : "00"
                          }
                          isLoading={isReportLoading}
                        />
                        <SmallCard
                          icon={<TotalAssets />}
                          title="Total Payments"
                          value={paymentReport ? formatCurrency(paymentReport.totalAllTimePayment) : "0"}
                          subValue={
                            paymentReport ? formatCurrency(paymentReport.totalAllTimePayment).split(".")[1] : "00"
                          }
                          isLoading={isReportLoading}
                        />
                        <SmallCard
                          icon={<TransactionIcon />}
                          title="Total Withdrawals"
                          value={withdrawalReport ? formatCurrency(withdrawalReport.totalAllTimeWithdraw) : "0"}
                          subValue={
                            withdrawalReport
                              ? formatCurrency(withdrawalReport.totalAllTimeWithdraw).split(".")[1]
                              : "00"
                          }
                          isLoading={isReportLoading}
                        />
                      </div>
                      <div className="flex w-full cursor-pointer gap-3">
                        <div className="small-card rounded-md p-2 transition duration-500 md:border">
                          <div className="flex items-center gap-1 border-b pb-4 max-sm:mb-2">
                            <AccountIcon />
                            Accounts Summary
                          </div>

                          <div className="flex items-end justify-between pt-4">
                            <div className="grid w-full grid-cols-2 gap-4">
                              {/* Customers */}
                              <div className="rounded-lg bg-white p-4 shadow">
                                <p className="text-secondary font-semibold">
                                  {isCustomerReportLoading ? (
                                    <span className="h-4 w-24 animate-pulse rounded bg-gray-200"></span>
                                  ) : (
                                    <>
                                      Total Customers{" "}
                                      <span className="text-grey-300 font-normal">
                                        ({customerReportData?.data.countActive || 0})
                                      </span>
                                    </>
                                  )}
                                </p>
                                {customerReportData && (
                                  <div className="mt-2 text-sm text-gray-500">
                                    Verified: {customerReportData.data.countVerified}
                                  </div>
                                )}
                              </div>

                              {/* Merchants */}
                              <div className="rounded-lg bg-white p-4 shadow">
                                <p className="text-secondary font-semibold">
                                  {isMerchantReportLoading ? (
                                    <span className="h-4 w-24 animate-pulse rounded bg-gray-200"></span>
                                  ) : (
                                    <>
                                      Total Merchants{" "}
                                      <span className="text-grey-300 font-normal">
                                        ({merchantReportData?.data.countActive || 0})
                                      </span>
                                    </>
                                  )}
                                </p>
                                {merchantReportData && (
                                  <div className="mt-2 text-sm text-gray-500">
                                    Verified: {merchantReportData.data.countVerified}
                                  </div>
                                )}
                              </div>

                              {/* Transactions */}
                              {/* <div className="rounded-lg bg-white p-4 shadow">
                                <p className="text-secondary font-semibold">
                                  {isReportLoading ? (
                                    <span className="h-4 w-24 animate-pulse rounded bg-gray-200"></span>
                                  ) : (
                                    <>
                                      Daily Transactions{" "}
                                      <span className="text-grey-300 font-normal">
                                        ({reportData?.data.paymentReport.countDaily || 0})
                                      </span>
                                    </>
                                  )}
                                </p>
                                {reportData && (
                                  <div className="mt-2 text-sm text-gray-500">
                                    Volume: ₦{(reportData.data.paymentReport.totalDaily || 0).toLocaleString()}
                                  </div>
                                )}
                              </div> */}

                              {/* Transaction Volume */}
                              {/* <div className="rounded-lg bg-white p-4 shadow">
                                <p className="text-secondary font-semibold">
                                  {isReportLoading ? (
                                    <span className="h-4 w-24 animate-pulse rounded bg-gray-200"></span>
                                  ) : (
                                    <>
                                      Monthly Volume{" "}
                                      <span className="text-grey-300 font-normal">
                                        (₦{(reportData?.data.paymentReport.totalMonthly || 0).toLocaleString()})
                                      </span>
                                    </>
                                  )}
                                </p>
                                {reportData && (
                                  <div className="mt-2 text-sm text-gray-500">
                                    Transactions: {reportData.data.paymentReport.countMonthly}
                                  </div>
                                )}
                              </div> */}
                            </div>
                          </div>
                        </div>

                        <div className="small-card rounded-md p-2 transition duration-500 md:border">
                          <div className="flex items-center gap-1 border-b pb-4 max-sm:mb-2">
                            <CustomerIcon />
                            Customer Stats
                          </div>
                          <div className="flex items-end justify-between border-b py-6">
                            <div>
                              <p className="text-secondary font-semibold">
                                {isCustomerReportLoading ? (
                                  <span className="h-4 w-24 animate-pulse rounded bg-gray-200"></span>
                                ) : (
                                  <>
                                    Verified{" "}
                                    <span className="text-grey-300 font-normal">
                                      ({customerReportData?.data.countVerified || 0})
                                    </span>
                                  </>
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-secondary font-semibold">
                                {isCustomerReportLoading ? (
                                  <span className="h-4 w-24 animate-pulse rounded bg-gray-200"></span>
                                ) : (
                                  <>
                                    Suspended{" "}
                                    <span className="text-grey-300 font-normal">
                                      ({customerReportData?.data.countSuspended || 0})
                                    </span>
                                  </>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-end justify-between pt-4">
                            <div>
                              <p className="text-secondary font-semibold">
                                {isCustomerReportLoading ? (
                                  <span className="h-4 w-24 animate-pulse rounded bg-gray-200"></span>
                                ) : (
                                  <>
                                    Banned{" "}
                                    <span className="text-grey-300 font-normal">
                                      ({customerReportData?.data.countBanned || 0})
                                    </span>
                                  </>
                                )}
                              </p>
                            </div>
                            <div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-1/4 flex-col rounded-md border bg-white p-4">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-2">
                        <InsightIcon />
                        <p className="text-lg font-medium">Transaction Insights</p>
                      </div>
                      <select
                        value={timePeriod}
                        onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
                        className="rounded border p-1 text-sm"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                    <div className="space-y-4 pt-2">
                      {isReportLoading ? (
                        <StatsCard title="" value={0} isLoading={true} />
                      ) : (
                        depositReport && (
                          <StatsCard
                            title={`${timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)} Deposits`}
                            value={getPeriodData(depositReport, timePeriod).count}
                            comparison={`${formatCurrency(getPeriodData(depositReport, timePeriod).total)}`}
                          />
                        )
                      )}
                      <div className="flex gap-3">
                        {isReportLoading ? (
                          <>
                            <StatsCard title="" value={0} isLoading={true} />
                            <StatsCard title="" value={0} isLoading={true} />
                          </>
                        ) : (
                          <>
                            {paymentReport && (
                              <StatsCard
                                title={`${timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)} Payments`}
                                value={getPeriodData(paymentReport, timePeriod).count}
                                comparison={`${formatCurrency(getPeriodData(paymentReport, timePeriod).total)}`}
                              />
                            )}
                            {withdrawalReport && (
                              <StatsCard
                                title={`${timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)} Withdrawals`}
                                value={getPeriodData(withdrawalReport, timePeriod).count}
                                comparison={`${formatCurrency(getPeriodData(withdrawalReport, timePeriod).total)}`}
                              />
                            )}
                          </>
                        )}
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
