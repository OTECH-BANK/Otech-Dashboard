"use client"
import DashboardNav from "components/Navbar/DashboardNav"
import ArrowIcon from "public/arrow-icon"
import BusinessIcon from "public/business-icon"
import RecentlyAdded from "public/recently-added"
import TotalBusiness from "public/total-business"
import DisabledBusiness from "public/disabled-business"
import { ButtonModule } from "components/ui/Button/Button"
import AddBusiness from "public/add-business"
import { useState } from "react"
import AddBusinessModal from "components/ui/Modal/add-business-modal"
import AllBusinessTable from "components/Tables/AllBusinessTable"
import { useGetBusinessesQuery } from "lib/redux/api"

interface BusinessStats {
  totalBusinesses: number
  recentlyAdded: number
  activeBusinesses: number
  inactiveBusinesses: number
  totalVolume: number
  recentlyAddedVolume: number
  activeVolume: number
  inactiveVolume: number
}

export default function AllTransactions() {
  const [isAddBusinessModalOpen, setIsAddBusinessModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // Fetch businesses data
  const {
    data: businessesData,
    isLoading,
    isError,
  } = useGetBusinessesQuery({
    pageNumber: 1,
    pageSize: 1000, // Fetch all businesses to calculate stats
  })

  // Calculate business stats
  const calculateStats = (): BusinessStats => {
    if (!businessesData) {
      return {
        totalBusinesses: 0,
        recentlyAdded: 0,
        activeBusinesses: 0,
        inactiveBusinesses: 0,
        totalVolume: 0,
        recentlyAddedVolume: 0,
        activeVolume: 0,
        inactiveVolume: 0,
      }
    }

    const now = new Date()
    const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7))

    const recentlyAdded = businessesData.data.filter((business) => {
      const createdDate = new Date(business.dateCreated)
      return createdDate >= sevenDaysAgo
    }).length

    // All businesses are active by default unless explicitly disabled/deleted
    const activeBusinesses = businessesData.data.filter(
      (business) => business.status !== "Disabled" && business.status !== "Deleted"
    ).length

    const inactiveBusinesses = businessesData.data.filter(
      (business) => business.status === "Disabled" || business.status === "Deleted"
    ).length

    // Placeholder volume calculations - adjust based on your actual business model
    const totalVolume = businessesData.data.length * 100000
    const recentlyAddedVolume = recentlyAdded * 50000
    const activeVolume = activeBusinesses * 120000
    const inactiveVolume = inactiveBusinesses * 20000

    return {
      totalBusinesses: businessesData.totalRecords,
      recentlyAdded,
      activeBusinesses,
      inactiveBusinesses,
      totalVolume,
      recentlyAddedVolume,
      activeVolume,
      inactiveVolume,
    }
  }

  const stats = calculateStats()

  const handleBusinessAdded = () => {
    setRefreshKey((prev) => prev + 1)
    setIsAddBusinessModalOpen(false)
  }

  return (
    <section className="h-full w-full">
      <div className="flex min-h-screen w-full">
        <div className="flex w-full flex-col">
          <DashboardNav />
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b px-16 py-4 max-sm:px-3">
              <p className="font-medium md:text-2xl">Businesses Page</p>
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

            <div className="flex w-full gap-6 px-16 max-md:flex-col max-md:px-0 max-sm:my-4 max-sm:px-3 md:my-8">
              <div className="w-full">
                <div className="flex w-full gap-3 max-lg:grid max-lg:grid-cols-2 max-sm:grid-cols-1">
                  <div className="flex w-full max-sm:flex-col">
                    <div className="w-full">
                      <div className="mb-3 flex w-full cursor-pointer gap-3 max-sm:flex-col">
                        {/* Overview starts */}
                        <div className="small-card rounded-md p-2 transition duration-500 md:border">
                          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                            <BusinessIcon />
                            Overview
                          </div>
                          <div className="flex flex-col items-end justify-between gap-3 pt-4">
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Business count:</p>
                              <p className="text-secondary font-medium">
                                {isLoading ? "Loading..." : stats.totalBusinesses}
                              </p>
                            </div>
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Total Volume:</p>
                              <p className="text-secondary font-medium">
                                <span className="text-grey-300 font-normal">NGN </span>
                                {isLoading
                                  ? "Loading..."
                                  : stats.totalVolume.toLocaleString("en-US", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Overview ends */}
                        {/* Recently Added starts */}
                        <div className="small-card rounded-md p-2 transition duration-500 md:border">
                          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F8FA]">
                              <RecentlyAdded />
                            </div>
                            Recently Added (7d)
                          </div>
                          <div className="flex flex-col items-end justify-between gap-3 pt-4">
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Total count:</p>
                              <p className="text-secondary font-medium">
                                {isLoading ? "Loading..." : stats.recentlyAdded}
                              </p>
                            </div>
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Total Volume:</p>
                              <p className="text-secondary font-medium">
                                <span className="text-grey-300 font-normal">NGN </span>
                                {isLoading
                                  ? "Loading..."
                                  : stats.recentlyAddedVolume.toLocaleString("en-US", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Recently Added ends */}
                        {/* Active Businesses starts */}
                        <div className="small-card rounded-md p-2 transition duration-500 md:border">
                          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                            <TotalBusiness />
                            Active Businesses
                          </div>
                          <div className="flex flex-col items-end justify-between gap-3 pt-4">
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Total count:</p>
                              <p className="text-secondary font-medium">
                                {isLoading ? "Loading..." : stats.activeBusinesses}
                              </p>
                            </div>
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Total Volume:</p>
                              <p className="text-secondary font-medium">
                                <span className="text-grey-300 font-normal">NGN </span>
                                {isLoading
                                  ? "Loading..."
                                  : stats.activeVolume.toLocaleString("en-US", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Active Businesses ends */}
                        {/* Inactive Businesses starts */}
                        <div className="small-card rounded-md p-2 transition duration-500 md:border">
                          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                            <DisabledBusiness />
                            Inactive Businesses
                          </div>
                          <div className="flex flex-col items-end justify-between gap-3 pt-4">
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Total:</p>
                              <div className="flex gap-1">
                                <p className="text-secondary font-medium">
                                  {isLoading ? "Loading..." : stats.inactiveBusinesses}
                                </p>
                                <ArrowIcon />
                              </div>
                            </div>
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Total Volume:</p>
                              <p className="text-secondary font-medium">
                                <span className="text-grey-300 font-normal">NGN </span>
                                {isLoading
                                  ? "Loading..."
                                  : stats.inactiveVolume.toLocaleString("en-US", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Inactive Businesses ends */}
                      </div>
                    </div>
                  </div>
                </div>
                <AllBusinessTable key={refreshKey} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddBusinessModal
        isOpen={isAddBusinessModalOpen}
        onRequestClose={() => setIsAddBusinessModalOpen(false)}
        onSuccess={handleBusinessAdded}
      />
    </section>
  )
}
