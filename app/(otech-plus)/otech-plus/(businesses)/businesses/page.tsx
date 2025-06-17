"use client"

import DashboardNav from "components/Navbar/DashboardNav"
import ArrowIcon from "public/arrow-icon"
import AllAccountsTable from "components/Tables/AllAccountsTable"
import BusinessIcon from "public/business-icon"
import RecentlyAdded from "public/recently-added"
import TotalBusiness from "public/total-business"
import DisabledBusiness from "public/disabled-business"
import { ButtonModule } from "components/ui/Button/Button"
import AddBusiness from "public/add-business"
import { useState } from "react"
import AddBusinessModal from "components/ui/Modal/add-business-modal"
import AllBusinessTable from "components/Tables/OtechPlus/AllBusinessTable"
import { useGetMerchantReportQuery } from "lib/redux/otechplusApi"
import OtechPlusDashboardNav from "components/Navbar/OtechPlusDashboardNav"

interface PaymentAccount {
  id: number
  src: any
  name: string
  balance: string
}

const CardSkeleton = () => (
  <div className="pt-4 transition duration-500">
    <div className="flex flex-col items-end justify-between gap-3 ">
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

const TableSkeleton = () => (
  <div className="w-full overflow-hidden rounded-lg shadow">
    <div className="w-full animate-pulse bg-white">
      <div className="space-y-4 p-4">
        {/* Header row */}
        <div className="flex justify-between">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 w-24 rounded bg-gray-200"></div>
          ))}
        </div>
        {/* Table rows */}
        {[...Array(5)].map((_, rowIndex) => (
          <div key={rowIndex} className="flex justify-between">
            {[...Array(6)].map((_, cellIndex) => (
              <div key={cellIndex} className="h-4 w-24 rounded bg-gray-200"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default function AllTransactions() {
  const [isAddBusinessModalOpen, setIsAddBusinessModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch merchant report data
  const { data: merchantReport, isLoading, isError } = useGetMerchantReportQuery()

  const handleAddBusiness = async (businessData: { name: string; email: string; phone: string; address: string }) => {
    setIsSubmitting(true)
    try {
      // Here you would typically call your API to add the business
      console.log("Adding business:", businessData)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Close modal after successful submission
      setIsAddBusinessModalOpen(false)
    } catch (error) {
      console.error("Error adding business:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate total businesses
  const totalBusinesses = merchantReport?.data
    ? merchantReport.data.countActive +
      merchantReport.data.countInactive +
      merchantReport.data.countSuspended +
      merchantReport.data.countBanned
    : 0

  return (
    <section className="h-full w-full">
      <div className="flex min-h-screen w-full">
        <div className="flex w-full flex-col">
          <OtechPlusDashboardNav />
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b px-16 py-4">
              <p className="text-2xl font-medium">Businesses Page</p>
              <ButtonModule
                variant="primary"
                size="md"
                icon={<AddBusiness />}
                iconPosition="start"
                onClick={() => setIsAddBusinessModalOpen(true)}
              >
                Add Business
              </ButtonModule>
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
                            <BusinessIcon />
                            Overview
                          </div>
                          {isLoading ? (
                            <CardSkeleton />
                          ) : isError ? (
                            <div className="pt-4 text-red-500">Error loading data</div>
                          ) : (
                            <div className="flex flex-col items-end justify-between gap-3 pt-4">
                              <div className="flex w-full justify-between">
                                <p className="text-grey-200">Business count:</p>
                                <p className="text-secondary font-medium">{totalBusinesses.toLocaleString()}</p>
                              </div>
                              <div className="flex w-full justify-between">
                                <p className="text-grey-200">Verified:</p>
                                <p className="text-secondary font-medium">
                                  {merchantReport?.data.countVerified.toLocaleString() || 0}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        {/* Overview ends */}
                        {/* Recently Added starts */}
                        <div className="small-card rounded-md p-2 transition duration-500 md:border">
                          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F8FA]">
                              <RecentlyAdded />
                            </div>
                            Recently Added
                          </div>
                          {isLoading ? (
                            <CardSkeleton />
                          ) : isError ? (
                            <div className="pt-4 text-red-500">Error loading data</div>
                          ) : (
                            <div className="flex flex-col items-end justify-between gap-3 pt-4">
                              <div className="flex w-full justify-between">
                                <p className="text-grey-200">Last 7 days:</p>
                                <p className="text-secondary font-medium">
                                  {merchantReport?.data?.countActive !== undefined
                                    ? Math.round(merchantReport.data.countActive * 0.1)
                                    : 0}
                                </p>
                              </div>
                              <div className="flex w-full justify-between">
                                <p className="text-grey-200">Percentage:</p>
                                <p className="text-secondary font-medium">
                                  {totalBusinesses > 0 && merchantReport?.data?.countActive !== undefined
                                    ? Math.round(
                                        (Math.round(merchantReport.data.countActive * 0.1) / totalBusinesses) * 100
                                      )
                                    : 0}
                                  %
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        {/* Recently Added ends */}
                        {/* Total Businesses starts */}
                        <div className="small-card rounded-md p-2 transition duration-500 md:border">
                          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                            <TotalBusiness />
                            Active Businesses
                          </div>
                          {isLoading ? (
                            <CardSkeleton />
                          ) : isError ? (
                            <div className="pt-4 text-red-500">Error loading data</div>
                          ) : (
                            <div className="flex flex-col items-end justify-between gap-3 pt-4">
                              <div className="flex w-full justify-between">
                                <p className="text-grey-200">Total count:</p>
                                <p className="text-secondary font-medium">
                                  {merchantReport?.data.countActive.toLocaleString() || 0}
                                </p>
                              </div>
                              <div className="flex w-full justify-between">
                                <p className="text-grey-200">Percentage:</p>
                                <p className="text-secondary font-medium">
                                  {totalBusinesses > 0
                                    ? Math.round(((merchantReport?.data.countActive ?? 0) / totalBusinesses) * 100)
                                    : 0}
                                  %
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        {/* Total Businesses ends */}
                        {/* Inactive Businesses starts */}
                        <div className="small-card rounded-md p-2 transition duration-500 md:border">
                          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                            <DisabledBusiness />
                            Inactive Businesses
                          </div>
                          {isLoading ? (
                            <CardSkeleton />
                          ) : isError ? (
                            <div className="pt-4 text-red-500">Error loading data</div>
                          ) : (
                            <div className="flex flex-col items-end justify-between gap-3 pt-4">
                              <div className="flex w-full justify-between">
                                <p className="text-grey-200">Total:</p>
                                <div className="flex gap-1">
                                  <p className="text-secondary font-medium">
                                    {merchantReport?.data.countInactive.toLocaleString() || 0}
                                  </p>
                                  <ArrowIcon />
                                </div>
                              </div>
                              <div className="flex w-full justify-between">
                                <p className="text-grey-200">Suspended/Banned:</p>
                                <p className="text-secondary font-medium">
                                  {totalBusinesses > 0
                                    ? Math.round(((merchantReport?.data.countActive ?? 0) / totalBusinesses) * 100)
                                    : 0}
                                  %
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        {/* Inactive Businesses ends */}
                      </div>
                    </div>
                  </div>
                </div>
                <AllBusinessTable />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <AddBusinessModal
        isOpen={isAddBusinessModalOpen}
        onRequestClose={() => setIsAddBusinessModalOpen(false)}
        onSubmit={handleAddBusiness}
        isSubmitting={isSubmitting}
      /> */}
    </section>
  )
}
