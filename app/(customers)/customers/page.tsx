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
import { ButtonModule } from "components/ui/Button/Button"
import AddBusiness from "public/add-business"
import { useState } from "react"
import AddCustomerModal from "components/ui/Modal/add-customer-modal"
import {
  useAddCustomerMutation,
  useGetCustomersQuery,
  useGetPendingApprovalCustomersQuery,
} from "lib/redux/customerApi"

export default function AllTransactions() {
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Fetch all customers
  const {
    data: customersData,
    isLoading: isCustomersLoading,
    isError: isCustomersError,
  } = useGetCustomersQuery({ pageNumber, pageSize })

  // Fetch pending approval customers (inactive)
  const {
    data: pendingCustomersData,
    isLoading: isPendingLoading,
    isError: isPendingError,
  } = useGetPendingApprovalCustomersQuery({ pageNumber: 1, pageSize: 100 }) // Get all inactive for stats

  // Add customer mutation
  const [addCustomer] = useAddCustomerMutation()

  // Calculate customer stats
  const totalCustomers = customersData?.totalRecords || 0
  const activeCustomers = customersData?.data?.filter((c) => c.customer.customerStatus).length || 0
  const frozenCustomers = customersData?.data?.filter((c) => !c.customer.customerStatus).length || 0
  const inactiveCustomers = pendingCustomersData?.totalRecords || 0

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  const handleAddCustomerSuccess = async () => {
    setIsAddCustomerModalOpen(false)
    // You might want to refresh the customer list here
    // Could implement cache invalidation or manual refetch
  }

  return (
    <section className="h-full w-full">
      <div className="flex min-h-screen w-full">
        <div className="flex w-full flex-col">
          <DashboardNav />
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b px-3 py-4 md:px-16">
              <p className="text-2xl font-medium">All Customers</p>
              <ButtonModule
                variant="primary"
                size="md"
                icon={<AddBusiness />}
                iconPosition="start"
                onClick={() => setIsAddCustomerModalOpen(true)}
              >
                Add Customer
              </ButtonModule>
            </div>

            <div className="flex w-full gap-6 px-16 max-md:flex-col max-md:px-0 max-sm:my-4 max-sm:px-3 md:my-8">
              <div className="w-full">
                <div className="flex w-full gap-3 max-lg:grid max-lg:grid-cols-2 max-sm:grid-cols-1">
                  <div className="flex w-full max-sm:flex-col">
                    <div className="w-full">
                      <div className="mb-3 flex w-full cursor-pointer gap-3 max-sm:flex-col ">
                        {/* Overview starts */}
                        <div className="small-card rounded-md p-2 transition duration-500 md:border">
                          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                            <InsightIcon />
                            Overview
                          </div>
                          <div className="flex flex-col items-end justify-between gap-3 pt-4">
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Accounts count:</p>
                              <p className="text-secondary font-medium">
                                {isCustomersLoading ? "Loading..." : formatNumber(totalCustomers)}
                              </p>
                            </div>
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Active Accounts:</p>
                              <p className="text-secondary font-medium">
                                {isCustomersLoading ? "Loading..." : formatNumber(activeCustomers)}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Overview ends */}
                        {/* Active Accounts starts */}
                        <div className="small-card rounded-md p-2 transition duration-500 md:border">
                          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                            <IncomingIcon />
                            Active Accounts
                          </div>
                          <div className="flex flex-col items-end justify-between gap-3 pt-4">
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Total:</p>
                              <p className="text-secondary font-medium">
                                {isCustomersLoading ? "Loading..." : formatNumber(activeCustomers)}
                              </p>
                            </div>
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Percentage:</p>
                              <p className="text-secondary font-medium">
                                {isCustomersLoading
                                  ? "..."
                                  : `${Math.round((activeCustomers / totalCustomers) * 100)}%`}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Active Accounts ends */}
                        {/* Frozen Accounts starts */}
                        <div className="small-card rounded-md p-2 transition duration-500 md:border">
                          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                            <OutgoingIcon />
                            Frozen Accounts
                          </div>
                          <div className="flex flex-col items-end justify-between gap-3 pt-4">
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Total:</p>
                              <p className="text-secondary font-medium">
                                {isCustomersLoading ? "Loading..." : formatNumber(frozenCustomers)}
                              </p>
                            </div>
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Percentage:</p>
                              <p className="text-secondary font-medium">
                                {isCustomersLoading
                                  ? "..."
                                  : `${Math.round((frozenCustomers / totalCustomers) * 100)}%`}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Frozen Accounts ends */}
                        {/* Inactive Accounts starts */}
                        <div className="small-card rounded-md p-2 transition duration-500 md:border">
                          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                            <UnresolvedTransactions />
                            Inactive Accounts
                          </div>
                          <div className="flex flex-col items-end justify-between gap-3 pt-4">
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Total:</p>
                              <div className="flex gap-1">
                                <p className="text-secondary font-medium">
                                  {isPendingLoading ? "Loading..." : formatNumber(inactiveCustomers)}
                                </p>
                                <ArrowIcon />
                              </div>
                            </div>
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Pending Approval:</p>
                              <p className="text-secondary font-medium">
                                {isPendingLoading ? "..." : inactiveCustomers}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Inactive Accounts ends */}
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
      <AddCustomerModal
        isOpen={isAddCustomerModalOpen}
        onRequestClose={() => setIsAddCustomerModalOpen(false)}
        onSuccess={handleAddCustomerSuccess}
      />
    </section>
  )
}
