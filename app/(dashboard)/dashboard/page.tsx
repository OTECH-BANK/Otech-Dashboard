"use client"
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
import RecentTransactionTable from "components/Tables/TransactionTable"
import { useGetDashboardMetricsQuery } from "lib/redux/metricApi"
import { useEffect, useRef, useState } from "react"

interface PaymentAccount {
  id: number
  src: any
  name: string
  balance: string
}

export default function Dashboard() {
  const [startDate] = useState<string>(() => {
    const date = new Date()
    date.setFullYear(date.getFullYear() - 1) // Fixed line
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${month}/${day}/${year}`
  })

  const [endDate] = useState<string>(() => {
    const date = new Date()
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${month}/${day}/${year}`
  })

  const {
    data: metrics,
    error,
    isLoading,
  } = useGetDashboardMetricsQuery({
    startDate,
    endDate,
    includeDetailedMetrics: true,
    includeFinancials: true,
    includeCustomerMetrics: true,
    includeTransactionMetrics: true,
  })

  // Format currency values
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return "0.00"
    return value.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  // Format count values
  const formatCount = (value: number | undefined) => {
    if (value === undefined) return "0"
    return value.toLocaleString()
  }

  // Animation logic for Recent Activities
  const activitiesRef = useRef<HTMLDivElement>(null)
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    if (!metrics?.recentActivity?.length) return

    const container = activitiesRef.current
    if (!container) return

    const content = container.firstChild as HTMLElement
    if (!content) return

    // Clone the content and append it to create seamless looping
    const clone = content.cloneNode(true) as HTMLElement
    container.appendChild(clone)

    const duration = 5000 // 20 seconds for full animation
    const contentHeight = content.offsetHeight

    const animation = container.animate(
      [{ transform: "translateY(0)" }, { transform: `translateY(-${contentHeight}px)` }],
      {
        duration,
        iterations: Infinity,
        easing: "linear",
      }
    )

    return () => {
      animation.cancel()
      if (clone.parentNode === container) {
        container.removeChild(clone)
      }
    }
  }, [metrics?.recentActivity, animationKey])

  if (error) {
    return (
      <section className="h-full w-full">
        <div className="flex min-h-screen w-full">
          <div className="flex w-full flex-col">
            <DashboardNav />
            <div className="flex flex-col items-center justify-center p-8">
              <p className="text-red-500">Error loading dashboard metrics</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="h-full w-full">
      <div className="flex min-h-screen w-full">
        <div className="flex w-full flex-col">
          <DashboardNav />
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b px-3 py-4 md:px-16">
              <p className="font-medium md:text-2xl">Dashboard</p>
              <ExchangeRateMarquee />
            </div>

            <div className="max-sm-my-4 flex w-full gap-6 px-16 max-md:flex-col  max-sm:px-3 max-sm:py-4 md:my-8">
              <div className="w-full">
                <div className="flex w-full gap-3 max-lg:grid max-lg:grid-cols-1 max-sm:flex-col">
                  <div className="flex max-sm:flex-col md:w-3/4">
                    <div className="w-full">
                      {isLoading ? (
                        <div className="mb-3 flex w-full gap-3 max-sm:flex-col">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="small-card rounded-md p-2 transition duration-500 md:border">
                              <div className="flex items-center gap-1 border-b pb-4 max-sm:mb-2">
                                <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200"></div>
                                <div className="ml-1 h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                              </div>
                              <div className="flex items-end justify-between pt-6">
                                <div>
                                  <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mb-3 flex w-full cursor-pointer gap-3 max-sm:flex-col">
                          <div className="small-card rounded-md p-2 transition duration-500 md:border">
                            <div className="flex items-center gap-1 border-b pb-4 max-sm:mb-2">
                              <TotalAssets />
                              <span className="text-grey-400 ml-1">Total Assets</span>
                            </div>
                            <div className="flex items-end justify-between pt-6">
                              <div>
                                <h5 className="text-secondary text-xl font-semibold max-sm:text-lg">
                                  <span className="text-grey-300 font-normal">NGN</span>{" "}
                                  {formatCurrency(metrics?.totalAssets)}
                                </h5>
                              </div>
                            </div>
                          </div>
                          <div className="small-card rounded-md  p-2 transition duration-500 md:border">
                            <div className="flex items-center gap-1 border-b pb-4 max-sm:mb-2">
                              <TotalAssets />
                              <span className="text-grey-400 ml-1">Net Position</span>
                            </div>
                            <div className="flex items-end justify-between pt-6">
                              <div>
                                <h5 className="text-secondary text-xl font-semibold max-sm:text-lg">
                                  <span className="text-grey-300 font-normal">NGN</span>{" "}
                                  {formatCurrency(metrics?.netPosition)}
                                </h5>
                              </div>
                            </div>
                          </div>
                          <div className="small-card rounded-md  p-2 transition duration-500 md:border">
                            <div className="flex items-center gap-1 border-b pb-4 max-sm:mb-2">
                              <TransactionIcon />
                              <span className="text-grey-400 ml-1">Transactions Today</span>
                            </div>
                            <div className="flex items-end justify-between pt-6">
                              <div>
                                <h5 className="text-secondary text-xl font-semibold max-sm:text-lg">
                                  {formatCount(metrics?.transactionsToday)}
                                </h5>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {isLoading ? (
                        <div className="flex w-full gap-3 max-sm:flex-col">
                          {[...Array(2)].map((_, i) => (
                            <div key={i} className="small-card rounded-md p-2 transition duration-500 md:border">
                              <div className="flex items-center gap-1 border-b pb-4 max-sm:mb-2">
                                <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200"></div>
                                <div className="ml-1 h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                              </div>
                              <div className="mt-4 flex min-h-[42px] w-full items-center gap-2 rounded-lg bg-[#ffe8d1] px-3 py-4">
                                <div className="h-6 w-6 animate-pulse rounded-full bg-gray-300"></div>
                                <div className="h-4 w-48 animate-pulse rounded bg-gray-300"></div>
                              </div>
                              <div className="flex items-end justify-between pt-4">
                                <div>
                                  <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                                </div>
                                <div>
                                  <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex w-full cursor-pointer gap-3 max-sm:flex-col">
                          <div className="small-card rounded-md p-2 transition duration-500 md:border">
                            <div className="flex items-center gap-1 border-b pb-4 max-sm:mb-2">
                              <AccountIcon />
                              Accounts
                            </div>
                            <div className="mt-4 flex min-h-[42px] w-full cursor-pointer items-center gap-2 rounded-lg bg-[#ffe8d1] px-3 py-4">
                              <WarningIcon />
                              <p className="font-bold text-[#202B3C]">
                                <span className="font-normal">Unresolved transactions: </span>
                                {formatCount(metrics?.flaggedTransactions)}
                              </p>
                            </div>
                            <div className="flex items-end justify-between pt-4">
                              <div>
                                <p className="text-secondary font-semibold">
                                  Active accounts{" "}
                                  <span className="text-grey-300 font-normal">
                                    ({formatCount(metrics?.activeAccounts)})
                                  </span>
                                </p>
                              </div>
                              <div>
                                <p className="text-secondary font-semibold">
                                  Total accounts{" "}
                                  <span className="text-grey-300 font-normal">
                                    ({formatCount(metrics?.totalAccounts)})
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="small-card rounded-md p-2 transition duration-500 md:border">
                            <div className="flex items-center gap-1 border-b pb-4 max-sm:mb-2">
                              <CustomerIcon />
                              Customers
                            </div>
                            <div className="flex items-end justify-between border-b py-6">
                              <div>
                                <p className="text-secondary font-semibold">
                                  Total Customers{" "}
                                  <span className="text-grey-300 font-normal">
                                    ({formatCount(metrics?.totalCustomers)})
                                  </span>
                                </p>
                              </div>
                              <div>
                                <p className="text-secondary font-semibold">
                                  Active{" "}
                                  <span className="text-grey-300 font-normal">
                                    ({formatCount(metrics?.activeCustomers)})
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="flex items-end justify-between pt-4">
                              <div>
                                <p className="text-secondary font-semibold">
                                  New This Month{" "}
                                  <span className="text-grey-300 font-normal">
                                    ({formatCount(metrics?.newCustomersThisMonth)})
                                  </span>
                                </p>
                              </div>
                              <div>
                                <ButtonModule type="submit" variant="outline" size="sm" className="w-full">
                                  View
                                </ButtonModule>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex h-[340px] flex-col justify-between rounded-md border bg-white p-4 md:w-1/4">
                    <div className="flex items-center gap-2 border-b pb-4">
                      {isLoading ? (
                        <>
                          <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200"></div>
                          <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                        </>
                      ) : (
                        <>
                          <InsightIcon />
                          <p className="text-lg font-medium">Recent Activities</p>
                        </>
                      )}
                    </div>
                    <div className="relative max-h-[300px] overflow-y-hidden">
                      {isLoading ? (
                        <div className="space-y-4">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="border-b pb-3 last:border-b-0">
                              <div className="flex justify-between">
                                <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                                <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                              </div>
                              <div className="mt-2 h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div ref={activitiesRef} className="space-y-4" style={{ willChange: "transform" }}>
                          {metrics?.recentActivity?.length ? (
                            metrics.recentActivity.map((activity, index) => (
                              <div key={index} className="border-b pb-3 last:border-b-0">
                                <div className="flex justify-between">
                                  <p className="text-sm font-medium">{activity.date}</p>
                                  <p className="text-sm text-gray-500">{activity.transactions} transactions</p>
                                </div>
                                <p className="mt-1 font-semibold">NGN {formatCurrency(activity.amount)}</p>
                              </div>
                            ))
                          ) : (
                            <p className="py-4 text-sm text-gray-500">No recent activities found</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-6"></div>
                <div className="mt-6">
                  {isLoading ? (
                    <div className="rounded-lg border p-4">
                      <div className="mb-4 h-6 w-1/4 animate-pulse rounded bg-gray-200"></div>
                      <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="flex items-center justify-between border-b pb-3">
                            <div className="h-4 w-1/5 animate-pulse rounded bg-gray-200"></div>
                            <div className="h-4 w-1/5 animate-pulse rounded bg-gray-200"></div>
                            <div className="h-4 w-1/5 animate-pulse rounded bg-gray-200"></div>
                            <div className="h-4 w-1/5 animate-pulse rounded bg-gray-200"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <RecentTransactionTable />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
